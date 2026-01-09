
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { formatPrice } from '../lib/utils'
import BackButton from '../components/ui/BackButton'
import Breadcrumb from '../components/ui/Breadcrumb'

const InquiryPage = () => {
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

    let message = "Hi, I'm interested in these items:\n\n"
    
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

  const handleWhatsAppRedirect = () => {
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
    <div className="container py-8 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <Breadcrumb className="mb-4" />
          <BackButton to="/payment-options" text="Back to Payment Options" variant="prominent" />
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Local Inquiry</h1>
        </div>
        
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.cartId} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                  crossOrigin="anonymous"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {item.size && <span>Size: {item.size} </span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm">Qty: {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <i className="bi bi-whatsapp text-green-600 dark:text-green-400 text-2xl"></i>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Contact Us on WhatsApp</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Click the button below to send your order details via WhatsApp. 
              We'll provide you with payment options and delivery information.
            </p>
          </div>

          <button
            onClick={handleWhatsAppRedirect}
            className="w-full btn-primary py-4 text-lg bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 flex items-center justify-center space-x-2 transition-colors"
          >
            <i className="bi bi-whatsapp text-xl"></i>
            <span>Send Inquiry via WhatsApp</span>
          </button>

          
        </div>
      </div>
    </div>
  )
}

export default InquiryPage
