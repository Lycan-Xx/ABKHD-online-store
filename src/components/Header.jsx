import React, { useState, useEffect } from 'react'
<<<<<<< HEAD
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { toggleDarkMode } from '../lib/utils'
import CartDrawer from './CartDrawer'
import MobileMenu from './MobileMenu'

const Header = () => {
  const { getCartCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    setIsDarkMode(isDark)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95 transition-colors duration-300">
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <i className="bi bi-list text-xl"></i>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <i className="bi bi-triangle text-black text-sm"></i>
              </div>
              <span className="font-bold text-xl">ABKHD STORE</span>
            </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/inventory" className="text-sm font-medium hover:text-primary transition-colors">
              Inventory
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
=======
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { toggleDarkMode } from '../lib/utils'
import CartDrawer from './CartDrawer'
import MobileMenu from './MobileMenu'

const Header = () => {
  const { getCartCount } = useCart()
  const location = useLocation()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    setIsDarkMode(isDark)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95 transition-colors duration-300">
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <i className="bi bi-list text-xl"></i>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <i className="bi bi-triangle text-black text-sm"></i>
              </div>
              <span className="font-bold text-xl">ABKHD STORE</span>
            </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/inventory" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                location.pathname === '/inventory' 
                  ? 'text-primary bg-primary/10 shadow-md ring-1 ring-primary/20' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent'
              }`}
            >
              Inventory
              {location.pathname === '/inventory' && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-md -z-10"></div>
              )}
            </Link>
            <Link 
              to="/about" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                location.pathname === '/about' 
                  ? 'text-primary bg-primary/10 shadow-md ring-1 ring-primary/20' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent'
              }`}
            >
              About Us
              {location.pathname === '/about' && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-md -z-10"></div>
              )}
            </Link>
            <Link 
              to="/contact" 
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                location.pathname === '/contact' 
                  ? 'text-primary bg-primary/10 shadow-md ring-1 ring-primary/20' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent'
              }`}
            >
              Contact
              {location.pathname === '/contact' && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-md -z-10"></div>
              )}
>>>>>>> refs/heads/main
            </Link>
          </nav>

          {/* Dark Mode and Cart */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle - Visible on desktop */}
            <button
              onClick={() => {
                const newDarkMode = toggleDarkMode()
                setIsDarkMode(newDarkMode)
              }}
              className="hidden md:flex p-2 hover:bg-accent rounded-md transition-colors duration-200"
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'} text-xl transition-transform duration-200 ${isDarkMode ? 'rotate-180' : 'rotate-0'}`}></i>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Open cart"
            >
              <i className="bi bi-bag text-xl"></i>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => {
          const newDarkMode = toggleDarkMode()
          setIsDarkMode(newDarkMode)
        }}
      />
    </>
  )
}

export default Header
