import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import ProductGrid from '../components/ProductGrid'
import ProductFilters from '../components/ProductFilters'
import SearchBar from '../components/SearchBar'

const InventoryPage = () => {
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0)
    // Also try smooth scroll after a small delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }, [])

  const { products } = useProducts()
  const [searchParams] = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState([])
  
  // Debug: Log products on component mount
  console.log('All products:', products)
  console.log('Filtered products:', filteredProducts)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categories: [],
    priceRange: [0, 100000],
    sort: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    console.log('Filtering products...', { products, filters })
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase())))
      )
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      )
    }

    // Price filter
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      )
    }

    // Sort
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'rating-desc':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        default:
          break
      }
    }

    console.log('Filtered result:', filtered)
    setFilteredProducts(filtered)
  }, [products, filters])


  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      priceRange: [0, 100000],
      sort: ''
    })
  }

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }))
  }

  const handleCategoryChange = (category) => {
    const categoryName = typeof category === 'object' ? category.name : category;
    const updatedCategories = filters.categories.includes(categoryName)
      ? filters.categories.filter(c => c !== categoryName)
      : [...filters.categories, categoryName];
    
    setFilters({
      ...filters,
      categories: updatedCategories
    });
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-4">
        <Link
          to="/"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors mr-4"
        >
          <i className="bi bi-arrow-left-short text-xl mr-1"></i>
          <span className="text-sm">Home</span>
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventory</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary"
        >
          <i className="bi bi-funnel mr-2"></i>
          Filters
        </button>
      </div>

      {/* Search Bar */}
      {/* <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div> */}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`md:w-72 md:flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={filteredProducts.length > 0 ? filteredProducts : products} />
        </div>
      </div>
    </div>
  )
}

export default InventoryPage
