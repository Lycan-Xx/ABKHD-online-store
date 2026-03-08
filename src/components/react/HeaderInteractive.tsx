import React, { useState, useEffect } from 'react'
import { CartProvider } from './CartContext'
import CartDrawer from './CartDrawer'
import MobileMenu from './MobileMenu'

const HeaderInteractive: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Initialize dark mode state
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)

    // Set up event listeners for buttons
    const cartToggle = document.getElementById('cart-toggle')
    const mobileMenuBtn = document.getElementById('mobile-menu-btn')

    if (cartToggle) {
      cartToggle.addEventListener('click', () => setIsCartOpen(true))
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => setIsMobileMenuOpen(true))
    }

    return () => {
      if (cartToggle) {
        cartToggle.removeEventListener('click', () => setIsCartOpen(true))
      }
      if (mobileMenuBtn) {
        mobileMenuBtn.removeEventListener('click', () => setIsMobileMenuOpen(true))
      }
    }
  }, [])

  const handleToggleDarkMode = () => {
    const currentlyDark = document.documentElement.classList.contains('dark')
    
    if (currentlyDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
      setIsDarkMode(true)
    }

    // Update the header icon
    const darkModeIcon = document.getElementById('dark-mode-icon')
    if (darkModeIcon) {
      darkModeIcon.className = !currentlyDark ? 'bi bi-sun text-lg' : 'bi bi-moon text-lg'
    }
  }

  return (
    <CartProvider>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    </CartProvider>
  )
}

export default HeaderInteractive