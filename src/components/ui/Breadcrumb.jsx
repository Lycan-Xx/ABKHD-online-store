import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrumb = ({ className = '' }) => {
  const location = useLocation()

  // Define breadcrumb paths
  const breadcrumbMap = {
    '/': 'Home',
    '/shop': 'Shop',
    '/about': 'About',
    '/contact': 'Contact',
    '/payment-options': 'Payment Options',
    '/checkout': 'Checkout',
    '/inquiry': 'Local Inquiry'
  }

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ path: '/', label: 'Home' }]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = breadcrumbMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
      breadcrumbs.push({ path: currentPath, label })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <span className="text-muted-foreground/50">/</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
