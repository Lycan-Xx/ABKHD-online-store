import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../services/strapi';

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
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
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