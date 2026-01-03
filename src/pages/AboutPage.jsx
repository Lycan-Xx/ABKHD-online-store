import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <i className="bi bi-arrow-left mr-2"></i>
            Back to Home
          </Link>
        </div>
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">The ABKHD Standard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium Tech, Smarter Prices — why pay full retail when you can own the best for less?
          </p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We're putting ourselves on the line to assure you what you get is the best out there. Since 2020, we've specialized in sourcing premium, high-performance UK-used laptops, mobile phones, and tablets — delivering the quality of a new device at a fraction of the cost.
              </p>
              <p>
                We want to distance ourselves from the uncertainty of buying used tech — where you're unsure of the warranty, the quality, or whether it will even work. This is who we are, and we give you our word for it.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl border border-border bg-card flex items-center justify-center">
              <div className="text-center p-8">
                <i className="bi bi-patch-check-fill text-primary text-5xl mb-4"></i>
                <p className="text-lg font-medium">Certified Performance</p>
                <p className="text-sm text-muted-foreground mt-2">Every device tested & verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quality You Can Trust */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quality You Can Trust</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Buying used electronics often feels like a gamble. We're here to change that.
            </p>
          </div>
          <div className="p-8 rounded-xl border border-border bg-card/50">
            <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto">
              Every device in our collection undergoes a <span className="font-semibold text-primary">rigorous multi-point inspection process</span>. Our team of expert technicians examines everything from battery health and screen clarity to processor speed and port functionality. We don't just sell "used" tech; we sell <span className="font-semibold">certified performance</span>.
            </p>
          </div>
        </div>

        {/* How We Certify */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How We Certify</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our multi-point inspection ensures you get certified performance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Source</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Carefully selected from trusted UK suppliers
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Test</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Multi-point inspection of all components
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Certify</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grade and verify performance standards
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Deliver</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ready for you with our quality guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose ABKHD - Hybrid Layout */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ABKHD</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-3xl mx-auto">
            <div className="flex items-start space-x-4">
              <i className="bi bi-globe-europe-africa text-primary text-2xl mt-1 flex-shrink-0"></i>
              <div>
                <h3 className="font-semibold mb-2">UK-Sourced Quality</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We exclusively source our inventory from the UK, ensuring you receive devices that have been well-maintained and meet international standards.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <i className="bi bi-clipboard-check text-primary text-2xl mt-1 flex-shrink-0"></i>
              <div>
                <h3 className="font-semibold mb-2">Rigorous Testing</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every phone, tablet, and laptop is tested for 100% functionality. If it doesn't perform like new, it doesn't make it to our store.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <i className="bi bi-tags text-primary text-2xl mt-1 flex-shrink-0"></i>
              <div>
                <h3 className="font-semibold mb-2">Exceptional Value</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get the brands you love — Apple, Samsung, HP, Dell, and more — without the "brand new" price tag.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <i className="bi bi-recycle text-primary text-2xl mt-1 flex-shrink-0"></i>
              <div>
                <h3 className="font-semibold mb-2">Sustainable Tech</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  By choosing a high-quality used device, you help reduce e-waste and promote a more sustainable, circular economy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testing Process */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Testing Process</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <i className="bi bi-battery-charging text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Battery Health</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <i className="bi bi-display text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Screen Clarity</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <i className="bi bi-cpu text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Processor Speed</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <i className="bi bi-plug text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Port Function</p>
            </div>
          </div>
        </div>

        {/* Team Section with Illustrated Avatars */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <p className="text-center text-muted-foreground mb-8">
            The people behind ABKHD who ensure you get the best.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center p-6 rounded-xl border border-border bg-card/50">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="50" fill="#667eea"/>
                  <circle cx="50" cy="40" r="15" fill="#fff"/>
                  <ellipse cx="50" cy="75" rx="25" ry="20" fill="#fff"/>
                </svg>
              </div>
              <h3 className="font-semibold">Team Member</h3>
              <p className="text-sm text-muted-foreground">Founder & CEO</p>
            </div>
            {/* Team Member 2 */}
            <div className="text-center p-6 rounded-xl border border-border bg-card/50">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="50" fill="#f687b3"/>
                  <circle cx="50" cy="40" r="15" fill="#fff"/>
                  <ellipse cx="50" cy="75" rx="25" ry="20" fill="#fff"/>
                </svg>
              </div>
              <h3 className="font-semibold">Team Member</h3>
              <p className="text-sm text-muted-foreground">Quality Control Lead</p>
            </div>
            {/* Team Member 3 */}
            <div className="text-center p-6 rounded-xl border border-border bg-card/50">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="50" fill="#48bb78"/>
                  <circle cx="50" cy="40" r="15" fill="#fff"/>
                  <ellipse cx="50" cy="75" rx="25" ry="20" fill="#fff"/>
                </svg>
              </div>
              <h3 className="font-semibold">Team Member</h3>
              <p className="text-sm text-muted-foreground">Operations Manager</p>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <i className="bi bi-info-circle mr-1"></i>
            Add your real team members' photos and info here
          </p>
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-xl border border-border bg-card/50">
          <h2 className="text-2xl font-bold mb-3">Upgrade Your Tech Today</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Experience the perfect blend of functionality and affordability. Join customers who have discovered a smarter way to buy technology.
          </p>
          <Link to="/inventory" className="btn-primary px-8 py-3">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
