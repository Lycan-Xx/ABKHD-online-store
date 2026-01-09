
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import BackButton from '../components/ui/BackButton'
import Breadcrumb from '../components/ui/Breadcrumb'

const PaymentOptionsPage = () => {
  const navigate = useNavigate()
  const { items } = useCart()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/')
    }
  }, [items, navigate])

  const handleOnlinePayment = () => {
    navigate('/checkout')
  }

  const handleLocalInquiry = () => {
    navigate('/inquiry')
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
        <div className="mb-8 text-center max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Payment Options</h1>
          <p className="text-muted-foreground">
            Choose your preferred payment method to continue
          </p>
        </div>
        
        <div className="space-y-4 max-w-md mx-auto">
          {/* Online Payment Option */}
          <button
            onClick={handleOnlinePayment}
            className="w-full p-6 border-2 border-input hover:border-primary rounded-lg text-left transition-all duration-200 hover:shadow-lg group bg-card"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <i className="bi bi-credit-card-2-front text-primary text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Online Payment</h3>
                <p className="text-muted-foreground text-sm">
                  Pay securely with your credit or debit card
                </p>
              </div>
              <i className="bi bi-chevron-right text-muted-foreground group-hover:text-foreground transition-colors"></i>
            </div>
          </button>

          {/* Local Inquiry Option */}
          <button
            onClick={handleLocalInquiry}
            className="w-full p-6 border-2 border-input hover:border-primary rounded-lg text-left transition-all duration-200 hover:shadow-lg group bg-card"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <i className="bi bi-whatsapp text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Local Inquiry</h3>
                <p className="text-muted-foreground text-sm">
                  Contact us via WhatsApp for local payment options
                </p>
              </div>
              <i className="bi bi-chevron-right text-muted-foreground group-hover:text-foreground transition-colors"></i>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentOptionsPage
