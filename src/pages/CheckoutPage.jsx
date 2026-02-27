import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { formatPrice } from '../lib/utils'
import BackButton from '../components/ui/BackButton'
import Breadcrumb from '../components/ui/Breadcrumb'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getCartTotal, clearCart } = useCart()
  const { addToast } = useToast()
  
  // Get WhatsApp number from environment variables
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER

  // State for online payment form
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [shippingDetails, setShippingDetails] = useState({
    email: '',
    phone: '',
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  })
  const [formErrors, setFormErrors] = useState({})

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingDetails(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!shippingDetails.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(shippingDetails.email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!shippingDetails.phone) {
      errors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-()]+$/.test(shippingDetails.phone)) {
      errors.phone = 'Phone number is invalid'
    }
    
    if (!shippingDetails.fullName) errors.fullName = 'Full name is required'
    if (!shippingDetails.address) errors.address = 'Address is required'
    if (!shippingDetails.city) errors.city = 'City is required'
    if (!shippingDetails.state) errors.state = 'State is required'
    if (!shippingDetails.postalCode) errors.postalCode = 'Postal code is required'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Check if form is complete (for button state)
  const isFormComplete = () => {
    return Object.values(shippingDetails).every(value => value.trim() !== '')
  }

  // Handle payment submission
  const handlePayment = async () => {
    if (!validateForm()) {
      addToast('Please fill in all required fields correctly', 'error')
      return
    }

    setIsProcessingPayment(true)

    try {
      // TODO: Integrate with your payment provider here
      // Example integrations:
      
      // STRIPE:
      // const stripe = await loadStripe('your_publishable_key')
      // const { error } = await stripe.confirmPayment({ ... })
      
      // PAYSTACK:
      // const handler = PaystackPop.setup({
      //   key: 'your_public_key',
      //   email: shippingDetails.email,
      //   amount: getCartTotal() * 100,
      //   onSuccess: (transaction) => { ... }
      // })
      // handler.openIframe()
      
      // FLUTTERWAVE:
      // FlutterwaveCheckout({
      //   public_key: "your_public_key",
      //   tx_ref: "unique_transaction_ref",
      //   amount: getCartTotal(),
      //   customer: { email: shippingDetails.email, ... }
      // })

      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // On successful payment:
      clearCart()
      addToast('Payment successful! Order confirmed.', 'success')
      navigate('/success')

    } catch (error) {
      console.error('Payment error:', error)
      addToast('Payment failed. Please try again.', 'error')
    } finally {
      setIsProcessingPayment(false)
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

            {/* Online Payment - Now Active */}
            <div className="border-2 border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
              <div className="bg-muted/30 px-6 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      💳 ONLINE PAYMENT
                    </span>
                    <h2 className="text-lg font-bold">Pay with Card</h2>
                  </div>
                  <button
                    onClick={() => setShowPaymentForm(!showPaymentForm)}
                    className="text-sm text-primary hover:underline flex items-center space-x-1"
                  >
                    <span>{showPaymentForm ? 'Hide' : 'Show'} Form</span>
                    <i className={`bi bi-chevron-${showPaymentForm ? 'up' : 'down'}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-credit-card text-primary text-3xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Pay directly with card</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Complete your purchase instantly with secure online payment.
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-lightning-fill text-primary text-sm mt-0.5"></i>
                    <span className="text-sm">Instant checkout</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-shield-check text-primary text-sm mt-0.5"></i>
                    <span className="text-sm">Secure payment</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-receipt text-primary text-sm mt-0.5"></i>
                    <span className="text-sm">Automatic confirmation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="bi bi-truck text-primary text-sm mt-0.5"></i>
                    <span className="text-sm">Faster processing</span>
                  </div>
                </div>

                {/* Shipping Details Form */}
                {showPaymentForm && (
                  <div className="border-t pt-6 mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="font-semibold text-lg mb-4">Shipping Details</h4>
                    
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={shippingDetails.email}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow ${
                            formErrors.email ? 'border-red-500' : 'border-input'
                          }`}
                          placeholder="your@email.com"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingDetails.phone}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow ${
                            formErrors.phone ? 'border-red-500' : 'border-input'
                          }`}
                          placeholder="+234 800 000 0000"
                        />
                        {formErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingDetails.fullName}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow ${
                          formErrors.fullName ? 'border-red-500' : 'border-input'
                        }`}
                        placeholder="John Doe"
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingDetails.address}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow ${
                          formErrors.address ? 'border-red-500' : 'border-input'
                        }`}
                        placeholder="123 Main Street, Apartment 4B"
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                      )}
                    </div>

                    {/* City, State, Postal Code */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingDetails.city}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow ${
                            formErrors.city ? 'border-red-500' : 'border-input'
                          }`}
                          placeholder="Lagos"
                        />
                        {formErrors.city && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={shippingDetails.state}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow ${
                            formErrors.state ? 'border-red-500' : 'border-input'
                          }`}
                          placeholder="Lagos"
                        />
                        {formErrors.state && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={shippingDetails.postalCode}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow ${
                            formErrors.postalCode ? 'border-red-500' : 'border-input'
                          }`}
                          placeholder="100001"
                        />
                        {formErrors.postalCode && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={!isFormComplete() || isProcessingPayment}
                  className={`w-full py-4 px-6 font-semibold rounded-lg flex items-center justify-center space-x-3 transition-all shadow-lg mt-6 ${
                    isFormComplete() && !isProcessingPayment
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-xl'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <i className="bi bi-arrow-clockwise animate-spin text-xl"></i>
                      <span className="text-lg">Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock text-xl"></i>
                      <span className="text-lg">
                        {isFormComplete() ? `Pay ${formatPrice(getCartTotal())}` : 'Complete Form to Continue'}
                      </span>
                    </>
                  )}
                </button>

                {!showPaymentForm && (
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    <i className="bi bi-info-circle mr-1"></i>
                    Click "Show Form" above to enter shipping details
                  </p>
                )}

                {showPaymentForm && !isFormComplete() && (
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    <i className="bi bi-exclamation-circle mr-1"></i>
                    Please fill in all required fields marked with *
                  </p>
                )}

                {showPaymentForm && isFormComplete() && (
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    <i className="bi bi-shield-check mr-1"></i>
                    Your payment information is secure and encrypted
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
