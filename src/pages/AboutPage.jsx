import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ABKHD Store</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're passionate about creating premium quality products that enhance modern living through thoughtful design and exceptional craftsmanship.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2020, ABKHD Store began with a simple mission: to create products that seamlessly blend functionality with aesthetic appeal. What started as a small team of designers and craftspeople has grown into a trusted brand known for quality and innovation.
              </p>
              <p>
                We believe that everyday items should be both beautiful and practical. From our signature t-shirts to our carefully curated accessories, every product is designed with attention to detail and built to last.
              </p>
              <p>
                Our commitment to sustainability drives us to use eco-friendly materials and ethical manufacturing processes, ensuring that our products are good for both you and the planet.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="ABKHD Store team"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-heart text-primary-foreground text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality First</h3>
              <p className="text-muted-foreground">
                We never compromise on quality. Every product undergoes rigorous testing to ensure it meets our high standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-leaf text-primary-foreground text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-muted-foreground">
                Environmental responsibility is at the core of our business. We use sustainable materials and ethical practices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-people text-primary-foreground text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-muted-foreground">
                We believe in building strong relationships with our customers and supporting the communities we serve.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Sarah Johnson"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                crossOrigin="anonymous"
              />
              <h3 className="text-lg font-semibold">Sarah Johnson</h3>
              <p className="text-muted-foreground text-sm">Founder & CEO</p>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Michael Chen"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                crossOrigin="anonymous"
              />
              <h3 className="text-lg font-semibold">Michael Chen</h3>
              <p className="text-muted-foreground text-sm">Head of Design</p>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Emily Rodriguez"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                crossOrigin="anonymous"
              />
              <h3 className="text-lg font-semibold">Emily Rodriguez</h3>
              <p className="text-muted-foreground text-sm">Operations Manager</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience ABKHD Quality?</h2>
          <p className="text-muted-foreground mb-6">
            Discover our curated collection of premium products designed for modern living.
          </p>
          <Link to="/products" className="btn-primary px-8 py-3">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AboutPage