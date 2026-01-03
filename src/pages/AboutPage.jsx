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
            <div className="space-y-4 text-muted-foreground">
              <p>
                We want to sell phones, computers and accessories at very affordable prices. We're trying to distance ourselves from the regular way it was done before — you buy a phone but are not sure of the warranty, if the quality is great, a lot of uncertainties.
              </p>
              <p>
                We're putting ourselves on the line to assure you what you get is the best out there. This is who we are and we can give you our word for it.
              </p>
              <p>
                Since 2020, we've specialized in sourcing premium, high-performance UK-used laptops, mobile phones, and tablets — delivering the quality of a new device at a fraction of the cost.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl border bg-muted flex items-center justify-center">
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
          <div className="p-8 rounded-xl border bg-card">
            <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto">
              Every device in our collection undergoes a <span className="font-semibold text-primary">rigorous multi-point inspection process</span>. Our team of expert technicians examines everything from battery health and screen clarity to processor speed and port functionality. We don't just sell "used" tech; we sell <span className="font-semibold">certified performance</span>.
            </p>
          </div>
        </div>

        {/* Why Choose ABKHD */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ABKHD</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <i className="bi bi-globe-europe-africa text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">UK-Sourced Quality</h3>
              <p className="text-muted-foreground text-sm">
                We exclusively source our inventory from the UK, ensuring you receive devices that have been well-maintained and meet international standards.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <i className="bi bi-clipboard-check text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Rigorous Testing</h3>
              <p className="text-muted-foreground text-sm">
                Every phone, tablet, and laptop is tested for 100% functionality. If it doesn't perform like new, it doesn't make it to our store.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <i className="bi bi-tags text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Exceptional Value</h3>
              <p className="text-muted-foreground text-sm">
                Get the brands you love — Apple, Samsung, HP, Dell, and more — without the "brand new" price tag.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <i className="bi bi-recycle text-primary text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sustainable Tech</h3>
              <p className="text-muted-foreground text-sm">
                By choosing a high-quality used device, you are helping reduce e-waste and promoting a more sustainable, circular economy.
              </p>
            </div>
          </div>
        </div>

        {/* Testing Process */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Testing Process</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl border bg-card">
              <i className="bi bi-battery-charging text-primary text-2xl mb-3"></i>
              <p className="text-sm font-medium">Battery Health</p>
            </div>
            <div className="text-center p-4 rounded-xl border bg-card">
              <i className="bi bi-display text-primary text-2xl mb-3"></i>
              <p className="text-sm font-medium">Screen Clarity</p>
            </div>
            <div className="text-center p-4 rounded-xl border bg-card">
              <i className="bi bi-cpu text-primary text-2xl mb-3"></i>
              <p className="text-sm font-medium">Processor Speed</p>
            </div>
            <div className="text-center p-4 rounded-xl border bg-card">
              <i className="bi bi-plug text-primary text-2xl mb-3"></i>
              <p className="text-sm font-medium">Port Function</p>
            </div>
          </div>
        </div>

        {/* Team Section - Placeholder for real team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <p className="text-center text-muted-foreground mb-8">
            The people behind ABKHD who ensure you get the best.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 - Replace with real data */}
            <div className="text-center p-6 rounded-xl border bg-card">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <i className="bi bi-person text-3xl text-muted-foreground"></i>
              </div>
              <h3 className="font-semibold">Team Member</h3>
              <p className="text-sm text-muted-foreground">Role / Position</p>
            </div>
            {/* Team Member 2 - Replace with real data */}
            <div className="text-center p-6 rounded-xl border bg-card">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <i className="bi bi-person text-3xl text-muted-foreground"></i>
              </div>
              <h3 className="font-semibold">Team Member</h3>
              <p className="text-sm text-muted-foreground">Role / Position</p>
            </div>
            {/* Team Member 3 - Replace with real data */}
            <div className="text-center p-6 rounded-xl border bg-card">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <i className="bi bi-person text-3xl text-muted-foreground"></i>
              </div>
              <h3 className="font-semibold">Team Member</h3>
              <p className="text-sm text-muted-foreground">Role / Position</p>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <i className="bi bi-info-circle mr-1"></i>
            Add your real team members' photos and info here
          </p>
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-xl border bg-card">
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
