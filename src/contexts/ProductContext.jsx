import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchProducts, fetchCategories } from '../services/strapi'

const ProductContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching data from Strapi...')
        
        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ])
        
        console.log('Fetched products:', productsData)
        console.log('Fetched categories:', categoriesData)
        
        setProducts(Array.isArray(productsData) ? productsData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (err) {
        console.error('Error fetching data:', err)
        if (err.response) {
          console.error('API response error:', err.response.status, err.response.data)
        } else if (err.request) {
          console.error('No response received:', err.request)
        } else {
          console.error('Request setup error:', err.message)
        }
        setError(err)
        
        // Fallback to local data if API fails
        console.log('Falling back to local data...')
        try {
          const { products: localProducts, categories: localCategories } = await import('../data/products.js')
          setProducts(Array.isArray(localProducts) ? localProducts : [])
          setCategories(Array.isArray(localCategories) ? localCategories : [])
        } catch (importError) {
          console.error('Failed to load local data:', importError)
          setProducts([])
          setCategories([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Refetch data every 5 minutes to keep inventory updated
    const interval = setInterval(fetchData, 300000)
    
    return () => clearInterval(interval)
  }, [])

  const refetchProducts = async () => {
    try {
      setError(null)
      const productsData = await fetchProducts()
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (err) {
      console.error('Error refetching products:', err)
      setError('Failed to refetch products')
    }
  }

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        categories, 
        loading, 
        error,
        refetchProducts 
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}