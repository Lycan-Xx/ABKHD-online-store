import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <i className="bi bi-triangle text-white text-sm"></i>
              </div>
              <span className="font-bold text-xl">ACME STORE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium quality products for modern living. Crafted with care and attention to detail.
            </p>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold">Products</h3>
            <div className="space-y-2 text-sm">
              <Link to="/products" className="block text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
              <Link to="/category/clothing" className="block text-muted-foreground hover:text-foreground transition-colors">
                Clothing
              </Link>
              <Link to="/category/accessories" className="block text-muted-foreground hover:text-foreground transition-colors">
                Accessories
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Shipping Info
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Returns
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Size Guide
              </a>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <i className="bi bi-twitter text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <i className="bi bi-instagram text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <i className="bi bi-facebook text-xl"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Acme Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
