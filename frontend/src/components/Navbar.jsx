import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Products', 'Services', 'FAQ', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 mt-4 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-yellow-400 font-bold text-[2rem]">ABKHD</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={item.toLowerCase()}
                  smooth={true}
                  duration={500}
                  className="text-gray-300 hover:text-yellow-400 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  activeClass="text-yellow-400"
                  spy={true}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-yellow-400 focus:outline-none"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-lg mt-1">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item}
                to={item.toLowerCase()}
                smooth={true}
                duration={500}
                className="block text-gray-300 hover:text-yellow-400 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors"
                activeClass="text-yellow-400"
                spy={true}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on item click
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
