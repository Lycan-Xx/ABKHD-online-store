import React from 'react'

const ProductToggle = ({ isActive, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${isActive ? 'bg-primary' : 'bg-muted'}
      `}
      role="switch"
      aria-checked={isActive}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
          ${isActive ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )
}

export default ProductToggle
