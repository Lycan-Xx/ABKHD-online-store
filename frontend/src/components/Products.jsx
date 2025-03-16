import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getProducts } from '../services/products';
import { getSettings } from '../services/settings';
import { fadeIn, staggerContainer } from '../utils/animations';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'latest',
  });
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, settingsData] = await Promise.all([
          getProducts(),
          getSettings(),
        ]);
        console.log('Products data received:', JSON.stringify(productsData[0], null, 2));
        setProducts(productsData);
        setSettings(settingsData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      if (filters.category === 'all') return true;
      return product?.category === filters.category;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sortBy === 'priceLow') return a.price - b.price;
      if (filters.sortBy === 'priceHigh') return b.price - a.price;
      return 0;
    });

  const categories = ['all', 'phones', 'computer'];

  if (loading) {
    return (
      <section id="products" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={`loading-${index}`} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse border border-gray-700">
                <div className="h-64 bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/3 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Products</h2>
          <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeIn} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Premium Collection
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse our selection of high-quality, thoroughly tested second-hand mobile phones and laptops at competitive prices.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={fadeIn}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilters({ ...filters, category })}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.category === category
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                } transition-colors`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="bg-gray-800 text-gray-300 rounded-lg border border-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="latest">Latest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </motion.div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <motion.div variants={fadeIn} className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
            <p className="text-gray-400">No products found. Please try different filters.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Similar Products Section */}
      {selectedProduct && (
        <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-8">Similar Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter(
                (p) =>
                  p.category === selectedProduct.category &&
                  p._id !== selectedProduct._id &&
                  p.id !== selectedProduct.id
              )
              .slice(0, 4)
              .map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onClick={setSelectedProduct}
                />
              ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            settings={settings}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Products;
