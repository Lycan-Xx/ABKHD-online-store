import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const BackButton = ({
  to,
  text = 'Back',
  className = '',
  showIcon = true,
  variant = 'default' // 'default' | 'subtle' | 'prominent'
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Smart navigation logic
  const handleBack = () => {
    if (to) {
      navigate(to)
    } else {
      // Use browser history if available, otherwise go to home
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate('/')
      }
    }
  }

  // Define variant styles
  const variantStyles = {
    default: 'text-muted-foreground hover:text-foreground',
    subtle: 'text-muted-foreground hover:text-foreground opacity-75 hover:opacity-100',
    prominent: 'text-foreground hover:text-primary bg-accent/50 hover:bg-accent px-3 py-2 rounded-lg'
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center transition-colors duration-200 ${variantStyles[variant]} ${className}`}
      aria-label={`Go back${to ? ` to ${text.toLowerCase()}` : ''}`}
    >
      {showIcon && (
        <i className="bi bi-arrow-left mr-2 text-lg"></i>
      )}
      <span className="text-sm font-medium">{text}</span>
    </button>
  )
}

export default BackButton
