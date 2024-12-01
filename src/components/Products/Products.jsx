import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import { PRODUCTS } from '../../utils/constants';
import { fadeIn, staggerContainer } from '../../utils/animations';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="products" className="py-20 bg-gray-900">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="initial"
        animate={inView ? "animate" : "initial"}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2 
          variants={fadeIn}
          className="text-3xl font-bold text-white mb-12 text-center"
        >
          Our Products
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
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