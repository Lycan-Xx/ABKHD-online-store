import React, { useState, useEffect } from 'react'
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

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -ml-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <i className="bi bi-list text-xl"></i>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">ABKHD</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/shop" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/shop') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/about') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/contact') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                const newDarkMode = toggleDarkMode()
                setIsDarkMode(newDarkMode)
              }}
              className="hidden md:flex p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'} text-lg`}></i>
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Open cart"
            >
              <i className="bi bi-bag text-lg"></i>
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
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
