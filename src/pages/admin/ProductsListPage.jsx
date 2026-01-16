import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAdminProducts } from '../../contexts/AdminProductContext'
import ProductTable from '../../components/admin/ProductTable'

const ProductsListPage = () => {
  const { products, toggleProductActive, deleteProduct } = useAdminProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
    return cats
  }, [products])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = filterCategory === 'all' || 
        product.category?.toLowerCase() === filterCategory.toLowerCase()
      
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && product.isActive && !product.isArchived) ||
        (filterStatus === 'inactive' && !product.isActive) ||
        (filterStatus === 'archived' && product.isArchived)
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, searchQuery, filterCategory, filterStatus])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} products found
          </p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          <i className="bi bi-plus-lg mr-2"></i>
          Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Products Table */}
      <ProductTable 
        products={paginatedProducts}
        onToggleActive={toggleProductActive}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'border hover:bg-muted'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsListPage
