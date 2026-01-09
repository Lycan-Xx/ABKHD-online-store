import React from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import ProductGrid from '../components/ProductGrid'

const HomePage = () => {
  const { products } = useProducts()
  const featuredProducts = products.filter(product => product.featured)

  return (
    <div className="space-y-20">
      {/* Hero Section - Clean & Minimal */}
      <section className="container pt-16 md:pt-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Premium Tech.
            <br />
            <span className="text-primary">Smarter Prices.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            UK and China-sourced devices, rigorously tested and transparently disclosed. 
            Quality you can trust at prices that make sense.
          </p>
          {/* <div className="pt-4">
            <Link to="/inventory" className="btn-primary px-10 py-4 text-lg">
              Browse Products
            </Link>
          </div> */}
        </div>
      </section>


      {/* Featured Products - THE MAIN FOCUS */}
      <section className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            This Week Only
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Products</h2>
          <p className="text-muted-foreground">
            Hand-picked, tested, and ready to ship
          </p>
        </div>
        
        <ProductGrid products={featuredProducts} />
        
      </section>

      <section className="container pb-16">
        <div className="max-w-2xl mx-auto text-center p-10 rounded-xl border border-border bg-card/50">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Upgrade?
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse our full inventory of tested devices
          </p>
          <Link to="/inventory" className="btn-primary px-8 py-3">
            View our products 
          </Link>
        </div>
      </section>



      {/* Trust Pillars - Concise */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-shield-check text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold mb-2">Rigorously Tested</h3>
            <p className="text-sm text-muted-foreground">
              Every device passes multi-point inspection before sale
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-eye text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold mb-2">Fully Transparent</h3>
            <p className="text-sm text-muted-foreground">
              All defects disclosed upfront with photos and details
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-patch-check text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold mb-2">Real Warranties</h3>
            <p className="text-sm text-muted-foreground">
              Enforceable guarantees with responsive support
            </p>
          </div>
        </div>
      </section>


      {/* How We Certify - Simple Visual */}
      <section className="container">
      
        
        <div className="text-center mb-8">
          <Link to="/about" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Learn more about our process
            <i className="bi bi-arrow-right ml-2"></i>
          </Link>
        </div>
      </section>

      {/* Final CTA - Clean */}

    </div>
  )
}

export default HomePage