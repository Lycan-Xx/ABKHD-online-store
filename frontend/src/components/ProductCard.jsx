import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animations';

const ProductCard = ({ product, onClick }) => {
  const mainImageUrl = product.images[0]?.url || '';
  const averageRating =
    product.reviews?.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
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
              console.error('Image load error:', mainImageUrl);
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

export default ProductCard;
