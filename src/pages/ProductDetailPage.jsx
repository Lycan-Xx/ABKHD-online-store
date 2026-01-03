import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import { formatPrice } from '../lib/utils'

// Component to render content as a list format
const RichTextRenderer = ({ content }) => {
  if (!content) return null

  // If content is a string, convert to list items
  if (typeof content === 'string') {
    // Split by common list separators (newlines, semicolons, etc.)
    const items = content.split(/[;\n]+/).filter(item => item.trim().length > 0)

    return (
      <ul className="text-muted-foreground list-disc list-inside space-y-2">
        {items.map((item, index) => (
          <li key={index} className="leading-relaxed">
            {item.trim()}
          </li>
        ))}
      </ul>
    )
  }

  // If content has children (Strapi rich text format)
  if (content.children && Array.isArray(content.children)) {
    return (
      <div className="text-muted-foreground space-y-4">
        {content.children.map((block, index) => {
          // Handle different block types
          if (block.type === 'list') {
            const isOrdered = block.format === 'ordered'
            const ListTag = isOrdered ? 'ol' : 'ul'

            return (
              <ListTag
                key={index}
                className={isOrdered ? 'list-decimal list-inside space-y-1' : 'list-disc list-inside space-y-1'}
              >
                {block.children.map((listItem, itemIndex) => (
                  <li key={itemIndex} className="text-muted-foreground">
                    {listItem.children?.map((textNode, textIndex) => {
                      if (textNode.type === 'text') {
                        return (
                          <span
                            key={textIndex}
                            className={textNode.bold ? 'font-semibold' : ''}
                            style={{
                              fontStyle: textNode.italic ? 'italic' : 'normal',
                              textDecoration: textNode.underline ? 'underline' : 'none'
                            }}
                          >
                            {textNode.text}
                          </span>
                        )
                      }
                      return null
                    })}
                  </li>
                ))}
              </ListTag>
            )
          }

          // Handle paragraph blocks - convert to list items
          if (block.type === 'paragraph' || !block.type) {
            const textContent = block.children?.map(textNode => {
              if (textNode.type === 'text') {
                return textNode.text
              }
              return ''
            }).join('').trim()

            if (textContent) {
              // Split paragraph text into list items
              const items = textContent.split(/[;\n]+/).filter(item => item.trim().length > 0)

              return (
                <ul key={index} className="list-disc list-inside space-y-1">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground">
                      {item.trim()}
                    </li>
                  ))}
                </ul>
              )
            }
            return null
          }

          // Handle other block types (headings, etc.)
          if (block.type === 'heading') {
            const HeadingTag = `h${block.level || 3}`
            return (
              <HeadingTag key={index} className="font-semibold text-foreground">
                {block.children?.map((textNode, textIndex) => {
                  if (textNode.type === 'text') {
                    return (
                      <span
                        key={textIndex}
                        className={textNode.bold ? 'font-bold' : ''}
                        style={{
                          fontStyle: textNode.italic ? 'italic' : 'normal',
                          textDecoration: textNode.underline ? 'underline' : 'none'
                        }}
                      >
                        {textNode.text}
                      </span>
                    )
                  }
                  return null
                })}
              </HeadingTag>
            )
          }

          return null
        })}
      </div>
    )
  }

  // Fallback for other formats - convert to list
  return (
    <ul className="text-muted-foreground list-disc list-inside space-y-2">
      <li>{String(content)}</li>
    </ul>
  )
}

const ProductDetailPage = () => {
  const { id } = useParams()
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  
  // State hooks - these must be called before any early returns
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  // Find product after hooks are declared
  const product = products.find(p => 
    p.id == id || 
    p.documentId === id || 
    p.id === parseInt(id)
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Debug logging
  console.log('ProductDetailPage - products:', products)
  console.log('ProductDetailPage - product:', product)
  console.log('ProductDetailPage - product tags:', product?.tags)

  const handleBack = () => {
    if (location.state?.from === '/') {
      navigate('/')
    } else {
      navigate('/inventory')
    }
  }

  const handleAddToCart = () => {
    if (!product) {
      addToast('Product not found', 'error')
      return
    }

    // Removed size and color validation since you want individual unique items
    addItem(product, quantity, selectedSize, selectedColor)
    addToast('Added to cart successfully!')
  }

  const handleBuyNow = () => {
    if (!product) {
      addToast('Product not found', 'error')
      return
    }

    // Add product to cart
    addItem(product, quantity, selectedSize, selectedColor)
    addToast('Added to cart successfully!')

    // Navigate to payment options
    navigate('/payment-options')
  }

  // Loading state
  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    )
  }
  
  // Product not found state
  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    )
  }

  const relatedProducts = products
    .filter(p => {
      return (
        p.id !== product.id &&
        p.category === product.category
      )
    })
    .slice(0, 4)

  return (
    <div className="container py-8">
      {/* Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <button onClick={handleBack} className="flex items-center hover:text-foreground">
          <i className="bi bi-arrow-left-short text-xl mr-1"></i>
          <span>{location.state?.from === '/' ? 'Home' : 'Inventory'}</span>
        </button>
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
              {/* Rating section commented out as it's not in your data model */}
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
            {/* Product Description */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Description</h3>
              <RichTextRenderer content={product.longDescription || product.description} />
            </div>
          </div>

          {/* Size Selection - Commented out for individual unique items */}
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

          {/* Color Selection - Commented out for individual unique items */}
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

          {/* Quantity - Commented out for individual unique items */}
          {/* <div>
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
          </div> */}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleAddToCart}
              className="btn-secondary py-3 text-base border-2 border-muted-foreground/20 hover:border-muted-foreground/40 shadow-md hover:scale-105 transition-transform duration-200 focus:ring-2 focus:ring-muted-foreground/60"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="btn-primary py-3 text-base border-2 border-primary shadow-md hover:scale-105 transition-transform duration-200 dark:border-primary/80 focus:ring-2 focus:ring-primary/60"
            >
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="capitalize">{product.category}</span>
              </div>
              {/* Stock info commented out for individual unique items */}
              {/* <div className="flex justify-between">
                <span className="text-muted-foreground">Stock:</span>
                <span>{product.stock} available</span>
              </div> */}
              {/* Tags commented out as requested */}
              {/* {product.tags && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tags:</span>
                  <span className="capitalize">
                    {Array.isArray(product.tags) 
                      ? product.tags.join(', ') 
                      : typeof product.tags === 'object' 
                        ? Object.values(product.tags).join(', ')
                        : product.tags}
                  </span>
                </div>
              )} */}
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
