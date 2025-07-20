import axios from 'axios';

const strapiAPI = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337/api',
});

// Ensure getImageUrl handles null or undefined imageData
const getImageUrl = (imageData, mediaUrl) => {
  if (!imageData) return null;
  
  // Handle direct URL string
  if (typeof imageData === 'string') {
    return imageData;
  }
  
  // Handle Strapi v4 structure
  if (imageData.data?.attributes?.url) {
    return `${mediaUrl}${imageData.data.attributes.url}`;
  }
  
  return null;
};

// Helper function to safely get multiple image URLs
const getImageUrls = (imagesData, mediaUrl) => {
  if (!imagesData?.data || !Array.isArray(imagesData.data)) return [];
  return imagesData.data.map(img => 
    img?.attributes?.url ? `${mediaUrl}${img.attributes.url}` : null
  ).filter(Boolean);
};

// Fetch all products with populated fields
export const fetchProducts = async () => {
  try {
    const response = await strapiAPI.get('/products?populate=*');
    console.log('Raw Strapi response:', response);
    
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      console.warn('No products data found in response');
      return [];
    }

    const mediaUrl = import.meta.env.VITE_STRAPI_MEDIA_URL || 'http://localhost:1337';

    return response.data.data.map(item => {
      const attributes = item?.attributes || {};
      
      // Ensure category is properly extracted
      const categoryData = attributes.category?.data?.attributes || {};
      
      return {
        id: item.id,
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
        category: categoryData.name || 'Uncategorized'
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await strapiAPI.get('/categories?populate=*');
    console.log('Strapi categories response:', response.data); // Debug log
    
    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.warn('No categories data found in response');
      return [];
    }

    const mediaUrl = import.meta.env.VITE_STRAPI_MEDIA_URL || 'http://localhost:1337';
    
    return response.data.data.map(item => {
      if (!item) {
        console.warn('Invalid category item structure:', item);
        return null;
      }

      // Check if item has attributes (Strapi v4) or direct properties (your structure)
      const itemData = item.attributes || item;
      
      if (!itemData) {
        console.warn('No data found in category item:', item);
        return null;
      }

      return {
        id: item.id,
        ...itemData,
        image: getImageUrl(itemData.image, mediaUrl)
      };
    }).filter(Boolean); // Remove null items
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch single product
export const fetchProduct = async (id) => {
  try {
    const response = await strapiAPI.get(`/products/${id}?populate=*`);
    console.log('Strapi single product response:', response.data); // Debug log
    
    if (!response.data.data) {
      throw new Error('Product not found');
    }

    const item = response.data.data;
    const mediaUrl = import.meta.env.VITE_STRAPI_MEDIA_URL || 'http://localhost:1337';

    // Check if item has attributes (Strapi v4) or direct properties (your structure)
    const itemData = item.attributes || item;

    return {
      id: item.id,
      ...itemData,
      image: getImageUrl(itemData.image, mediaUrl),
      images: getImageUrls(itemData.images, mediaUrl),
      category: itemData.category?.data?.attributes?.name || 
               itemData.category || 'Uncategorized'
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};