import React, { useState } from 'react'
import { categories } from '../data/products'

const ProductFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 100])

  const handlePriceChange = (value, index) => {
    const newRange = [...priceRange]
    newRange[index] = parseInt(value)
    setPriceRange(newRange)
    onFiltersChange({ ...filters, priceRange: newRange })
  }

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleSortChange = (sort) => {
    onFiltersChange({ ...filters, sort })
  }

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        <select
          value={filters.sort || ''}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full p-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="rating-desc">Highest Rated</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category.id) || false}
                onChange={() => handleCategoryChange(category.id)}
                className="rounded border-input"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">Min</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e.target.value, 0)}
                className="w-full p-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                min="0"
                max="100"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1">Max</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e.target.value, 1)}
                className="w-full p-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                min="0"
                max="100"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e.target.value, 0)}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e.target.value, 1)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClearFilters}
        className="w-full btn-secondary text-sm"
      >
        Clear All Filters
      </button>
    </div>
  )
}

export default ProductFilters
