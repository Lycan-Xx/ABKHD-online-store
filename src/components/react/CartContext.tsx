import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import type { Product } from '../../data/products'

interface CartItem extends Product {
  cartId: string
  quantity: number
  size?: string | null
  color?: string | null
}

interface CartState {
  items: CartItem[]
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  items: CartItem[]
  addItem: (product: Product, quantity?: number, size?: string | null, color?: string | null) => void
  removeItem: (cartId: string) => void
  updateQuantity: (cartId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item.id === action.payload.id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
      )
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && 
            item.size === action.payload.size && 
            item.color === action.payload.color
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        }
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.cartId !== action.payload)
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.cartId === action.payload.cartId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      }
    
    default:
      return state
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Function to add item (exposed for external use)
  const addItem = useCallback((product: Product, quantity = 1, size: string | null = null, color: string | null = null) => {
    const cartId = `${product.id}-${size || 'default'}-${color || 'default'}-${Date.now()}`
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        cartId,
        quantity,
        size,
        color
      }
    })
  }, [])

  // Listen for custom add-to-cart events from vanilla JS
  useEffect(() => {
    const handleAddToCart = (event: CustomEvent) => {
      const { product, quantity = 1, size = null, color = null } = event.detail || {}
      if (product) {
        addItem(product, quantity, size, color)
      }
    }

    window.addEventListener('add-to-cart', handleAddToCart as EventListener)
    return () => {
      window.removeEventListener('add-to-cart', handleAddToCart as EventListener)
    }
  }, [addItem])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
    
    // Update cart count in header
    const cartCountElement = document.getElementById('cart-count')
    if (cartCountElement) {
      const count = getCartCount()
      cartCountElement.textContent = count.toString()
      cartCountElement.classList.toggle('hidden', count === 0)
    }
  }, [state.items])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const removeItem = useCallback((cartId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartId })
  }, [])

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } })
    }
  }, [removeItem])

  const getCartTotal = useCallback(() => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [state.items])

  const getCartCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }, [state.items])

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}