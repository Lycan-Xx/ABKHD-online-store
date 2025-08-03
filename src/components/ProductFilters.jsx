import React, { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'

const ProductFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const { categories } = useProducts()
  const [expandedSections, setExpandedSections] = useState({
    categories: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (category) => {
    const categoryName = typeof category === 'object' ? category.name : category
    const newCategories = filters.categories?.includes(categoryName)
      ? filters.categories.filter(c => c !== categoryName)
      : [...(filters.categories || []), categoryName]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  // Safe categories array
  const safeCategories = Array.isArray(categories) ? categories : []

  const activeFiltersCount = filters.categories?.length || 0

  const CollapsibleSection = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
        </div>
        {isExpanded ? 
          <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" /> :
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        }
      </button>
      <div className={`transition-all duration-200 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="p-4 bg-white dark:bg-gray-800">
          {children}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Categories</h2>
            {activeFiltersCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{activeFiltersCount} selected</p>
            )}
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Categories Section */}
      <CollapsibleSection
        title="Product Categories"
        icon={Filter}
        isExpanded={expandedSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        <div className="space-y-2">
          {safeCategories.map((category) => (
            <label key={category.id || category.name} className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category.name || category.Name) || false}
                  onChange={() => handleCategoryChange(category.name)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors flex-1">
                {category.name || category.Name || 'Unknown Category'}
              </span>
              {filters.categories?.includes(category.name || category.Name) && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Show All Products Button */}
      <button
        onClick={onClearFilters}
        className="w-full py-3 text-sm font-medium bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-150"
      >
        Show All Products
      </button>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Active Categories</span>
            <span className="text-xs text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.categories?.map(category => (
              <span
                key={category}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-600 rounded-md text-xs text-blue-700 dark:text-blue-300"
              >
                <span>{category}</span>
                <button
                  onClick={() => handleCategoryChange(category)}
                  className="hover:bg-blue-100 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductFilters