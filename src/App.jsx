import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import PaymentOptionsPage from './pages/PaymentOptionsPage'
import CheckoutPage from './pages/CheckoutPage'
import InquiryPage from './pages/InquiryPage'
import SuccessPage from './pages/SuccessPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/payment-options" element={<PaymentOptionsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/inquiry" element={<InquiryPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </CartProvider>
    </ToastProvider>
  )
}

export default App