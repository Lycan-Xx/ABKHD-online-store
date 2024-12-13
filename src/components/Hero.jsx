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
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-relaxed">
          Hello, Welcome! 
          <br />
          <span className="pt-8 block">Want an Affordable and Good Quality</span>
          <span className="text-yellow-400">Used </span> 
          <span className="block">
            <span className="text-green-400">Mobile Phone</span> and 
            <span className="text-red-700"> PC</span>?
          </span>
        </h1>
        <p className="text-lg text-gray-300 mb-4">Scroll down to see our available products</p>

        {/* Animated Scroll Indicator */}
        <motion.div
          animate={{
            y: [0, 10, 0], // Bounce animation
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
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
