import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className="container py-12 relative">
      {/* Animated Background Dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-60 left-1/4 w-1 h-1 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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
        
        {/* Hero Section - The Honest Truth */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            We've Been Cheated Too.
          </h1>
          <p className="text-2xl text-primary font-semibold mb-4">
            That's exactly why ABKHD exists.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Before we started selling tech, we were buyers. And like many of you, we've been burned—fake warranties, hidden defects, devices that died within weeks. We built ABKHD to be the store we wish existed when we were on the other side.
          </p>
        </div>

        {/* The Story - Why We Started */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How Distrust Built Trust</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            This is our story. It might sound familiar.
          </p>
          
          <div className="space-y-8">
            {/* Beat 1: The Problem */}
            <div className="flex items-start space-x-6 p-6 rounded-xl border border-border bg-card/30 hover:border-primary/50 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <i className="bi bi-x-circle text-red-500 text-2xl"></i>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">The Problem</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In 2019, we bought three "UK-used" laptops from different sellers in Yola. Two had counterfeit parts. One completely died after 5 days. When we tried to reach the sellers, their numbers were switched off. ₦450,000 gone. Just like that.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  That moment taught us: in this market, you're on your own. Unless someone decides to change the game.
                </p>
              </div>
            </div>

            {/* Beat 2: The Pattern */}
            <div className="flex items-start space-x-6 p-6 rounded-xl border border-border bg-card/30 hover:border-primary/50 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <i className="bi bi-exclamation-triangle text-orange-500 text-2xl"></i>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">The Pattern</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We started asking around. Friends, family, colleagues—everyone had a horror story. Fake chargers. Screen issues hidden with bright showroom lighting. Battery health lied about. "UK-used" devices that never left Lagos warehouses.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/50 text-sm">
                    <i className="bi bi-chat-quote text-primary mr-2"></i>
                    <span className="text-muted-foreground italic">"The battery died in 3 months..."</span>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/50 text-sm">
                    <i className="bi bi-chat-quote text-primary mr-2"></i>
                    <span className="text-muted-foreground italic">"They said it was unlocked. It wasn't..."</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Beat 3: The Decision */}
            <div className="flex items-start space-x-6 p-6 rounded-xl border border-primary/30 bg-primary/5 hover:border-primary transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <i className="bi bi-lightbulb text-primary text-2xl"></i>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">The Decision</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We had a choice: accept this is "just how it is" or become the change. We chose the latter. In 2020, ABKHD was born—not as just another tech store, but as a promise to do things differently.
                </p>
                <p className="text-sm font-medium text-primary">
                  <i className="bi bi-arrow-right mr-2"></i>
                  If we wouldn't buy it ourselves, we won't sell it to you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values - Non-Negotiables */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Non-Negotiables</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            These aren't just values. They're commitments we make to every customer.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Value 1 */}
            <div className="p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-all">
              <div className="flex items-start space-x-4 mb-4">
                <i className="bi bi-eye text-primary text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-bold mb-2">Radical Transparency</h3>
                  <p className="text-sm font-semibold text-primary mb-2">If it's broken, we'll tell you.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Every defect—no matter how small—is disclosed in the product description. Screenshots, photos, everything. You decide if it's a deal-breaker, not us.
              </p>
              
              {/* Mock Screenshot Placeholder */}
              <div className="relative rounded-lg border-2 border-dashed border-primary/30 bg-muted/20 p-4 text-center">
                <i className="bi bi-image text-primary text-3xl mb-2 opacity-50"></i>
                <p className="text-xs text-muted-foreground">Example: Product listing showing disclosed screen scratch</p>
                <p className="text-xs text-primary mt-1">[Add real screenshot here]</p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-all">
              <div className="flex items-start space-x-4 mb-4">
                <i className="bi bi-shield-check text-primary text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-bold mb-2">No Fake Warranties</h3>
                  <p className="text-sm font-semibold text-primary mb-2">We don't make promises we can't keep.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                If we offer a warranty, it's real and enforceable. No fine print loopholes. No ghosting after sale. We're on WhatsApp, we're here.
              </p>
              
              {/* Mock Screenshot Placeholder */}
              <div className="relative rounded-lg border-2 border-dashed border-primary/30 bg-muted/20 p-4 text-center">
                <i className="bi bi-image text-primary text-3xl mb-2 opacity-50"></i>
                <p className="text-xs text-muted-foreground">Example: Clear warranty terms in product page</p>
                <p className="text-xs text-primary mt-1">[Add real screenshot here]</p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-all">
              <div className="flex items-start space-x-4 mb-4">
                <i className="bi bi-clipboard-check text-primary text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-bold mb-2">Tested, Not Trusted</h3>
                  <p className="text-sm font-semibold text-primary mb-2">We verify everything. You verify nothing.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Battery health? We show you the diagnostics. Screen issues? We photograph them. Ports? All tested. You shouldn't have to guess.
              </p>
              
              {/* Mock Screenshot Placeholder */}
              <div className="relative rounded-lg border-2 border-dashed border-primary/30 bg-muted/20 p-4 text-center">
                <i className="bi bi-image text-primary text-3xl mb-2 opacity-50"></i>
                <p className="text-xs text-muted-foreground">Example: Battery health diagnostic report</p>
                <p className="text-xs text-primary mt-1">[Add real screenshot here]</p>
              </div>
            </div>

            {/* Value 4 */}
            <div className="p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-all">
              <div className="flex items-start space-x-4 mb-4">
                <i className="bi bi-people text-primary text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-bold mb-2">Your Advocate, Not Just Your Seller</h3>
                  <p className="text-sm font-semibold text-primary mb-2">If we wouldn't buy it, we won't sell it to you.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                We treat your money like our own. If a device doesn't meet our standards, it doesn't go live—even if we could sell it.
              </p>
              
              {/* Mock Screenshot Placeholder */}
              <div className="relative rounded-lg border-2 border-dashed border-primary/30 bg-muted/20 p-4 text-center">
                <i className="bi bi-image text-primary text-3xl mb-2 opacity-50"></i>
                <p className="text-xs text-muted-foreground">Example: Rejected device with explanation</p>
                <p className="text-xs text-primary mt-1">[Add real screenshot here]</p>
              </div>
            </div>
          </div>
        </div>

        {/* How We're Different - Comparison Table */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How We're Different</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            The contrast is clear. You decide who to trust.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="p-4 text-left font-bold text-lg">Typical Sellers</th>
                  <th className="p-4 text-left font-bold text-lg text-primary">ABKHD</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <i className="bi bi-x-circle text-red-500 mr-2"></i>
                    <span className="text-muted-foreground">"UK-used" (source unknown)</span>
                  </td>
                  <td className="p-4">
                    <i className="bi bi-check-circle-fill text-primary mr-2"></i>
                    <span>UK and China-sourced with supplier verification</span>
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <i className="bi bi-x-circle text-red-500 mr-2"></i>
                    <span className="text-muted-foreground">Hidden defects</span>
                  </td>
                  <td className="p-4">
                    <i className="bi bi-check-circle-fill text-primary mr-2"></i>
                    <span>All defects disclosed upfront with photos</span>
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <i className="bi bi-x-circle text-red-500 mr-2"></i>
                    <span className="text-muted-foreground">Generic "warranty included"</span>
                  </td>
                  <td className="p-4">
                    <i className="bi bi-check-circle-fill text-primary mr-2"></i>
                    <span>Specific, enforceable warranty terms</span>
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <i className="bi bi-x-circle text-red-500 mr-2"></i>
                    <span className="text-muted-foreground">Disappear after sale</span>
                  </td>
                  <td className="p-4">
                    <i className="bi bi-check-circle-fill text-primary mr-2"></i>
                    <span>WhatsApp support, real humans, always reachable</span>
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <i className="bi bi-x-circle text-red-500 mr-2"></i>
                    <span className="text-muted-foreground">"Trust me, it works"</span>
                  </td>
                  <td className="p-4">
                    <i className="bi bi-check-circle-fill text-primary mr-2"></i>
                    <span>Diagnostic reports, battery health, photos</span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <i className="bi bi-x-circle text-red-500 mr-2"></i>
                    <span className="text-muted-foreground">Switched-off numbers after issues</span>
                  </td>
                  <td className="p-4">
                    <i className="bi bi-check-circle-fill text-primary mr-2"></i>
                    <span>Permanent contact, we stand behind every sale</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* The Promise */}
        <div className="mb-24">
          <div className="p-10 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <i className="bi bi-shield-fill-check text-primary text-5xl mb-4"></i>
                <h2 className="text-3xl font-bold mb-4">The ABKHD Guarantee</h2>
              </div>
              <div className="max-w-2xl mx-auto space-y-4 text-center">
                <p className="text-lg leading-relaxed">
                  We can't undo the times you've been cheated before. But we can make sure it never happens here.
                </p>
                <p className="text-lg leading-relaxed">
                  Every device you see has been tested. Every defect has been disclosed. Every warranty is real. And if something goes wrong? We're on WhatsApp. We're here.
                </p>
                <p className="text-lg leading-relaxed font-medium text-primary">
                  This isn't just business for us. It's personal. Because we remember what it felt like to be on the other side.
                </p>
              </div>
              <div className="text-center mt-8">
                <Link to="/inventory" className="btn-primary px-10 py-4 text-lg">
                  See Our Products
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How We Certify */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How We Certify Every Device</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our multi-point inspection ensures you get certified performance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-all">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Source</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Carefully selected from trusted UK and China suppliers
              </p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-all">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Test</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Multi-point inspection of all components and functionality
              </p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-all">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Disclose</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Document every defect with photos and descriptions
              </p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-all">
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

        {/* Testing Process Details */}
        <div className="mb-24">
          <h3 className="text-2xl font-bold text-center mb-8">What We Test</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-colors">
              <i className="bi bi-battery-charging text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Battery Health</p>
              <p className="text-xs text-muted-foreground mt-1">With diagnostics</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-colors">
              <i className="bi bi-display text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Screen Clarity</p>
              <p className="text-xs text-muted-foreground mt-1">Every pixel checked</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-colors">
              <i className="bi bi-cpu text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Processor Speed</p>
              <p className="text-xs text-muted-foreground mt-1">Performance tested</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30 hover:border-primary transition-colors">
              <i className="bi bi-plug text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Port Function</p>
              <p className="text-xs text-muted-foreground mt-1">All ports verified</p>
            </div>
          </div>
        </div>

        {/* Meet The Team */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-center text-muted-foreground mb-12">
            Real people with real stakes in doing this right.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border border-border bg-card/30">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="50" fill="#667eea"/>
                  <circle cx="50" cy="40" r="15" fill="#fff"/>
                  <ellipse cx="50" cy="75" rx="25" ry="20" fill="#fff"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Team Member</h3>
              <p className="text-sm text-muted-foreground mb-3">Founder & CEO</p>
              <p className="text-sm italic text-primary">
                "I bought a fake device in 2019. Never again."
              </p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="50" fill="#f687b3"/>
                  <circle cx="50" cy="40" r="15" fill="#fff"/>
                  <ellipse cx="50" cy="75" rx="25" ry="20" fill="#fff"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Team Member</h3>
              <p className="text-sm text-muted-foreground mb-3">Quality Control Lead</p>
              <p className="text-sm italic text-primary">
                "My job is to catch what dishonest sellers hide."
              </p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/30">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="50" fill="#48bb78"/>
                  <circle cx="50" cy="40" r="15" fill="#fff"/>
                  <ellipse cx="50" cy="75" rx="25" ry="20" fill="#fff"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Team Member</h3>
              <p className="text-sm text-muted-foreground mb-3">Operations Manager</p>
              <p className="text-sm italic text-primary">
                "I handle complaints so you don't have to become one."
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            <i className="bi bi-info-circle mr-1"></i>
            These are placeholders. Add your real team members' names, roles, photos, and personal stakes here.
          </p>
        </div>

        {/* Final CTA - The Invitation */}
        <div className="text-center p-12 rounded-xl border border-border bg-card/30">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Buy Tech Without the Fear?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the customers who've discovered what honest selling looks like. No games. No tricks. Just quality devices and real transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inventory" className="btn-primary px-10 py-4 text-lg">
              Browse Products
            </Link>
            <a href="https://wa.me/2348012345678" className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <i className="bi bi-whatsapp mr-2"></i>
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage