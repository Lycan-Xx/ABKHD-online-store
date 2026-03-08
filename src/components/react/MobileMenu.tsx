import React, { useEffect, useState } from 'react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, isDarkMode, onToggleDarkMode }) => {
  const [visible, setVisible] = useState(isOpen)
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setTimeout(() => setVisible(true), 10)
    } else {
      setVisible(false)
      const timeout = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  if (!shouldRender) return null

  const currentPath = window.location.pathname

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      />
      <div 
        className={`fixed left-0 top-0 h-full w-64 bg-background z-50 shadow-xl md:hidden transition-transform duration-300 ${
          visible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Close menu"
            >
              <i className="bi bi-x text-xl"></i>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-4">
              <a
                href="/shop"
                className={`block py-3 px-4 text-lg transition-all duration-200 rounded-md ${
                  currentPath === '/shop' 
                    ? 'text-primary bg-primary/15 font-semibold shadow-md ring-1 ring-primary/30 border-l-4 border-primary' 
                    : 'text-muted-foreground font-medium hover:text-primary hover:bg-accent'
                }`}
                onClick={onClose}
              >
                Shop
              </a>
              <a
                href="/about"
                className={`block py-3 px-4 text-lg transition-all duration-200 rounded-md ${
                  currentPath === '/about' 
                    ? 'text-primary bg-primary/15 font-semibold shadow-md ring-1 ring-primary/30 border-l-4 border-primary' 
                    : 'text-muted-foreground font-medium hover:text-primary hover:bg-accent'
                }`}
                onClick={onClose}
              >
                About Us
              </a>
              <a
                href="/contact"
                className={`block py-3 px-4 text-lg transition-all duration-200 rounded-md ${
                  currentPath === '/contact' 
                    ? 'text-primary bg-primary/15 font-semibold shadow-md ring-1 ring-primary/30 border-l-4 border-primary' 
                    : 'text-muted-foreground font-medium hover:text-primary hover:bg-accent'
                }`}
                onClick={onClose}
              >
                Contact
              </a>
            </div>
          </nav>

          {/* Dark Mode Toggle */}
          <div className="border-t p-4">
            <button
              onClick={onToggleDarkMode}
              className="flex items-center justify-between w-full p-3 rounded-md bg-accent hover:bg-accent/80 transition-colors"
            >
              <span className="text-sm font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              <i className={`bi ${isDarkMode ? 'bi-moon-fill' : 'bi-sun-fill'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileMenu