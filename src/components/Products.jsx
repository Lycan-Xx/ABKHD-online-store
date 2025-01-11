<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getProducts } from '../services/products';
import { getSettings } from '../services/settings';
import { fadeIn, staggerContainer } from '../utils/animations';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);
=======
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import PRODUCTS from './products.json'; // Import the JSON file
import { fadeIn, staggerContainer } from '../utils/animations';
import { WHATSAPP_NUMBER } from '../utils/constants';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
>>>>>>> merge-test
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

<<<<<<< HEAD
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, settingsData] = await Promise.all([
          getProducts(),
          getSettings()
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

=======
>>>>>>> merge-test
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

<<<<<<< HEAD
  const ProductCard = ({ product, onClick }) => {
    // Convert image array object to URL string
    const getImageUrl = (imageObj) => {
      if (!imageObj) return '';
      return Object.entries(imageObj)
        .filter(([key]) => !isNaN(key))
        .map(([, value]) => value)
        .join('');
    };

    const thumbnailUrl = product.images[0] ? getImageUrl(product.images[0]) : '';

    return (
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg"
        onClick={() => {
          onClick(product);
          setCurrentImageIndex(0);
        }}
      >
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={thumbnailUrl}
            alt={product.title}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
          <p className="text-gray-300">{product.description}</p>
          <div className="mt-4">
            <span className="text-yellow-400 text-lg font-bold">₦{product.price.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const ProductDetail = ({ product, onClose }) => {
    const [loadedImages, setLoadedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getImageUrl = (imageObj) => {
      if (!imageObj) return '';
      return Object.entries(imageObj)
        .filter(([key]) => !isNaN(key))
        .map(([, value]) => value)
        .join('');
    };

    // Preload images when the modal opens
    useEffect(() => {
      setIsLoading(true);
      const imageUrls = product.images.map(getImageUrl);
      
      Promise.all(
        imageUrls.map(
          url =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = url;
              img.onload = () => resolve(url);
              img.onerror = () => resolve(null);
            })
        )
      ).then((loaded) => {
        setLoadedImages(loaded.filter(Boolean));
        setIsLoading(false);
      });
    }, [product]);

    const handleImageNavigation = (direction) => {
      if (loadedImages.length <= 1) return;
      
      setCurrentImageIndex((prevIndex) => {
        if (direction === 'left') {
          return prevIndex === 0 ? loadedImages.length - 1 : prevIndex - 1;
        }
        return prevIndex === loadedImages.length - 1 ? 0 : prevIndex + 1;
      });
    };

    const handleWhatsApp = () => {
      if (!settings?.whatsappNumber) {
        console.error('WhatsApp number not loaded');
        return;
      }
      const message = `Hi, I'm interested in ${product.title}`;
      const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
=======
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
        <p className="text-gray-400 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 font-bold text-xl">${product.price}</span>
        </div>
      </div>
    </motion.div>
  );

  const ProductDetail = ({ product, onClose }) => {
    const handleWhatsApp = () => {
      const message = `Hi, I'm interested in ${product.name}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
>>>>>>> merge-test
      window.open(url, '_blank');
    };

    return (
<<<<<<< HEAD
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-gray-800 shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-sm transition-colors hover:bg-black/75 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <div className="relative h-[32rem]">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="h-12 w-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
                  </div>
                ) : (
                  <div className="relative h-full">
                    <div className="absolute inset-0">
                      {loadedImages.map((url, index) => (
                        <motion.div
                          key={url}
                          initial={false}
                          animate={{
                            opacity: index === currentImageIndex ? 1 : 0,
                            zIndex: index === currentImageIndex ? 1 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0"
                        >
                          <img
                            src={url}
                            alt={`${product.title} - Image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>

                    {loadedImages.length > 1 && (
                      <>
                        <motion.button
                          initial={false}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleImageNavigation('left')}
                          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-sm transition-all hover:bg-black/75 hover:text-white"
                        >
                          <ChevronLeftIcon className="h-6 w-6" />
                        </motion.button>
                        <motion.button
                          initial={false}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleImageNavigation('right')}
                          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-sm transition-all hover:bg-black/75 hover:text-white"
                        >
                          <ChevronRightIcon className="h-6 w-6" />
                        </motion.button>

                        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
                          {loadedImages.map((_, index) => (
                            <motion.button
                              key={index}
                              initial={false}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`h-2 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? 'w-8 bg-yellow-400'
                                  : 'w-2 bg-white/50 hover:bg-white/75'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white">{product.title}</h2>
                <p className="mt-2 text-gray-300">{product.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-yellow-400">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleWhatsApp}
                  className="mt-6 w-full rounded-lg bg-green-500 py-3 font-medium text-white transition-colors hover:bg-green-600"
=======
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

              <div className="md:w-2/5 p-8">
                <h2 className="text-2xl font-bold text-white mb-4">{product.name}</h2>
                <p className="text-gray-400 mb-6">{product.description}</p>
                <div className="mb-8">
                  <span className="text-3xl font-bold text-yellow-400">${product.price}</span>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
>>>>>>> merge-test
                >
                  Contact via WhatsApp
                </button>
              </div>
<<<<<<< HEAD
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={`loading-${index}`} className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg animate-pulse">
                <div className="h-64 bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
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
          <p className="text-gray-400 text-center">{error}</p>
        </div>
      </section>
    );
  }

=======
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

>>>>>>> merge-test
  return (
    <section id="products" className="py-20 bg-gray-900">
      <motion.div
        ref={ref}
        variants={staggerContainer}
<<<<<<< HEAD
        initial="hidden"
        animate={inView ? "show" : "hidden"}
=======
        initial="initial"
        animate={inView ? 'animate' : 'initial'}
>>>>>>> merge-test
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2
          variants={fadeIn}
          className="text-3xl font-bold text-white mb-12 text-center"
        >
          Our Products
        </motion.h2>

<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onClick={setSelectedProduct}
            />
=======
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
>>>>>>> merge-test
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
