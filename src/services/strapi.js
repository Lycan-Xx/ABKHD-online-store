import axios from 'axios';

// Use the environment variable directly for the baseURL
const strapiAPI = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_API_URL || 'https://grounded-triumph-14beb219e4.strapiapp.com/api',
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
    console.log('Making request to:', config.baseURL + config.url)
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

// Simplified image URL handling - Strapi returns complete URLs
const getImageUrl = (imageData) => {
  if (!imageData) return null
  
  console.log('Processing image data:', imageData)
  
  // Handle direct URL string (shouldn't happen with Strapi v4, but just in case)
  if (typeof imageData === 'string') {
    console.log('Direct string URL:', imageData)
    return imageData
  }

  // Handle Strapi v4 structure
  const url = imageData?.data?.attributes?.url
  
  if (!url) {
    console.log('No URL found in image data')
    return null
  }
  
  // Strapi Cloud returns complete URLs, use them directly
  console.log('Found complete image URL:', url)
  return url
}

// Handle multiple images - Strapi returns complete URLs
const getImageUrls = (imagesData) => {
  console.log('Raw images data received:', imagesData)
  
  if (!imagesData?.data || !Array.isArray(imagesData.data)) {
    console.log('No images data found - structure check failed')
    return []
  }
  
  console.log('Processing images data:', imagesData.data.length, 'images')
  
  return imagesData.data.map((item, index) => {
    console.log(`Processing image ${index}:`, item)
    const url = item?.attributes?.url
    if (!url) {
      console.log('No URL found for image item:', item)
      return null
    }
    
    console.log('Found image URL:', url)
    return url
  }).filter(Boolean)
}

// Get the best image size for display
const getBestImageUrl = (imageData, preferredSize = 'medium') => {
  if (!imageData) return null
  
  const attributes = imageData?.data?.attributes
  if (!attributes) return null
  
  // Try to get the preferred size from formats
  const formats = attributes.formats
  if (formats && formats[preferredSize]) {
    console.log(`Using ${preferredSize} format:`, formats[preferredSize].url)
    return formats[preferredSize].url
  }
  
  // Fallback to original URL
  console.log('Using original image URL:', attributes.url)
  return attributes.url
}

// Fetch all products with populated fields
export const fetchProducts = async () => {
  try {
    const response = await strapiAPI.get('/products?populate=*')
    console.log('Raw Strapi response:', response)
    
    // Debug: Log the exact structure we receive
    if (response.data?.data?.[0]) {
      const firstProduct = response.data.data[0]
      console.log('First product structure:', firstProduct)
      console.log('First product attributes:', firstProduct.attributes)
      console.log('First product image field:', firstProduct.attributes?.image)
      console.log('First product images field:', firstProduct.attributes?.images)
    }
    
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      console.warn('No products data found in response')
      return []
    }

    const products = response.data.data.map(item => {
      // Strapi v4 structure: item has id and attributes
      if (!item || !item.attributes) {
        console.warn('Invalid product item structure:', item)
        return null
      }
      
      const { id, attributes } = item
      
      // Ensure category is properly extracted
      const categoryData = attributes?.category?.data?.attributes || {}
      
      const product = {
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
        // Debug the raw image data first
        image: (() => {
          console.log('Raw image data for', attributes.name, ':', attributes.image)
          const mainImage = getBestImageUrl(attributes.image, 'medium') || getImageUrl(attributes.image)
          console.log('Processed main image URL:', mainImage)
          return mainImage
        })(),
        // Get all image URLs with debugging
        images: (() => {
          console.log('Raw images data for', attributes.name, ':', attributes.images)
          const allImages = getImageUrls(attributes.images)
          console.log('Processed all images:', allImages)
          return allImages
        })(),
        category: categoryData.name || 'Uncategorized'
      }
      
      console.log('Processed product:', {
        name: product.name,
        image: product.image,
        imageCount: product.images.length
      })
      
      return product
    }).filter(Boolean)
    
    console.log('Final products processed:', products.length)
    return products
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
    const response = await strapiAPI.get('/categories?populate=*')
    console.log('Strapi categories response:', response.data)
    
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      console.warn('No categories data found in response')
      return []
    }
    
    return response.data.data.map(item => {
      if (!item || !item.attributes) {
        console.warn('Invalid category item structure:', item)
        return null
      }

      const itemData = item.attributes
      
      const category = {
        id: item.id,
        documentId: itemData.documentId || item.id,
        name: itemData.name,
        description: itemData.description,
        image: getImageUrl(itemData.image)
      }
      
      console.log('Processed category:', {
        name: category.name,
        image: category.image
      })
      
      return category
    }).filter(Boolean)
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
    const response = await strapiAPI.get(`/products/${id}?populate=*`)
    console.log('Strapi single product response:', response.data)
    
    if (!response.data?.data) {
      throw new Error('Product not found')
    }

    const item = response.data.data
    const { id: itemId, attributes } = item

    const product = {
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
      image: getBestImageUrl(attributes.image, 'medium') || getImageUrl(attributes.image),
      images: getImageUrls(attributes.images),
      category: attributes.category?.data?.attributes?.name || 'Uncategorized'
    }
    
    console.log('Fetched single product:', {
      name: product.name,
      image: product.image,
      imageCount: product.images.length
    })
    
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}