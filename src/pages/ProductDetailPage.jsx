import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { formatPrice } from '../lib/utils'

const ProductDetailPage = () => {
  const { id } = useParams()
  const product = products.find(p => p.id === parseInt(id))
  const { addItem } = useCart()
  const { addToast } = useToast()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    // if (product.sizes && product.sizes.length > 0 && !selectedSize) {
    //   addToast('Please select a size', 'error')
    //   return
    // }
    // if (product.colors && product.colors.length > 0 && !selectedColor) {
    //   addToast('Please select a color', 'error')
    //   return
    // }

    addItem(product, quantity, selectedSize, selectedColor)
    addToast('Added to cart successfully!')
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <i className="bi bi-chevron-right"></i>
        <Link to="/inventory" className="hover:text-foreground">Inventory</Link>
        <i className="bi bi-chevron-right"></i>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
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
                        className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''} text-sm ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-muted-foreground'
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              )} */}
            </div>
            <p className="text-muted-foreground">{product.longDescription}</p>
          </div>

          {/* Size Selection */}
          {/* {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input hover:bg-accent'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* Color Selection */}
          {/* {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input hover:bg-accent'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-accent"
                >
                  <i className="bi bi-dash"></i>
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-accent"
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} in stock
              </span>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary py-3 text-base border-2 border-primary shadow-md hover:scale-105 transition-transform duration-200 dark:border-primary/80 focus:ring-2 focus:ring-primary/60"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock:</span>
                <span>{product.stock} available</span>
              </div>
              {product.tags && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tags:</span>
                  <span className="capitalize">{product.tags.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="product-card block"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="product-image"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-sm line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{formatPrice(relatedProduct.price)}</span>
                    {relatedProduct.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(relatedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
