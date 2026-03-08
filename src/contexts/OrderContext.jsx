import React, { createContext, useContext, useState, useEffect } from 'react'

const OrderContext = createContext()

// Generate a unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${randomStr}`
}

// Generate a payment reference
const generatePaymentRef = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `PAY-${timestamp}-${randomStr}`
}

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error('Error loading orders from localStorage:', error)
      }
    }
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  // Create a new order
  const createOrder = (orderData) => {
    const newOrder = {
      id: generateOrderId(),
      paymentRef: generatePaymentRef(),
      ...orderData,
      status: 'completed',
      createdAt: new Date().toISOString()
    }
    
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  // Get all completed orders
  const getCompletedOrders = () => {
    return orders.filter(order => order.status === 'completed')
  }

  // Get total revenue
  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + (order.total || 0), 0)
  }

  // Get order count
  const getOrderCount = () => {
    return orders.filter(order => order.status === 'completed').length
  }

  // Generate receipt for an order
  const generateReceipt = (order) => {
    const receiptText = `
========================================
         ABKHD STORE - RECEIPT
========================================

Order ID: ${order.id}
Payment Ref: ${order.paymentRef}
Date: ${new Date(order.createdAt).toLocaleString()}

----------------------------------------
CUSTOMER DETAILS
----------------------------------------
Name: ${order.customer?.fullName || 'N/A'}
Email: ${order.customer?.email || 'N/A'}
Phone: ${order.customer?.phone || 'N/A'}
Address: ${order.customer?.address || 'N/A'}
City: ${order.customer?.city || 'N/A'}
State: ${order.customer?.state || 'N/A'}

----------------------------------------
ORDER ITEMS
----------------------------------------
${order.items?.map((item, index) => `
${index + 1}. ${item.name}
   ${item.size ? `Size: ${item.size}` : ''} ${item.color ? `Color: ${item.color}` : ''}
   Qty: ${item.quantity} x ₦${item.price?.toLocaleString()}
   Subtotal: ₦${(item.price * item.quantity).toLocaleString()}
`).join('')}

----------------------------------------
PAYMENT SUMMARY
----------------------------------------
Subtotal: ₦${order.subtotal?.toLocaleString() || 0}
Shipping: ₦${order.shipping?.toLocaleString() || 0}
Total: ₦${order.total?.toLocaleString() || 0}

Payment Status: PAID
Payment Ref: ${order.paymentRef}

========================================
    Thank you for your purchase!
========================================
    `
    return receiptText.trim()
  }

  // Copy receipt to clipboard
  const copyReceipt = async (order) => {
    const receipt = generateReceipt(order)
    try {
      await navigator.clipboard.writeText(receipt)
      return true
    } catch (error) {
      console.error('Failed to copy receipt:', error)
      return false
    }
  }

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      getCompletedOrders,
      getTotalRevenue,
      getOrderCount,
      generateReceipt,
      copyReceipt
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}
