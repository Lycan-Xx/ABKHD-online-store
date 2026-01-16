import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminProducts } from '../../contexts/AdminProductContext'
import StatsCard from '../../components/admin/StatsCard'
import SimpleChart from '../../components/admin/SimpleChart'

const DashboardPage = () => {
  const { getStats, products } = useAdminProducts()
  const stats = getStats()

  // Get recent products (last 5)
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your store performance</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          <i className="bi bi-plus-lg mr-2"></i>
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Products" 
          value={stats.totalProducts}
          icon="bi-box-seam"
          description="All products in catalog"
        />
        <StatsCard 
          title="Active Products" 
          value={stats.activeProducts}
          icon="bi-check-circle"
          description="Available in store"
          variant="success"
        />
        <StatsCard 
          title="Featured" 
          value={stats.featuredProducts}
          icon="bi-star"
          description="Highlighted products"
          variant="warning"
        />
        <StatsCard 
          title="Categories" 
          value={stats.totalCategories}
          icon="bi-folder"
          description="Product categories"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Products by Category</h2>
          <SimpleChart data={stats.productsByCategory} />
        </div>

        {/* Recent Products */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Products</h2>
            <Link to="/admin/products" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts.length > 0 ? (
              recentProducts.map(product => (
                <Link 
                  key={product.id} 
                  to={`/admin/products/${product.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₦{product.price?.toLocaleString()}
                    </p>
                  </div>
                  {product.featured && (
                    <span className="text-warning text-xs">
                      <i className="bi bi-star-fill"></i>
                    </span>
                  )}
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No products yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
