import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import { ProductProvider } from './contexts/ProductContext'
import { AdminProductProvider } from './contexts/AdminProductContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import SuccessPage from './pages/SuccessPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import ProductsListPage from './pages/admin/ProductsListPage'
import ProductEditorPage from './pages/admin/ProductEditorPage'

function App() {
  return (
    <ToastProvider>
      <ProductProvider>
        <CartProvider>
          <Routes>
            {/* Store Routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
            <Route path="/category/:category" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/success" element={<Layout><SuccessPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminProductProvider><AdminLayout /></AdminProductProvider>}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsListPage />} />
              <Route path="products/new" element={<ProductEditorPage />} />
              <Route path="products/:id" element={<ProductEditorPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </ProductProvider>
    </ToastProvider>
  )
}

export default App