import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import ProductGrid from '../components/ProductGrid'

const InventoryPage = () => {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategories, setSelectedCategories] = useState([])

  // Categories with icons
  const categories = [
    { name: 'Mobile Phones', icon: 'bi-phone', value: 'Mobile Phones' },
    { name: 'Laptops', icon: 'bi-laptop', value: 'Computer' },
    { name: 'Accessories', icon: 'bi-headphones', value: 'Accessories' }
  ]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Handle category filtering
  const toggleCategory = (categoryValue) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryValue)) {
        return prev.filter(c => c !== categoryValue)
      } else {
        return [...prev, categoryValue]
      }
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
  }

  // Filter products
  const filteredProducts = selectedCategories.length > 0
    ? products.filter(product => selectedCategories.includes(product.category))
    : products

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <i className="bi bi-arrow-left mr-2"></i>
          Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Inventory</h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Minimal Categories */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Categories Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <i className="bi bi-funnel text-primary"></i>
                <span>Filter by Category</span>
              </div>
              {selectedCategories.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Buttons */}
            <div className="space-y-3">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.value)

                
                return (
                  <button
                    key={category.value}
                    onClick={() => toggleCategory(category.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left group ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >

                    <div className="flex items-center space-x-3">
                      <i className={`${category.icon} text-lg ${
                        isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      } transition-colors`}></i>
                      <span className={`font-medium ${
                        isSelected ? 'text-primary' : ''
                      }`}>
                        {category.name}


                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isSelected && (
                        <i className="bi bi-check-circle-fill text-primary text-sm"></i>
                      )}
                      <i className={`bi bi-chevron-right text-sm ${
                        isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      } transition-colors`}></i>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Show All Products Button */}
            {selectedCategories.length === 0 && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Showing all products
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <i className="bi bi-arrow-clockwise animate-spin text-3xl text-primary"></i>
              <p className="text-muted-foreground mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-xl">
              <i className="bi bi-inbox text-4xl text-muted-foreground mb-4"></i>
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm text-muted-foreground mb-6">
                Try adjusting your filters
              </p>
              <button
                onClick={clearFilters}
                className="btn-secondary px-6 py-2"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </main>
      </div>
    </div>
  )
}

export default InventoryPage