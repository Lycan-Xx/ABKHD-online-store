import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/utils'

const ProductCard = ({ product }) => {
  // Use documentId if available, otherwise fall back to id
  const productId = product.documentId || product.id;

  return (
    <Link to={`/products/${productId}`} className="product-card block">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image || 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={product.name}
          className="product-image"
          crossOrigin="anonymous"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
