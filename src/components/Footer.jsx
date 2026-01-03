import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2348012345678'
  
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-bold text-xl tracking-tight">ABKHD</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium tech at smarter prices. Every device tested & certified.
            </p>
          </div>

          {/* Connect - Moved to far right */}
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
