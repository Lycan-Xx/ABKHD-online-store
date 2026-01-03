import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import ProductGrid from '../components/ProductGrid'

const InventoryPage = () => {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)

  // Categories with icons
  const categories = [
    { name: 'Mobile Phones', icon: 'bi-phone', value: 'Mobile Phones' },
    { name: 'Laptops', icon: 'bi-laptop', value: 'Computer' },
    { name: 'Accessories', icon: 'bi-headphones', value: 'Accessories' }
  ]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Handle filter drawer animation
  useEffect(() => {
    if (isFilterOpen) {
      setFilterVisible(true)
    } else {
      const timeout = setTimeout(() => setFilterVisible(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isFilterOpen])

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

  // Category buttons component (reused in both desktop sidebar and mobile drawer)
  const CategoryButtons = () => (
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
              <span className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
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
  )

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Inventory</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors"
          >
            <i className="bi bi-funnel text-primary"></i>
            <span className="text-sm font-medium">Filters</span>
            {selectedCategories.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterVisible && (
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${
              isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`} 
            onClick={() => setIsFilterOpen(false)}
          />
          
          {/* Drawer */}
          <div 
            className={`fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-background z-50 shadow-xl lg:hidden transition-transform duration-300 ${
              isFilterOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  <i className="bi bi-funnel text-primary"></i>
                  <h2 className="text-lg font-semibold">Filter by Category</h2>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-accent rounded-md transition-colors"
                  aria-label="Close filters"
                >
                  <i className="bi bi-x text-xl"></i>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <CategoryButtons />
                
                {/* Show status message */}
                {selectedCategories.length === 0 && (
                  <div className="pt-4 mt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      Showing all products
                    </p>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t p-4 space-y-3">
                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Show {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block lg:col-span-1">
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

            <CategoryButtons />

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