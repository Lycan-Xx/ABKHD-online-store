import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminProducts } from '../../contexts/AdminProductContext'
import { useOrders } from '../../contexts/OrderContext'
import StatsCard from '../../components/admin/StatsCard'
import SimpleChart from '../../components/admin/SimpleChart'

const DashboardPage = () => {
  const { getStats, products } = useAdminProducts()
  const { getCompletedOrders, getTotalRevenue, getOrderCount, copyReceipt } = useOrders()
  const stats = getStats()
  
  // Tab state: 'overview' or 'orders'
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedOrderId, setCopiedOrderId] = useState(null)

  // Get orders data
  const completedOrders = getCompletedOrders()
  const totalRevenue = getTotalRevenue()
  const orderCount = getOrderCount()

  // Get recent products (last 5)
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Handle copy receipt
  const handleCopyReceipt = async (order) => {
    const success = await copyReceipt(order)
    if (success) {
      setCopiedOrderId(order.id)
      setTimeout(() => setCopiedOrderId(null), 2000)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}
          >
            <i className="bi bi-grid mr-2"></i>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}
          >
            <i className="bi bi-bag-check mr-2"></i>
            Completed Orders
            {orderCount > 0 && (
              <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                {orderCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
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
              title="Total Revenue" 
              value={`₦${totalRevenue.toLocaleString()}`}
              icon="bi-currency-naira"
              description="From completed orders"
              variant="success"
            />
            <StatsCard 
              title="Completed Orders" 
              value={orderCount}
              icon="bi-bag-check"
              description="Total orders"
              variant="warning"
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
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Orders Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard 
              title="Total Revenue" 
              value={`₦${totalRevenue.toLocaleString()}`}
              icon="bi-currency-naira"
              description="From all orders"
              variant="success"
            />
            <StatsCard 
              title="Completed Orders" 
              value={orderCount}
              icon="bi-bag-check"
              description="Total orders"
              variant="warning"
            />
            <StatsCard 
              title="Average Order Value" 
              value={orderCount > 0 ? `₦${Math.round(totalRevenue / orderCount).toLocaleString()}` : '₦0'}
              icon="bi-graph-up"
              description="Per order"
            />
          </div>

          {/* Orders List */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">All Completed Orders</h2>
              <p className="text-sm text-muted-foreground">View order details and copy receipts</p>
            </div>
            
            {completedOrders.length > 0 ? (
              <div className="divide-y">
                {completedOrders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm font-medium">{order.id}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <i className="bi bi-check-circle mr-1"></i>
                            Completed
                          </span>
                        </div>
                        
                        {/* Customer Info */}
                        <div className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium text-foreground">{order.customer?.fullName || 'N/A'}</span>
                          {' • '}
                          {order.customer?.email || 'N/A'}
                          {' • '}
                          {order.customer?.phone || 'N/A'}
                        </div>
                        
                        {/* Items Summary */}
                        <div className="text-sm text-muted-foreground">
                          {order.items?.length || 0} item(s) • {order.items?.map(i => i.name).join(', ')}
                        </div>
                        
                        {/* Date */}
                        <div className="text-xs text-muted-foreground mt-1">
                          <i className="bi bi-calendar3 mr-1"></i>
                          {formatDate(order.createdAt)}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Payment Reference */}
                        <div className="bg-muted px-3 py-2 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Payment Reference</p>
                          <p className="font-mono text-sm font-medium">{order.paymentRef}</p>
                        </div>

                        {/* Total */}
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="text-lg font-semibold text-green-600">
                            ₦{order.total?.toLocaleString()}
                          </p>
                        </div>

                        {/* Copy Receipt Button */}
                        <button
                          onClick={() => handleCopyReceipt(order)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                            copiedOrderId === order.id
                              ? 'bg-green-600 text-white'
                              : 'bg-primary text-primary-foreground hover:bg-primary/90'
                          }`}
                        >
                          {copiedOrderId === order.id ? (
                            <>
                              <i className="bi bi-check-lg"></i>
                              Copied!
                            </>
                          ) : (
                            <>
                              <i className="bi bi-clipboard"></i>
                              Copy Receipt
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-bag-x text-3xl text-muted-foreground"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">Completed orders will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
