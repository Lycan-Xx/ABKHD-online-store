import React from 'react'
import { Link } from 'react-router-dom'
import ProductToggle from './ProductToggle'

const ProductTable = ({ products, onToggleActive, onDelete }) => {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <div className="text-muted-foreground">
          <i className="bi bi-box-seam text-4xl mb-4 block"></i>
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try adjusting your filters or add a new product</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary mt-4 inline-flex">
          <i className="bi bi-plus-lg mr-2"></i>
          Add Product
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                Product
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                Price
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                Category
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                Featured
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                Active
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                {/* Product */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <i className="bi bi-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link 
                        to={`/admin/products/${product.id}`}
                        className="font-medium hover:text-primary transition-colors truncate block"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium">₦{product.price?.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through ml-2">
                        ₦{product.originalPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                    {product.category || 'Uncategorized'}
                  </span>
                </td>

                {/* Featured */}
                <td className="px-4 py-3 text-center">
                  {product.featured ? (
                    <span className="text-warning">
                      <i className="bi bi-star-fill"></i>
                    </span>
                  ) : (
                    <span className="text-muted-foreground/30">
                      <i className="bi bi-star"></i>
                    </span>
                  )}
                </td>

                {/* Active Toggle */}
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <ProductToggle 
                      isActive={product.isActive && !product.isArchived}
                      onChange={() => onToggleActive(product.id)}
                    />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      title="Edit"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y">
        {products.map(product => (
          <div key={product.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <i className="bi bi-image text-xl"></i>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link 
                      to={`/admin/products/${product.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      ₦{product.price?.toLocaleString()}
                      {product.originalPrice && (
                        <span className="line-through ml-2">
                          ₦{product.originalPrice?.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>
                  {product.featured && (
                    <span className="text-warning">
                      <i className="bi bi-star-fill"></i>
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                    {product.category || 'Uncategorized'}
                  </span>
                  <div className="flex items-center gap-3">
                    <ProductToggle 
                      isActive={product.isActive && !product.isArchived}
                      onChange={() => onToggleActive(product.id)}
                    />
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductTable
