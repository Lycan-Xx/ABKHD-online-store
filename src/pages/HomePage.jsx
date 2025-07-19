import React from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductGrid from '../components/ProductGrid'

const HomePage = () => {
  const featuredProducts = products.filter(product => product.featured)

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Quality,
              <br />
              Modern Design
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Discover our curated collection of premium products designed for modern living.
            </p>

          </div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our latest picks for you
          </p>
        </div>
        <ProductGrid products={featuredProducts} />
        <div className="text-center mt-12">
          <Link to="/inventory" className="btn-primary px-8 py-3 border-2 border-accent flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-200 dark:border-accent/80 focus:ring-2 focus:ring-accent/60">
            <i className="bi bi-grid-fill text-lg"></i>
            View All Products
          </Link>
        </div>
      </section>

      {/* Categories
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground">
            Explore our carefully curated categories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/category/clothing" className="group relative overflow-hidden rounded-lg aspect-[4/3]">
            <img
              src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Clothing"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Clothing</h3>
                <p className="text-lg">Premium apparel for every occasion</p>
              </div>
            </div>
          </Link>
          <Link to="/category/accessories" className="group relative overflow-hidden rounded-lg aspect-[4/3]">
            <img
              src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Accessories"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Accessories</h3>
                <p className="text-lg">Complete your look with our accessories</p>
              </div>
            </div>
          </Link>
        </div>
      </section> */}

      {/* Features */}
      <section className="bg-muted/50">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center border-2 border-muted rounded-lg p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-truck text-primary-foreground text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping only for residents around Jimeta and Yola</p>
            </div>
            <div className="text-center border-2 border-muted rounded-lg p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-arrow-clockwise text-primary-foreground text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">7-days money back guarantee if you are not satisfied</p>
            </div>
            <div className="text-center border-2 border-muted rounded-lg p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-shield-check text-primary-foreground text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Security and Privacy conscious</h3>
              <p className="text-muted-foreground">You don't need to create account unless you want to</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
