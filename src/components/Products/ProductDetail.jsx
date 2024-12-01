import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { WHATSAPP_NUMBER } from '../../utils/constants';

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
          className="bg-gray-800 rounded-lg max-w-4xl w-full overflow-hidden relative shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="md:w-3/5 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">{product.name}</h2>
              <p className="text-gray-400 mb-6">{product.description}</p>
              <div className="mb-8">
                <span className="text-3xl font-bold text-yellow-400">
                  ${product.price}
                </span>
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

export default ProductDetail;