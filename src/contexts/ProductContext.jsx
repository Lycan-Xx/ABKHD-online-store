import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../services/strapi';
import strapiAPI from '../services/strapi';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data from Strapi...');
        
        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        
        console.log('Fetched products:', productsData);
        console.log('Fetched categories:', categoriesData);
        
        // Debug: Log full API response
        const productsResponse = await strapiAPI.get('/products?populate=*');
        console.log('Full products API response:', productsResponse);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response) {
          console.error('API response error:', err.response.status, err.response.data);
        } else if (err.request) {
          console.error('No response received:', err.request);
        } else {
          console.error('Request setup error:', err.message);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refetch data every 30 seconds to keep inventory updated
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refetchProducts = async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (err) {
      setError('Failed to refetch products');
    }
  };

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
  );
};