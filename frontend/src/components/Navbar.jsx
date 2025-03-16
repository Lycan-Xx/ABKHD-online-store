import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Monitor, ShoppingBag, Headphones, HelpCircle, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: 'Home', icon: Monitor },
    { name: 'Products', icon: ShoppingBag },
    { name: 'Services', icon: Headphones },
    { name: 'FAQ', icon: HelpCircle },
    { name: 'Contact', icon: MessageSquare }
  ];
  
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed w-full z-50 transition-all duration-500 px-4 ${scrolled ? 'py-2' : 'py-4'}`}
      >
        <div 
          className={`max-w-7xl mx-auto rounded-xl ${
            scrolled 
              ? 'bg-gray-900/80 backdrop-blur-md shadow-lg border border-gray-800' 
              : 'bg-transparent'
          } transition-all duration-500`}
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 pl-4">
              <span className="font-normal">
                <span className="text-white text-2xl">ABK</span>
                <span className="text-teal-400 text-2xl font-medium">HD</span>
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block pr-4">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.name.toLowerCase()}
                    smooth={true}
                    duration={800}
                    offset={-80}
                    className={`text-gray-300 hover:text-teal-400 cursor-pointer px-5 py-2 rounded-md text-sm font-normal transition-all duration-300 flex items-center space-x-1 group border border-transparent`}
                    activeClass="text-teal-400 bg-gray-800/50 border-[6px] border-teal-600 scale-145 transform [&>svg]:text-teal-400"
                    spy={true}
                  >
                    <item.icon className="w-4 h-4 text-white group-hover:text-teal-400 transition-all duration-300" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <Link
                  to="contact"
                  smooth={true}
                  duration={800}
                  className="ml-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-normal transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-px"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden pr-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-teal-400 focus:outline-none p-1 rounded-md hover:bg-gray-800/30 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Menu with AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 inset-x-4 z-40 md:hidden"
          >
            <motion.div 
              className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-800 overflow-hidden"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.name.toLowerCase()}
                    smooth={true}
                    duration={500}
                    className="flex items-center space-x-3 text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 cursor-pointer px-4 py-3 rounded-lg text-base font-normal transition-colors duration-300"
                    activeClass="text-teal-400 bg-gray-800/70"
                    spy={true}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="pt-2 pb-1">
                  <Link
                    to="contact"
                    smooth={true}
                    duration={500}
                    className="block w-full bg-teal-600 hover:bg-teal-500 text-white text-center px-4 py-3 rounded-lg text-base font-normal transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Semi-transparent overlay behind mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;