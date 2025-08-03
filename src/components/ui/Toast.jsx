import React, { useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose()
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill'
      case 'error':
        return 'bi-exclamation-circle-fill'
      case 'warning':
        return 'bi-exclamation-triangle-fill'
      default:
        return 'bi-info-circle-fill'
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className={`flex items-center p-4 rounded-lg border shadow-lg ${getStyles()} animate-in slide-in-from-right duration-300`}>
      <i className={`bi ${getIcon()} mr-3`}></i>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto pl-3 text-current hover:opacity-70"
      >
        <i className="bi bi-x"></i>
      </button>
    </div>
  )
}

export default Toast
