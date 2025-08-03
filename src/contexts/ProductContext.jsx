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
  const [dataSource, setDataSource] = useState('unknown') // Track data source

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching data from Strapi...')
        console.log('Environment variables:', {
          STRAPI_API: import.meta.env.VITE_STRAPI_API_URL,
          STRAPI_MEDIA: import.meta.env.VITE_STRAPI_MEDIA_URL
        })
       
        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ])
       
        console.log('✅ SUCCESS - Fetched from Strapi API')
        console.log('Fetched products:', productsData)
        console.log('Fetched categories:', categoriesData)
        
        // Log image URLs for debugging
        if (productsData.length > 0) {
          console.log('Sample product images:')
          productsData.slice(0, 3).forEach(product => {
            console.log(`${product.name}: ${product.image}`)
          })
        }
       
        setProducts(Array.isArray(productsData) ? productsData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        setDataSource('strapi')
      } catch (err) {
        console.error('❌ FAILED - Error fetching from Strapi:', err)
        if (err.response) {
          console.error('API response error:', err.response.status, err.response.data)
        } else if (err.request) {
          console.error('No response received:', err.request)
        } else {
          console.error('Request setup error:', err.message)
        }
        setError(err)
       
        // Fallback to local data if API fails
        console.log('🔄 FALLBACK - Loading local data...')
        try {
          const { products: localProducts, categories: localCategories } = await import('../data/products.js')
          console.log('✅ SUCCESS - Loaded local data')
          console.log('Local products:', localProducts)
          console.log('Local categories:', localCategories)
          
          // Log local image URLs for debugging
          if (localProducts && localProducts.length > 0) {
            console.log('Sample local product images:')
            localProducts.slice(0, 3).forEach(product => {
              console.log(`${product.name}: ${product.image}`)
            })
          }
          
          setProducts(Array.isArray(localProducts) ? localProducts : [])
          setCategories(Array.isArray(localCategories) ? localCategories : [])
          setDataSource('local')
        } catch (importError) {
          console.error('❌ FAILED - Error loading local data:', importError)
          setProducts([])
          setCategories([])
          setDataSource('none')
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
      console.log('🔄 Refetching products...')
      const productsData = await fetchProducts()
      setProducts(Array.isArray(productsData) ? productsData : [])
      console.log('✅ Products refetched successfully')
    } catch (err) {
      console.error('❌ Error refetching products:', err)
      setError('Failed to refetch products')
    }
  }

  // Debug logging when products change
  useEffect(() => {
    console.log(`📊 Products updated - Source: ${dataSource}, Count: ${products.length}`)
    if (products.length > 0) {
      console.log('Current products with images:')
      products.forEach(product => {
        console.log(`- ${product.name}: ${product.image || 'NO IMAGE'}`)
      })
    }
  }, [products, dataSource])

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        refetchProducts,
        dataSource // Add this for debugging
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}