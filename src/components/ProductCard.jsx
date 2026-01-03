import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/utils'

const ProductCard = ({ product }) => {
  const productId = product.documentId || product.id;

  return (
    <Link to={`/products/${productId}`} className="product-card group block">
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
        <img
          src={product.image || 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={product.name}
          className="product-image group-hover:scale-105"
          crossOrigin="anonymous"
        />
        {/* Verified Badge */}
        <div className="absolute top-3 right-3">
          <span className="verified-badge">
            <i className="bi bi-patch-check-fill"></i>
            Verified
          </span>
        </div>
        {/* Condition Badge - ready for Strapi data */}
        {product.condition && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-background/90 text-foreground border">
              {product.condition}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 pt-1">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
