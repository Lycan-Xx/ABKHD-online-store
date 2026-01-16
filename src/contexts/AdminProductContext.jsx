import React, { createContext, useContext, useState, useEffect } from 'react'
import { useProducts } from './ProductContext'

const AdminProductContext = createContext()

export const useAdminProducts = () => {
  const context = useContext(AdminProductContext)
  if (!context) {
    throw new Error('useAdminProducts must be used within an AdminProductProvider')
  }
  return context
}

export const AdminProductProvider = ({ children }) => {
  const { products: storeProducts, categories: storeCategories } = useProducts()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  // Initialize with store data
  useEffect(() => {
    if (storeProducts.length > 0) {
      // Add admin-specific fields to products
      const adminProducts = storeProducts.map(product => ({
        ...product,
        isActive: true,
        isArchived: false,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      setProducts(adminProducts)
    }
  }, [storeProducts])

  useEffect(() => {
    if (storeCategories.length > 0) {
      setCategories(storeCategories)
    }
  }, [storeCategories])

  // Add a new product
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: !productData.isArchived,
      isArchived: productData.isArchived || false
    }
    setProducts(prev => [newProduct, ...prev])
    return newProduct
  }

  // Update an existing product
  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    ))
  }

  // Delete a product
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  // Toggle product active status
  const toggleProductActive = (id) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, isActive: !product.isActive, updatedAt: new Date().toISOString() }
        : product
    ))
  }

  // Get product by ID
  const getProduct = (id) => {
    return products.find(product => product.id === id || product.id === parseInt(id))
  }

  // Get stats for dashboard
  const getStats = () => {
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.isActive && !p.isArchived).length
    const featuredProducts = products.filter(p => p.featured).length
    const archivedProducts = products.filter(p => p.isArchived).length
    const totalCategories = categories.length
    
    // Products by category
    const productsByCategory = categories.map(cat => ({
      name: cat.name,
      count: products.filter(p => 
        p.category?.toLowerCase() === cat.name?.toLowerCase() ||
        p.category?.toLowerCase() === cat.id?.toLowerCase()
      ).length
    }))

    return {
      totalProducts,
      activeProducts,
      featuredProducts,
      archivedProducts,
      totalCategories,
      productsByCategory
    }
  }

  return (
    <AdminProductContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        getProduct,
        getStats
      }}
    >
      {children}
    </AdminProductContext.Provider>
  )
}
