import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ShareIcon } from '@heroicons/react/24/outline';

const ProductDetail = ({ product, settings, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loadedMedia, setLoadedMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('description');
  const [dragStart, setDragStart] = useState(0);

  // Create a fixed list combining images and videos
  const allMedia = [
    ...product.images.map(img => ({ ...img, type: 'image' })),
    ...product.videos.map(vid => ({ ...vid, type: 'video' }))
  ];

  // Disable background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Preload images
  useEffect(() => {
    setIsLoading(true);
    Promise.all(
      allMedia.map(media =>
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
    ).then(loaded => {
      setLoadedMedia(loaded.filter(Boolean));
      setIsLoading(false);
    });
  }, [product]);

  const handleMediaNavigation = (direction) => {
    if (loadedMedia.length <= 1) return;
    setCurrentMediaIndex(prev => {
      if (direction === 'left') {
        return prev === 0 ? loadedMedia.length - 1 : prev - 1;
      }
      return prev === loadedMedia.length - 1 ? 0 : prev + 1;
    });
  };

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${product._id || product.id}`
    : '';

  const handleWhatsApp = () => {
    if (!settings?.whatsappNumber) {
      console.error('WhatsApp number not loaded');
      return;
    }
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
      }).catch(error => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(currentUrl)
        .then(() => alert("Link copied to clipboard!"))
        .catch(err => console.error('Error copying link:', err));
    }
  };

  const handleDragEnd = (event, info) => {
    const dragDistance = info.offset.x;
    const dragThreshold = 50; // minimum distance to trigger navigation

    if (Math.abs(dragDistance) > dragThreshold) {
      if (dragDistance > 0) {
        handleMediaNavigation('left');
      } else {
        handleMediaNavigation('right');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50"
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl rounded-xl overflow-hidden border border-gray-700 md:my-6 my-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-30 rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-sm transition-colors hover:bg-black/75 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Media container */}
            <div className="relative w-full bg-gray-900" style={{ height: 'min(70vh, 100vw)' }}>
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" />
                </div>
              ) : (
                <div className="relative h-full">
                  {/* Media display with swipe functionality */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center touch-pan-y"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                  >
                    {loadedMedia[currentMediaIndex]?.type === 'image' ? (
                      <img
                        src={loadedMedia[currentMediaIndex].url}
                        alt={`${product.title} - Image ${currentMediaIndex + 1}`}
                        className="max-h-full max-w-full object-contain select-none"
                        draggable="false"
                      />
                    ) : (
                      <video
                        src={loadedMedia[currentMediaIndex]?.url}
                        controls
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </motion.div>

                  {/* Navigation controls - Only visible on desktop or when there's more than one media */}
                  {loadedMedia.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none md:visible invisible">
                      <button
                        onClick={() => handleMediaNavigation('left')}
                        className="pointer-events-auto rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-sm transition-all hover:bg-black/75 hover:text-white"
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleMediaNavigation('right')}
                        className="pointer-events-auto rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-sm transition-all hover:bg-black/75 hover:text-white"
                      >
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>
                    </div>
                  )}

                  {/* Media indicators */}
                  {loadedMedia.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                      {loadedMedia.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentMediaIndex(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === currentMediaIndex
                              ? 'w-8 bg-teal-400'
                              : 'w-2 bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content section */}
            <div className="p-4 md:p-6">
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

              {/* Tab Navigation */}
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
                {/* Additional tabs can be enabled here */}
              </div>

              {/* Tab Content */}
              <div className="py-4 text-gray-300">
                {selectedTab === 'description' && <p>{product.description}</p>}
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
      </div>
    </motion.div>
  );
};

export default ProductDetail;
