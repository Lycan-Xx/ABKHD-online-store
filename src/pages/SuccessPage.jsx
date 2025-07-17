import React from 'react'
import { Link } from 'react-router-dom'

const SuccessPage = () => {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="bi bi-check-circle-fill text-green-600 text-2xl"></i>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
        </p>
        
        <div className="space-y-4">
          <Link to="/products" className="w-full btn-primary block text-center">
            Continue Shopping
          </Link>
          <Link to="/" className="w-full btn-secondary block text-center">
            Back to Home
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• You will receive an order confirmation email</li>
            <li>• Your order will be processed within 1-2 business days</li>
            <li>• You will receive tracking information once shipped</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
