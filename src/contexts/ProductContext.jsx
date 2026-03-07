import React, { createContext, useContext, useState, useEffect } from 'react'

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
        console.log('Loading local data...')
        
        // Load from local data
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
      } catch (err) {
        console.error('❌ FAILED - Error loading local data:', err)
        setError(err)
        setProducts([])
        setCategories([])
        setDataSource('none')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
   
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000)
   
    return () => clearInterval(interval)
  }, [])

  const refetchProducts = async () => {
    try {
      setError(null)
      console.log('🔄 Refetching products...')
      const { products: localProducts } = await import('../data/products.js')
      setProducts(Array.isArray(localProducts) ? localProducts : [])
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