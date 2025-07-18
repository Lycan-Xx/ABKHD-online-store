import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { toggleDarkMode } from '../lib/utils'
import SearchBar from './SearchBar'
import CartDrawer from './CartDrawer'
import MobileMenu from './MobileMenu'

const Header = () => {
  const { getCartCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for system dark mode preference and saved theme
    const savedTheme = localStorage.getItem('theme')
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && systemDarkMode)) {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    }
  }, [])

  const handleSearch = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`)
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <i className="bi bi-triangle text-white text-sm"></i>
            </div>
            <span className="font-bold text-xl">ACME STORE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
              All Products
            </Link>
            <Link to="/category/clothing" className="text-sm font-medium hover:text-primary transition-colors">
              Clothing
            </Link>
            <Link to="/category/accessories" className="text-sm font-medium hover:text-primary transition-colors">
              Accessories
            </Link>
          </nav>

          {/* Search, Dark Mode, and Cart */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {/* Dark Mode Toggle - Visible on desktop */}
            <button
              onClick={() => {
                toggleDarkMode()
                setIsDarkMode(!isDarkMode)
              }}
              className="hidden md:flex p-2 hover:bg-accent rounded-md transition-colors"
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`bi ${isDarkMode ? 'bi-moon-fill' : 'bi-sun-fill'} text-xl`}></i>
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

        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => {
          toggleDarkMode()
          setIsDarkMode(!isDarkMode)
        }}
      />
    </>
  )
}

export default Header
