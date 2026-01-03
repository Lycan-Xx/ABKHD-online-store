import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2348012345678'
  
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-bold text-xl tracking-tight">ABKHD</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium UK and China-sourced tech at smarter prices. Every device tested, certified, and guaranteed.
            </p>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold">Products</h3>
            <div className="space-y-2 text-sm">
              <Link to="/inventory" className="block text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
              <Link to="/category/mobile-phones" className="block text-muted-foreground hover:text-foreground transition-colors">
                Mobile Phones
              </Link>
              <Link to="/category/laptops" className="block text-muted-foreground hover:text-foreground transition-colors">
                Laptops
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
              <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                About ABKHD
              </Link>
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <i className="bi bi-whatsapp"></i>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="WhatsApp"
              >
                <i className="bi bi-whatsapp text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                <i className="bi bi-instagram text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <i className="bi bi-twitter-x text-xl"></i>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Jimeta, Yola • Nigeria
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ABKHD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
