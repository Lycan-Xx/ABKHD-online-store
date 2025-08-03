import axios from 'axios';

const strapiAPI = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

console.log('Strapi API Base URL:', import.meta.env.VITE_STRAPI_API_URL)
console.log('Strapi Media URL:', import.meta.env.VITE_STRAPI_MEDIA_URL)

// Add request interceptor for debugging
strapiAPI.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
strapiAPI.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

// Handle Strapi v4 media URLs
const getImageUrl = (imageData, mediaUrl) => {
  if (!imageData) return null
  
  // Handle direct URL string
  if (typeof imageData === 'string') {
    return imageData.startsWith('http') ? imageData : `${mediaUrl}${imageData}`
  }

  // Get the URL from various possible structures
  const url = imageData?.data?.attributes?.url ||
              imageData?.attributes?.url ||
              imageData?.url
  
  if (!url) return null
  
  // If it's already a complete URL, return as-is
  if (url.startsWith('http')) {
    return url
  }
  
  // Otherwise, construct the full URL
  return `${mediaUrl}${url.startsWith('/') ? url : `/${url}`}`
}

// Fetch all products with populated fields
export const fetchProducts = async () => {
  try {
    const response = await strapiAPI.get('/products?populate=deep')
    console.log('Raw Strapi response:', response)
    
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      console.warn('No products data found in response')
      return []
    }

    const mediaUrl = import.meta.env.VITE_STRAPI_MEDIA_URL
    console.log('Using Media URL:', mediaUrl)

    return response.data.data.map(item => {
      // Strapi v4 structure: item has id and attributes
      if (!item || !item.attributes) {
        console.warn('Invalid product item structure:', item)
        return null
      }
      
      const { id, attributes } = item
      
      // Ensure category is properly extracted
      const categoryData = attributes?.category?.data?.attributes || 
                          attributes?.category?.attributes || 
                          attributes?.category || {}
      
      return {
        id: id,
        documentId: attributes.documentId || id,
        name: attributes.name || '',
        price: attributes.price || 0,
        originalPrice: attributes.originalPrice,
        description: attributes.description || '',
        longDescription: attributes.longDescription || '',
        stock: attributes.stock || 0,
        featured: attributes.featured || false,
        tags: attributes.tags || [],
        image: getImageUrl(attributes.image, mediaUrl),
        images: getImageUrls(attributes.images, mediaUrl),
        category: categoryData.name || categoryData.Name || 'Uncategorized'
      }
    }).filter(Boolean)
  } catch (error) {
    console.error('Error fetching products:', error)
    if (error.response?.status === 404) {
      console.warn('Products endpoint not found. Make sure you have created the Product content type in Strapi.')
    }
    throw error
  }
}

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await strapiAPI.get('/categories?populate=deep')
    console.log('Strapi categories response:', response.data)
    
    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.warn('No categories data found in response')
      return []
    }

    const mediaUrl = import.meta.env.VITE_STRAPI_MEDIA_URL
    console.log('Using Media URL:', mediaUrl)
    
    return response.data.data.map(item => {
      if (!item || !item.attributes) {
        console.warn('Invalid category item structure:', item)
        return null
      }

      // Check if item has attributes (Strapi v4) or direct properties (your structure)
      const itemData = item.attributes
      
      if (!itemData) {
        console.warn('No data found in category item:', item)
        return null
      }

      return {
        id: item.id,
        documentId: itemData.documentId || item.id,
        name: itemData.name || itemData.Name,
        description: itemData.description || itemData.Description,
        ...itemData,
        image: getImageUrl(itemData.image, mediaUrl)
      }
    }).filter(Boolean) // Remove null items
  } catch (error) {
    console.error('Error fetching categories:', error)
    if (error.response?.status === 404) {
      console.warn('Categories endpoint not found. Make sure you have created the Category content type in Strapi.')
    }
    throw error
  }
}

// Fetch single product
export const fetchProduct = async (id) => {
  try {
    const response = await strapiAPI.get(`/products/${id}?populate=deep`)
    console.log('Strapi single product response:', response.data)
    
    if (!response.data.data) {
      throw new Error('Product not found')
    }

    const item = response.data.data
    const mediaUrl = import.meta.env.VITE_STRAPI_MEDIA_URL
    console.log('Using Media URL:', mediaUrl)

    // Properly extract attributes from Strapi v4 response
    const { id: itemId, attributes } = item

    return {
      id: itemId,
      documentId: attributes.documentId || itemId,
      name: attributes.name || '',
      price: attributes.price || 0,
      originalPrice: attributes.originalPrice,
      description: attributes.description || '',
      longDescription: attributes.longDescription || '',
      stock: attributes.stock || 0,
      featured: attributes.featured || false,
      tags: attributes.tags || [],
      image: getImageUrl(attributes.image, mediaUrl),
      images: getImageUrls(attributes.images, mediaUrl),
      category: attributes.category?.data?.attributes?.name ||
               attributes.category?.attributes?.name ||
               attributes.category || 'Uncategorized'
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}
