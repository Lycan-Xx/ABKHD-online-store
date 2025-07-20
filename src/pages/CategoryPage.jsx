import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import ProductGrid from '../components/ProductGrid'
import ProductFilters from '../components/ProductFilters'

const CategoryPage = () => {
  const { category } = useParams()
  const { products, categories } = useProducts()
  const categoryData = categories.find(c => c.id === category)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    categories: [category],
    priceRange: [0, 100],
    sort: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Handle Strapi's data structure for category comparison
    let filtered = products.filter(product => {
      const productCategory = product.category?.data?.attributes?.name || product.category
      return productCategory === categoryData?.attributes?.name
    })

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.attributes?.tags || product.tags)?.some(tag => 
          (tag.name || tag).toLowerCase().includes(filters.search.toLowerCase())
        )
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

    setFilteredProducts(filtered)
  }, [category, filters])

  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, categories: [category] })
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categories: [category],
      priceRange: [0, 100],
      sort: ''
    })
  }

  if (!categoryData) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
      </div>
    )
  }

  return (
    <div>
      {/* Category Hero */}
      <section className="relative bg-muted">
        <div className="container py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">{categoryData.name}</h1>
            <p className="text-lg text-muted-foreground">{categoryData.description}</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-secondary"
          >
            <i className="bi bi-funnel mr-2"></i>
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
