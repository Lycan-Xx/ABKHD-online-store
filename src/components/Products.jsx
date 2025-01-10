import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getProducts } from '../services/products';
import { fadeIn, staggerContainer } from '../utils/animations';
import { WHATSAPP_NUMBER } from '../utils/constants';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleImageNavigation = (direction) => {
    if (!selectedProduct) return;

    const totalImages = selectedProduct.images.length;
    setCurrentImageIndex((prevIndex) => {
      if (direction === 'left') {
        return prevIndex === 0 ? totalImages - 1 : prevIndex - 1;
      }
      if (direction === 'right') {
        return prevIndex === totalImages - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex;
    });
  };

  const ProductCard = ({ product, onClick }) => (
    <motion.div
      variants={fadeIn}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg"
      onClick={() => {
        onClick(product);
        setCurrentImageIndex(0); // Reset image index on new product selection
      }}
    >
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={product.images[0]} // Display the first image as the card thumbnail
          alt={product.name}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
        <p className="text-gray-300">{product.description}</p>
        <div className="mt-4">
          <span className="text-yellow-400 text-lg font-bold">₦{product.price.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );

  const ProductDetail = ({ product, onClose }) => {
    const handleWhatsApp = () => {
      const message = `Hi, I'm interested in ${product.name}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900/95 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-lg max-w-5xl w-full overflow-hidden relative shadow-xl"
          >
            {/* Exit Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-50"
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
              }}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="relative md:w-3/5">
                <motion.img
                  key={product.images[currentImageIndex]} // Key prop to trigger re-render
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  loading="lazy"
                />
                <button
                  onClick={() => handleImageNavigation('left')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700/75 text-white p-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => handleImageNavigation('right')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700/75 text-white p-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-3 w-3 rounded-full ${
                        index === currentImageIndex
                          ? 'bg-yellow-400'
                          : 'bg-gray-500 hover:bg-yellow-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">{selectedProduct.name}</h2>
                <p className="text-gray-300 mb-6">{selectedProduct.description}</p>
                <div className="mb-8">
                  <span className="text-3xl font-bold text-yellow-400">₦{selectedProduct.price.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Contact via WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg animate-pulse"></div>
            <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg animate-pulse"></div>
            <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg animate-pulse"></div>
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
          <p className="text-gray-400 text-center">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gray-900">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="initial"
        animate={inView ? 'animate' : 'initial'}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2
          variants={fadeIn}
          className="text-3xl font-bold text-white mb-12 text-center"
        >
          Our Products
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
          ))}
        </div>
      </motion.div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default Products;
