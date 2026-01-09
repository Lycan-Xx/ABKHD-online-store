import * as prismic from '@prismicio/client'

// Initialize Prismic client
const repositoryName = import.meta.env.VITE_PRISMIC_REPO_NAME
const accessToken = import.meta.env.VITE_PRISMIC_ACCESS_TOKEN || null

// Create client instance
const client = prismic.createClient(repositoryName, {
  accessToken,
  routes: [
    { type: 'product', path: '/products/:uid' },
    { type: 'category', path: '/categories/:uid' }
  ]
})

console.log('Prismic Client initialized:', repositoryName)

// Helper to get image URL from Prismic image field
const getImageUrl = (imageField) => {
  if (!imageField) return null
  return imageField.url || null
}

// Helper to get multiple image URLs
const getImageUrls = (imagesGroup) => {
  if (!imagesGroup || !Array.isArray(imagesGroup)) return []
  return imagesGroup
    .map(item => item.image?.url)
    .filter(Boolean)
}

// Helper to convert Prismic rich text to plain text
const richTextToPlainText = (richText) => {
  if (!richText) return ''
  
  // If it's already a string, return it
  if (typeof richText === 'string') return richText
  
  // If it's an array of rich text blocks
  if (Array.isArray(richText)) {
    return richText
      .map(block => {
        if (block.text) return block.text
        if (block.type === 'paragraph' && block.text) return block.text
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }
  
  return ''
}

// Map Prismic product document to your app's product structure
const mapProduct = (doc) => {
  if (!doc || !doc.data) return null

  const data = doc.data
  
  // Log the raw data to see what we're getting
  console.log('Raw product data:', {
    name: data.name,
    description: data.description,
    long_description: data.long_description
  })
  
  return {
    id: doc.id,
    documentId: doc.uid,
    name: data.name || '',
    price: data.price || 0,
    originalPrice: data.original_price || null,
    description: richTextToPlainText(data.description) || '',
    longDescription: richTextToPlainText(data.long_description) || '',
    stock: data.stock || 0,
    featured: data.featured || false,
    tags: data.tags?.map(t => t.tag).filter(Boolean) || [],
    image: getImageUrl(data.main_image),
    images: getImageUrls(data.additional_images) || [],
    category: data.category?.data?.name || 'Uncategorized'
  }
}

// Map Prismic category document to your app's category structure
const mapCategory = (doc) => {
  if (!doc || !doc.data) return null

  const data = doc.data

  return {
    id: doc.id,
    documentId: doc.uid,
    name: data.name || '',
    description: richTextToPlainText(data.description) || '',
    image: getImageUrl(data.image)
  }
}

// Fetch all products with populated category data
export const fetchProducts = async () => {
  try {
    console.log('Fetching products from Prismic...')
    
    const response = await client.getAllByType('product', {
      fetchLinks: ['category.name'],
      orderings: [
        { field: 'my.product.featured', direction: 'desc' },
        { field: 'document.first_publication_date', direction: 'desc' }
      ]
    })

    console.log('Prismic products response:', response)

    const products = response.map(mapProduct).filter(Boolean)
    
    console.log('Mapped products:', products.length)
    return products
  } catch (error) {
    console.error('Error fetching products from Prismic:', error)
    throw error
  }
}

// Fetch all categories
export const fetchCategories = async () => {
  try {
    console.log('Fetching categories from Prismic...')
    
    const response = await client.getAllByType('category', {
      orderings: [
        { field: 'my.category.name', direction: 'asc' }
      ]
    })

    console.log('Prismic categories response:', response)

    const categories = response.map(mapCategory).filter(Boolean)
    
    console.log('Mapped categories:', categories.length)
    return categories
  } catch (error) {
    console.error('Error fetching categories from Prismic:', error)
    throw error
  }
}

// Fetch single product by UID or ID
export const fetchProduct = async (id) => {
  try {
    console.log('Fetching single product from Prismic:', id)
    
    let response
    
    // Try fetching by UID first
    try {
      response = await client.getByUID('product', id, {
        fetchLinks: ['category.name']
      })
    } catch (uidError) {
      // If UID fails, try by ID
      console.log('UID fetch failed, trying by ID...')
      response = await client.getByID(id, {
        fetchLinks: ['category.name']
      })
    }

    console.log('Prismic single product response:', response)

    const product = mapProduct(response)
    
    if (!product) {
      throw new Error('Product not found')
    }
    
    return product
  } catch (error) {
    console.error('Error fetching product from Prismic:', error)
    throw error
  }
}
