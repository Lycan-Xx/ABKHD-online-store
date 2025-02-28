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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  const ProductCard = ({ product, onClick }) => {
    const mainImageUrl = product.images[0]?.url || '';

    return (
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg"
        onClick={() => onClick(product)}
      >
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={mainImageUrl}
            alt={product.title}
            className="w-full h-64 object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'fallback-image-url';
              console.log('Image load error:', mainImageUrl);
            }}
          />
        </div>
        {/* Rest of the card content */}
      </motion.div>
    );
  };

  const ProductDetail = ({ product, onClose }) => {
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [loadedMedia, setLoadedMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Combine images and videos
    const allMedia = [
      ...product.images.map(img => ({ ...img, type: 'image' })),
      ...product.videos.map(vid => ({ ...vid, type: 'video' }))
    ];

    useEffect(() => {
      setIsLoading(true);
      Promise.all(
        allMedia.map(
          media =>
            new Promise((resolve) => {
              if (media.type === 'video') {
                resolve(media);
              } else {
                const img = new Image();
                img.src = media.url;
                img.onload = () => resolve(media);
                img.onerror = () => resolve(null);
              }
            })
        )
      ).then((loaded) => {
        setLoadedMedia(loaded.filter(Boolean));
        setIsLoading(false);
      });
    }, [product]);

    const handleImageNavigation = (direction) => {
      if (loadedMedia.length <= 1) return;
      
      setCurrentMediaIndex((prevIndex) => {
        if (direction === 'left') {
          return prevIndex === 0 ? loadedMedia.length - 1 : prevIndex - 1;
        }
        return prevIndex === loadedMedia.length - 1 ? 0 : prevIndex + 1;
      });
    };

    const handleWhatsApp = () => {
      if (!settings?.whatsappNumber) {
        console.error('WhatsApp number not loaded');
        return;
      }
      const message = `Hi, I'm interested in ${product.title}`;
      const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />
        
        <div className="min-h-full p-4 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl bg-gray-800 shadow-2xl rounded-lg my-8 max-h-[90vh] flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-sm transition-colors hover:bg-black/75 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="flex-shrink-0 relative h-[32rem]">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="h-12 w-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
                </div>
              ) : (
                <div className="relative h-full">
                  <div className="absolute inset-0">
                    {loadedMedia.map((media, index) => (
                      <motion.div
                        key={media.url}
                        initial={false}
                        animate={{
                          opacity: index === currentMediaIndex ? 1 : 0,
                          zIndex: index === currentMediaIndex ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                      >
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`${product.title} - Image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <video
                            src={media.url}
                            controls
                            className="h-full w-full object-cover"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {loadedMedia.length > 1 && (
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
                        {loadedMedia.map((_, index) => (
                          <motion.button
                            key={index}
                            initial={false}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentMediaIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentMediaIndex
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

            <div className="p-6 overflow-y-auto">
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
              >
                Contact via WhatsApp
              </button>
            </div>
          </motion.div>
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

  return (
    <section id="products" className="py-20 bg-gray-900">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2
          variants={fadeIn}
          className="text-3xl font-bold text-white mb-12 text-center"
        >
          Our Products
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onClick={setSelectedProduct}
            />
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
