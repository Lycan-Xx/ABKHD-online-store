import React from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'

const AdminLayout = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2-fill', exact: true },
    { path: '/admin/products', label: 'Products', icon: 'bi-box-seam-fill' }
  ]

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">ABKHD</span>
              <span className="text-sm font-medium text-muted-foreground">Admin</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive: active }) => `
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <i className={item.icon}></i>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Store
          </Link>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-16 z-40 border-b bg-card/95 backdrop-blur">
        <div className="container flex items-center gap-2 py-2 overflow-x-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive: active }) => `
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <i className={item.icon}></i>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
