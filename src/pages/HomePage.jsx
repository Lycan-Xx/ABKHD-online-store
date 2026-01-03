import React from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import ProductGrid from '../components/ProductGrid'

const HomePage = () => {
  const { products } = useProducts()
  const featuredProducts = products.filter(product => product.featured)

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="container pt-12 md:pt-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Premium Tech.
            <br />
            <span className="text-primary">Smarter Prices.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            UK and China-sourced laptops, phones, tablets and accessories rigorously tested and certified.
            Get the quality of new at a fraction of the cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/inventory" className="btn-primary px-8 py-3 text-base">
              Browse Products
            </Link>
            <Link to="/about" className="btn-secondary px-8 py-3 text-base">
              How We Certify
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-4 p-6 rounded-xl border border-border bg-card/50">
            <i className="bi bi-globe-europe-africa text-primary text-2xl mt-1 flex-shrink-0"></i>
            <div>
              <h3 className="font-semibold mb-2">Global Quality Sourcing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sourced from trusted UK and China suppliers, ensuring well-maintained devices meeting your standards.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-6 rounded-xl border border-border bg-card/50">
            <i className="bi bi-clipboard-check text-primary text-2xl mt-1 flex-shrink-0"></i>
            <div>
              <h3 className="font-semibold mb-2">Rigorous Testing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every device undergoes multi-point inspection; battery, screen, performance, and all ports are checked.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-6 rounded-xl border border-border bg-card/50">
            <i className="bi bi-recycle text-primary text-2xl mt-1 flex-shrink-0"></i>
            <div>
              <h3 className="font-semibold mb-2">Sustainable Choice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reduce e-waste and support a circular economy by choosing certified pre-owned tech. instead of buying new.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">This Week's Featured Picks</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hand-picked devices, tested and ready for you{' '}
            <span className="inline-block bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-sm uppercase tracking-wide animate-pulse">
              ONLY AVAILABLE THIS WEEK
            </span>
          </p>
        </div>
        <ProductGrid products={featuredProducts} />
        <div className="text-center mt-10 pb-5">
          <Link to="/inventory" className="btn-secondary px-8 py-3">
            View All Products
          </Link>
        </div>
      </section>


    </div>
  )
}

export default HomePage
