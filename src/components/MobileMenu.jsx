import React from 'react'
import { Link } from 'react-router-dom'

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={onClose}></div>
      <div className="fixed left-0 top-0 h-full w-64 bg-background z-50 shadow-xl md:hidden">
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
              <Link
                to="/products"
                onClick={onClose}
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/category/clothing"
                onClick={onClose}
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Clothing
              </Link>
              <Link
                to="/category/accessories"
                onClick={onClose}
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Accessories
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

export default MobileMenu
