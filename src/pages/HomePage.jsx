import React from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../contexts/ProductContext'
import ProductGrid from '../components/ProductGrid'

const HomePage = () => {
  const { products } = useProducts()
  const featuredProducts = products.filter(product => product.featured)

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="container pt-12 md:pt-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Premium Tech.
            <br />
            <span className="text-primary">Smarter Prices.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            UK-sourced laptops, phones, and tablets — rigorously tested and certified. 
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
          <div className="flex items-start gap-4 p-6 rounded-xl border bg-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i className="bi bi-globe-europe-africa text-primary text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold mb-1">UK-Sourced Quality</h3>
              <p className="text-sm text-muted-foreground">
                Exclusively sourced from the UK, ensuring well-maintained devices meeting international standards.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-xl border bg-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i className="bi bi-clipboard-check text-primary text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Rigorous Testing</h3>
              <p className="text-sm text-muted-foreground">
                Every device undergoes multi-point inspection — battery, screen, processor, and ports all verified.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-xl border bg-card">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <i className="bi bi-recycle text-primary text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Sustainable Choice</h3>
              <p className="text-sm text-muted-foreground">
                Reduce e-waste and support a circular economy by choosing certified pre-owned tech.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <div className="text-center mb-10">
          <h2 className="section-heading mb-3">Featured Products</h2>
          <p className="section-subheading mx-auto">
            Hand-picked devices, tested and ready for you
          </p>
        </div>
        <ProductGrid products={featuredProducts} />
        <div className="text-center mt-10">
          <Link to="/inventory" className="btn-secondary px-8 py-3">
            View All Products
          </Link>
        </div>
      </section>

      {/* How We Certify */}
      <section className="bg-muted/50">
        <div className="container py-16">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">How We Certify</h2>
            <p className="section-subheading mx-auto">
              Our multi-point inspection ensures you get certified performance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Source</h3>
              <p className="text-sm text-muted-foreground">
                Carefully selected from trusted UK suppliers
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Test</h3>
              <p className="text-sm text-muted-foreground">
                Multi-point inspection of all components
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Certify</h3>
              <p className="text-sm text-muted-foreground">
                Grade and verify performance standards
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Deliver</h3>
              <p className="text-sm text-muted-foreground">
                Ready for you with our quality guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Quote */}
      <section className="container">
        <div className="max-w-3xl mx-auto text-center py-8">
          <blockquote className="text-xl md:text-2xl font-medium text-foreground">
            "We don't just sell 'used' tech; we sell{' '}
            <span className="text-primary">certified performance</span>."
          </blockquote>
          <p className="mt-4 text-muted-foreground">
            Every device is vetted to meet the ABKHD standard of excellence.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-truck text-primary text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Free Local Delivery</h3>
              <p className="text-sm text-muted-foreground">Free delivery in Jimeta & Yola areas</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-arrow-clockwise text-primary text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">7-Day Returns</h3>
              <p className="text-sm text-muted-foreground">Money back if you're not satisfied</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-shield-check text-primary text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">100% tested and verified devices</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
