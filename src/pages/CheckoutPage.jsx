import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { formatPrice } from '../lib/utils'
import BackButton from '../components/ui/BackButton'
import Breadcrumb from '../components/ui/Breadcrumb'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getCartTotal } = useCart()
  const { addToast } = useToast()
  
  // Get WhatsApp number from environment variables
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/')
    }
  }, [items, navigate])

  const generateWhatsAppMessage = () => {
    if (!WHATSAPP_NUMBER) {
      console.error('WhatsApp phone number not configured')
      addToast('WhatsApp contact not available. Please contact us directly.', 'error')
      return null
    }

    let message = "Hi, I'm interested in completing my order:\n\n"
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      if (item.size) message += `   Size: ${item.size}\n`
      if (item.color) message += `   Color: ${item.color}\n`
      message += `   Quantity: ${item.quantity}\n`
      message += `   Price: ${formatPrice(item.price * item.quantity)}\n\n`
    })
    
    message += `Total: ${formatPrice(getCartTotal())}\n\n`
    message += "Please let me know about payment and delivery options."
    
    return encodeURIComponent(message)
  }

  const handleWhatsAppCheckout = () => {
    if (!WHATSAPP_NUMBER) {
      addToast('WhatsApp contact not available. Please contact us directly.', 'error')
      return
    }

    const message = generateWhatsAppMessage()
    if (!message) {
      return
    }
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
    
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Failed to open WhatsApp:', error)
      addToast('Failed to open WhatsApp. Please try again.', 'error')
    }
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Navigation */}
      <div className="mb-12">
        <Breadcrumb className="mb-4" />
        <BackButton to="/" text="Back to Home" variant="prominent" />
      </div>
      
      {/* Content Container */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Complete Your Order</h1>
          <p className="text-muted-foreground">Choose your preferred checkout method</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.cartId} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <div className="text-xs text-muted-foreground">
                        {item.size && <span>Size: {item.size} </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs">Qty: {item.quantity}</span>
                        <span className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Options - Right Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* WhatsApp Checkout - Available Now */}
            <div className="border-2 border-primary rounded-xl overflow-hidden">
              <div className="bg-primary/5 px-6 py-3 border-b border-primary/20">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    ✓ AVAILABLE NOW
                  </span>
                  <h2 className="text-lg font-bold">WhatsApp Checkout</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-whatsapp text-green-600 dark:text-green-400 text-3xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Complete order via WhatsApp</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Chat with us directly to finalize your purchase. We'll guide you through payment and delivery.
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-check-circle-fill text-green-600 dark:text-green-400 text-sm mt-0.5"></i>
                    <span className="text-sm">Flexible payment options</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-check-circle-fill text-green-600 dark:text-green-400 text-sm mt-0.5"></i>
                    <span className="text-sm">Personalized service</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-check-circle-fill text-green-600 dark:text-green-400 text-sm mt-0.5"></i>
                    <span className="text-sm">Delivery arrangements</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-check-circle-fill text-green-600 dark:text-green-400 text-sm mt-0.5"></i>
                    <span className="text-sm">Product verification</span>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-3 transition-colors shadow-lg hover:shadow-xl"
                >
                  <i className="bi bi-whatsapp text-2xl"></i>
                  <span className="text-lg">Continue on WhatsApp</span>
                </button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  <i className="bi bi-clock mr-1"></i>
                  We typically respond within minutes
                </p>
              </div>
            </div>

            {/* Online Payment - Coming Soon */}
            <div className="border-2 border-border rounded-xl overflow-hidden opacity-60">
              <div className="bg-muted/50 px-6 py-3 border-b border-border">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                    🚀 COMING SOON
                  </span>
                  <h2 className="text-lg font-bold">Online Payment</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-credit-card text-muted-foreground text-3xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Pay directly with card</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      We're working on adding secure online payment. Soon you'll be able to checkout instantly with your card.
                    </p>
                  </div>
                </div>

                {/* Future Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-lightning-fill text-muted-foreground text-sm mt-0.5"></i>
                    <span className="text-sm text-muted-foreground">Instant checkout</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-shield-check text-muted-foreground text-sm mt-0.5"></i>
                    <span className="text-sm text-muted-foreground">Secure payment</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-receipt text-muted-foreground text-sm mt-0.5"></i>
                    <span className="text-sm text-muted-foreground">Automatic confirmation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-truck text-muted-foreground text-sm mt-0.5"></i>
                    <span className="text-sm text-muted-foreground">Faster processing</span>
                  </div>
                </div>

                {/* Disabled Button */}
                <button
                  disabled
                  className="w-full py-4 px-6 bg-muted text-muted-foreground font-semibold rounded-lg flex items-center justify-center space-x-3 cursor-not-allowed"
                >
                  <i className="bi bi-lock text-xl"></i>
                  <span className="text-lg">Not Available Yet</span>
                </button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  <i className="bi bi-bell mr-1"></i>
                  We'll notify you when this feature launches
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
