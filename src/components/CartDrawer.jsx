import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../lib/utils'

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, getCartTotal } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Close cart"
            >
              <i className="bi bi-x text-xl"></i>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <i className="bi bi-bag text-4xl text-muted-foreground mb-4"></i>
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.cartId} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        <p>{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-6 h-6 rounded border flex items-center justify-center hover:bg-accent"
                        >
                          <i className="bi bi-dash text-xs"></i>
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-6 h-6 rounded border flex items-center justify-center hover:bg-accent"
                        >
                          <i className="bi bi-plus text-xs"></i>
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
                      aria-label="Remove item"
                    >
                      <i className="bi bi-trash text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total: {formatPrice(getCartTotal())}</span>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="w-full btn-primary block text-center border-2 border-accent shadow-lg hover:scale-105 transition-transform duration-200 dark:border-accent/80 focus:ring-2 focus:ring-accent/60"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CartDrawer
