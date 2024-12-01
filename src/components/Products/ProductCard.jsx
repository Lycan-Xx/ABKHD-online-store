import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';

const ProductCard = ({ product, onClick }) => {
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
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
        <p className="text-gray-400 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 font-bold text-xl">
            ${product.price}
          </span>
          <button 
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-yellow-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick(product);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;