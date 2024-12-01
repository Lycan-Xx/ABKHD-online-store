import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-scroll';

const Hero = () => {
  return (
    <div className="h-screen relative bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Hello welcome,{' '}
          <span className="text-yellow-400">scroll down</span>
          <br />
          to see our available products
        </h1>
        
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <Link to="products" smooth={true} duration={500}>
            <ChevronDownIcon className="h-8 w-8 text-yellow-400 cursor-pointer" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;