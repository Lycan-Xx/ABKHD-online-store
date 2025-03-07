import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, ShareIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
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
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'latest'
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

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    if (filters.category === 'all') return true;
    return product?.category === filters.category;
  }).sort((a, b) => {
    if (filters.sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (filters.sortBy === 'priceLow') return a.price - b.price;
    if (filters.sortBy === 'priceHigh') return b.price - a.price;
    return 0;
  });

  const categories = ['all', ...new Set(products.filter(p => p?.category).map(p => p.category))];

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
    const averageRating = product.reviews?.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    return (
      <motion.div
        variants={fadeIn}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-lg border border-gray-700 group relative"
        onClick={() => onClick(product)}
      >
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={mainImageUrl}
              alt={product.title}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/images/fallback-image.jpg';
                console.log('Image load error:', mainImageUrl);
              }}
            />
          </div>
          
          {product.isNew && (
            <div className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold uppercase px-2 py-1 rounded">
              New Arrival
            </div>
          )}
          
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discountPercentage}% OFF
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
              {product.title}
            </h3>
            <span className="bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
          
          <div className="flex items-center mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.round(averageRating) ? (
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <StarIcon className="h-4 w-4 text-gray-500" />
                  )}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-2">
              {product.reviews?.length || 0} reviews
            </span>
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <div>
              {product.originalPrice > product.price ? (
                <div className="flex items-center">
                  <span className="text-lg font-bold text-teal-400 mr-2">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-teal-400">
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {product.condition || 'Used'}
            </span>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            View Details
          </button>
        </div>
      </motion.div>
    );
  };

  const ProductDetail = ({ product, onClose }) => {
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [loadedMedia, setLoadedMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('description');
    
    // Get the current URL for sharing
    const currentUrl = typeof window !== 'undefined' ? 
      `${window.location.origin}/product/${product._id || product.id}` : '';

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
      
      // Include product link in the WhatsApp message
      const message = `Hi, I'm interested in ${product.title}. ${currentUrl}`;
      const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    };
    
    const handleShare = () => {
      if (navigator.share) {
        navigator.share({
          title: product.title,
          text: `Check out this ${product.title}`,
          url: currentUrl,
        })
        .catch((error) => console.log('Error sharing', error));
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(currentUrl)
          .then(() => alert("Link copied to clipboard!"))
          .catch(err => console.error('Error copying link:', err));
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm" onClick={onClose} />
        
        <div className="min-h-full p-4 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl rounded-xl my-8 max-h-[90vh] flex flex-col overflow-hidden border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-sm transition-colors hover:bg-black/75 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="flex-shrink-0 relative h-[24rem] lg:h-[32rem]">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="h-12 w-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" />
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
                                ? 'w-8 bg-teal-400'
                                : 'w-2 bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Thumbnail preview */}
                  {loadedMedia.length > 1 && (
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto max-w-full px-4 py-2 bg-black/30 backdrop-blur-sm rounded-lg">
                      {loadedMedia.map((media, index) => (
                        <motion.button 
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentMediaIndex(index)}
                          className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                            index === currentMediaIndex ? 'border-teal-400' : 'border-transparent'
                          }`}
                        >
                          {media.type === 'image' ? (
                            <img src={media.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <span className="text-xs text-white">Video</span>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-white">{product.title}</h2>
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <ShareIcon className="h-5 w-5 text-white" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {product.category}
                </span>
                <span className="text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {product.condition || 'Used'}
                </span>
                {product.warranty && (
                  <span className="text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {product.warranty} Warranty
                  </span>
                )}
              </div>
              
              <div className="flex items-center mt-4">
                {product.originalPrice > product.price ? (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-teal-400 mr-3">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="ml-2 text-sm text-rose-500 font-medium">
                      ({Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}% OFF)
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-teal-400">
                    ₦{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              
              {/* Tab navigation */}
              <div className="flex border-b border-gray-700 mt-6">
                <button
                  className={`pb-2 px-4 font-medium transition-colors ${
                    selectedTab === 'description' 
                      ? 'text-teal-400 border-b-2 border-teal-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setSelectedTab('description')}
                >
                  Description
                </button>
                <button
                  className={`pb-2 px-4 font-medium transition-colors ${
                    selectedTab === 'specifications' 
                      ? 'text-teal-400 border-b-2 border-teal-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setSelectedTab('specifications')}
                >
                  Specifications
                </button>
                <button
                  className={`pb-2 px-4 font-medium transition-colors ${
                    selectedTab === 'reviews' 
                      ? 'text-teal-400 border-b-2 border-teal-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setSelectedTab('reviews')}
                >
                  Reviews {product.reviews?.length > 0 && `(${product.reviews.length})`}
                </button>
              </div>
              
              {/* Tab content */}
              <div className="py-4">
                {selectedTab === 'description' && (
                  <div className="text-gray-300">
                    <p>{product.description}</p>
                  </div>
                )}
                
                {selectedTab === 'specifications' && (
                  <div className="text-gray-300">
                    {product.specifications ? (
                      <ul className="space-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <li key={key} className="flex border-b border-gray-700 pb-2">
                            <span className="w-1/3 font-medium text-gray-400">{key}</span>
                            <span className="w-2/3">{value}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 italic">No specifications available</p>
                    )}
                  </div>
                )}
                
                {selectedTab === 'reviews' && (
                  <div className="text-gray-300">
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {product.reviews.map((review, index) => (
                          <div key={index} className="border-b border-gray-700 pb-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                                  {review.name.charAt(0)}
                                </div>
                                <div className="ml-2">
                                  <p className="font-medium">{review.name}</p>
                                  <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span key={star}>
                                    {star <= review.rating ? (
                                      <StarIconSolid className="h-4 w-4 text-yellow-400" />
                                    ) : (
                                      <StarIcon className="h-4 w-4 text-gray-600" />
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="mt-2">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No reviews yet</p>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleWhatsApp}
                className="mt-6 w-full rounded-lg bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
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
        animate={inView ? "show" : "hidden"}
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
                onClick={() => setFilters({...filters, category})}
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
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
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

      {/* Related Products Section - when a product is selected */}
      {selectedProduct && (
        <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-8">Similar Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter(p => 
                p.category === selectedProduct.category && 
                p._id !== selectedProduct._id && 
                p.id !== selectedProduct.id
              )
              .slice(0, 4)
              .map(product => (
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
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Products;