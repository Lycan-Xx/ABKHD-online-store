import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-8 relative overflow-hidden">
      {/* Subtle background effects matching the FAQ component */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-teal-400 opacity-5 blur-2xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-blue-400 opacity-5 blur-2xl"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between text-gray-400 text-sm"
        >
		<a href="#" className="hover:text-teal-400 font-mono transition-colors duration-300 mt-4 sm:mt-0">
            Lycan_Xx
          </a>
          <p className="mt-4 sm:mt-0">&copy; 2025 ABKHD. All rights reserved.</p>

          <a href="#" className="hover:text-teal-400 transition-colors duration-300">
            Disclaimer
          </a>
        </motion.div>
      </div>

      {/* Simple, elegant footer divider to match the FAQ component */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
    </footer>
  );
};

export default Footer;
