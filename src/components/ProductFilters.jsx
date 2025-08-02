import React, { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp, DollarSign, ArrowUpDown } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

const ProductFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const { categories } = useProducts();
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 100000]);
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    categories: true,
    price: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (value, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value) || 0;
    setPriceRange(newRange);
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const handleCategoryChange = (category) => {
    const categoryName = typeof category === 'object' ? category.name : category;
    const newCategories = filters.categories?.includes(categoryName)
      ? filters.categories.filter(c => c !== categoryName)
      : [...(filters.categories || []), categoryName];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleSortChange = (sort) => {
    onFiltersChange({ ...filters, sort });
  };

  // Debug logging
  console.log('ProductFilters - categories:', categories);

  const activeFiltersCount = (filters.categories?.length || 0) + 
    (filters.sort && filters.sort !== '' ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

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
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
            {activeFiltersCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{activeFiltersCount} active</p>
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

      {/* Sort Section */}
      <CollapsibleSection
        title="Sort By"
        icon={ArrowUpDown}
        isExpanded={expandedSections.sort}
        onToggle={() => toggleSection('sort')}
      >
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category.name) || false}
                  onChange={() => handleCategoryChange(category.name)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors flex-1">
                {category.name}
              </span>
              {filters.categories?.includes(category.name) && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Price Range Section */}
      <CollapsibleSection
        title="Price Range"
        icon={DollarSign}
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          {/* Price Range Display */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          </div>
          
          {/* Price Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                Minimum
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e.target.value, 0)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                  min="0"
                  max="100000"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                Maximum
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e.target.value, 1)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                  min="0"
                  max="100000"
                  placeholder="100000"
                />
              </div>
            </div>
          </div>

          {/* Quick Price Presets */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Under ₦10K', range: [0, 10000] },
              { label: 'Under ₦25K', range: [0, 25000] },
              { label: '₦25K - ₦50K', range: [25000, 50000] },
              { label: 'Over ₦50K', range: [50000, 100000] }
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  setPriceRange(preset.range);
                  onFiltersChange({ ...filters, priceRange: preset.range });
                }}
                className={`px-3 py-2 text-xs rounded-md border transition-all duration-150 ${
                  priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Active Filters</span>
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
            {filters.sort && filters.sort !== '' && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-600 rounded-md text-xs text-blue-700 dark:text-blue-300">
                <ArrowUpDown className="w-3 h-3" />
                <span>Sorted</span>
                <button
                  onClick={() => handleSortChange('')}
                  className="hover:bg-blue-100 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 100000) && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-600 rounded-md text-xs text-blue-700 dark:text-blue-300">
                <DollarSign className="w-3 h-3" />
                <span>Price Range</span>
                <button
                  onClick={() => {
                    setPriceRange([0, 100000]);
                    onFiltersChange({ ...filters, priceRange: [0, 100000] });
                  }}
                  className="hover:bg-blue-100 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;