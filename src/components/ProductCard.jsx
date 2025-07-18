import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/utils'

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="product-card block">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image}
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
        {/* {product.rating && (
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''} text-xs ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-muted-foreground'
                  }`}
                ></i>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
        )} */}
      </div>
    </Link>
  )
}

export default ProductCard
