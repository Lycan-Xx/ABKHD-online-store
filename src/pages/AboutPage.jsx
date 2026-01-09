import React from 'react'
import { Link } from 'react-router-dom'
import BackButton from '../components/ui/BackButton'

const AboutPage = () => {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-12">
          <BackButton to="/" text="Back to Home" variant="prominent" />
        </div>
        
        {/* SECTION 1: HERO - Emotional Hook */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            We've Been Cheated Too.
          </h1>
          <p className="text-xl text-primary font-semibold mb-4">
            That's exactly why ABKHD exists.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I once bought a used mobile phone at our local gadget market. The phone looked good, but unbeknownst to me, it had a bad battery, overheated when connected to the internet, had been worked on by an inexperienced technician, and had many more issues. Long story short, the phone died just 2 days after I bought it.
            <br />
            We built <span className="text-primary font-semibold">ABKHD</span> to be the store we wish existed when we were buyers.
          </p>
        </div>

        {/* SECTION 2: OUR STORY - Single Condensed Card */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">How Distrust Built Trust</h2>
          
          <div className="p-8 rounded-xl border border-border bg-card/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                  <i className="bi bi-x-circle text-red-500 text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">The Problem</h3>
                <p className="text-sm text-muted-foreground">
                  Fake parts, dead devices, sellers who ghosted us after taking our money.
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                  <i className="bi bi-exclamation-triangle text-orange-500 text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">The Pattern</h3>
                <p className="text-sm text-muted-foreground">
                  Everyone we knew had horror stories. This was just "how things are."
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <i className="bi bi-arrow-right text-primary text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">The Decision</h3>
                <p className="text-sm text-muted-foreground">
                  In 2024, ABKHD was born. A promise to do things differently.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: TOP 2 NON-NEGOTIABLES */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">Our Non-Negotiables</h2>
          <p className="text-center text-muted-foreground mb-10">
            These aren't just values. They're commitments we make to every customer.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Value 1: Radical Transparency */}
            <div className="p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <div className="flex items-start space-x-4 mb-4">
                <i className="bi bi-eye text-primary text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-bold mb-1">Radical Transparency</h3>
                  <p className="text-sm font-semibold text-primary">If it's broken, we'll tell you.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every defect no matter how small is disclosed in the product description. Screenshots, photos, everything. You decide if it's a deal-breaker, not us.
              </p>
            </div>

            {/* Value 2: Real Warranties */}
            <div className="p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <div className="flex items-start space-x-4 mb-4">
                <i className="bi bi-shield-check text-primary text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-bold mb-1">Real Warranties</h3>
                  <p className="text-sm font-semibold text-primary">No fake promises.</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If we offer a warranty, it's real and enforceable. No fine print loopholes. No ghosting after sale. We're on WhatsApp, we're here.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: COMPARISON TABLE */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">How We're Different</h2>
          <p className="text-center text-muted-foreground mb-10">
            The contrast is clear. You decide who to trust.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="p-4 text-left font-bold">Typical Sellers</th>
                  <th className="p-4 text-left font-bold text-primary">ABKHD</th>
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
                    <span>UK and China-sourced with verification</span>
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <i className="bi bi-x-circle text-red-500 mr-2"></i>
                    <span className="text-muted-foreground">Hidden defects</span>
                  </td>
                  <td className="p-4">
                    <i className="bi bi-check-circle-fill text-primary mr-2"></i>
                    <span>All defects disclosed with photos</span>
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
                    <span>WhatsApp support, always reachable</span>
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <i className="bi bi-x-circle text-red-500 mr-2"></i>
                    <span className="text-muted-foreground">"Trust me, it works"</span>
                  </td>
                  <td className="p-4">
                    <i className="bi bi-check-circle-fill text-primary mr-2"></i>
                    <span>Diagnostic reports and battery health shown</span>
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

        {/* SECTION 5: CERTIFICATION PROCESS */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-3">How We Certify Every Device</h2>
          <p className="text-center text-muted-foreground mb-10">
            Our multi-point inspection ensures you get certified performance
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Source</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Carefully selected from trusted UK and China suppliers
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Test</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Multi-point inspection of all components
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Disclose</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Document every defect with photos and descriptions
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
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

        {/* SECTION 6: TESTING GRID */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-8">What We Test</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <i className="bi bi-battery-charging text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Battery Health</p>
              <p className="text-xs text-muted-foreground mt-1">With diagnostics</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <i className="bi bi-display text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Screen Clarity</p>
              <p className="text-xs text-muted-foreground mt-1">Every pixel checked</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <i className="bi bi-cpu text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Processor Speed</p>
              <p className="text-xs text-muted-foreground mt-1">Performance tested</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors">
              <i className="bi bi-plug text-primary text-3xl mb-3"></i>
              <p className="text-sm font-medium">Port Function</p>
              <p className="text-xs text-muted-foreground mt-1">All ports verified</p>
            </div>
          </div>
        </div>

        {/* SECTION 7: TEAM */}
<div className="mb-20">
  <div className="text-center mb-12">
    <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
      <i className="bi bi-people-fill mr-2"></i>
      Who We Are
    </span>
    <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Founders</h2>
    <p className="text-muted-foreground max-w-xl mx-auto">
      Real people with real stakes in doing this right.
    </p>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
    {/* Team Member 1 */}
    <div className="group">
      <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200">
        <img 
          src="/src/assets/team/team1.jpg" 
          alt="Alex Johnson" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold mb-1">Abubakar-Sadieq Abdulazeez</h3>
        {/* <p className="text-sm text-muted-foreground mb-3">Founder & CEO</p> */}
        <p className="text-sm italic text-primary">
          "I have the connections and know the products."
        </p>
      </div>
    </div>

    {/* Team Member 2 */}
    <div className="group">
      <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200">
        <img 
          src="/src/assets/team/team2.jpg" 
          alt="Maria Garcia" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold mb-1">Abduljalal Muhammad</h3>
        {/* <p className="text-sm text-muted-foreground mb-3">Quality Control Lead</p> */}
        <p className="text-sm italic text-primary">
          "My job is to catch what dishonest sellers hide."
        </p>
      </div>
    </div>

    {/* Team Member 3 */}
    <div className="group">
      <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200">
        <img 
          src="/src/assets/team/team3.jpg" 
          alt="David Chen" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold mb-1">Mohammad (Sani) Bello</h3>
        {/* <p className="text-sm text-muted-foreground mb-3">Operations Manager</p> */}
        <p className="text-sm italic text-primary">
          "I am your typical tech. guy."
        </p>
      </div>
    </div>
  </div>
</div>

        {/* SECTION 8: FINAL CTA */}
        <div className="text-center p-10 rounded-xl border-2 border-primary/30 bg-card/50">
          <h2 className="text-3xl font-bold mb-3">Ready to Buy Tech Without the Fear?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join customers who've discovered what honest selling looks like. No games. No tricks. Just quality devices and real transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary px-8 py-3">
              Browse Products
            </Link>
            <a 
              href="https://wa.me/2348012345678" 
              className="inline-flex items-center justify-center px-8 py-3 font-medium rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
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
