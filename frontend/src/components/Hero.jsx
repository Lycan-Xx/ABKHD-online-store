import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-scroll';

const Hero = () => {
  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 md:px-8 py-16">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-yellow-500/10 blur-3xl"></div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center relative z-10 max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-2">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
            Premium Second-Hand Electronics
          </span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-6 leading-tight">
          <span className="text-4xl md:text-5xl lg:text-6xl block mb-2">
            Find Your Perfect Device
          </span>
          <span className="text-2xl md:text-3xl lg:text-4xl block mt-4 mb-2">
            Quality <span className="text-yellow-400 font-bold">Foreign Used</span>
          </span>
          <span className="text-2xl md:text-3xl lg:text-4xl block">
            <span className="text-teal-400 font-bold">Mobile Phones</span> & 
            <span className="text-rose-500 font-bold"> Laptops</span>
          </span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Premium second-hand devices at affordable prices. All products thoroughly tested and guaranteed.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="products" smooth={true} duration={500}>
            <button className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1 transition-all duration-300">
              Browse Products
            </button>
          </Link>
          <Link to="about" smooth={true} duration={500}>
            <button className="px-8 py-3 bg-transparent border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-300">
              Our Guarantee
            </button>
          </Link>
        </motion.div>
        
        {/* Animated scroll indicator */}
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <Link to="products" smooth={true} duration={500} className="flex flex-col items-center">
            <span className="text-gray-400 text-sm mb-2">Discover More</span>
            <ChevronDownIcon className="h-6 w-6 text-teal-400 cursor-pointer" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;