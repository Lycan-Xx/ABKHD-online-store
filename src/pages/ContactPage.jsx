import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'

const ContactPage = () => {
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    addToast('Message sent successfully! We\'ll get back to you soon.', 'success')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors mr-4"
          >
            <i className="bi bi-arrow-left-short text-xl mr-1"></i>
            <span className="text-sm">Home</span>
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or need assistance? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information - Minimal Design */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <i className="bi bi-geo-alt text-primary text-xl mt-1 flex-shrink-0"></i>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground text-sm">
                      Jimeta, Yola<br />
                      Adamawa State<br />
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <i className="bi bi-whatsapp text-primary text-xl mt-1 flex-shrink-0"></i>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <p className="text-muted-foreground text-sm">
                      <a href="https://wa.me/2348012345678" className="text-primary hover:underline">
                        +234 801 234 5678
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Best way to reach us</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <i className="bi bi-envelope text-primary text-xl mt-1 flex-shrink-0"></i>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm">
                      <a href="mailto:hello@abkhdstore.com" className="text-primary hover:underline">
                        hello@abkhdstore.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <i className="bi bi-clock text-primary text-xl mt-1 flex-shrink-0"></i>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-muted-foreground text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media - Minimal Design */}
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            {/* Response Time Badge */}
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <i className="bi bi-lightning-charge-fill text-primary text-lg mt-0.5"></i>
              <div>
                <p className="text-sm font-medium">Quick Response Time</p>
                <p className="text-xs text-muted-foreground mt-1">
                  We typically respond within 2 hours during business hours
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full p-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-vertical"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="bi bi-arrow-clockwise animate-spin mr-2"></i>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="bi bi-send mr-2"></i>
                    Send Message
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section - Condensed */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Quick Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-start">
                <i className="bi bi-question-circle text-primary mr-2 mt-1 flex-shrink-0"></i>
                <span>What are your shipping options?</span>
              </h3>
              <p className="text-muted-foreground text-sm pl-7">
                Free delivery in Jimeta & Yola. Other locations available at competitive rates.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-start">
                <i className="bi bi-question-circle text-primary mr-2 mt-1 flex-shrink-0"></i>
                <span>What is your return policy?</span>
              </h3>
              <p className="text-muted-foreground text-sm pl-7">
                7-day return guarantee. Items must be in original condition.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-start">
                <i className="bi bi-question-circle text-primary mr-2 mt-1 flex-shrink-0"></i>
                <span>Do you offer warranties?</span>
              </h3>
              <p className="text-muted-foreground text-sm pl-7">
                Yes, all devices come with our quality guarantee and testing certification.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-start">
                <i className="bi bi-question-circle text-primary mr-2 mt-1 flex-shrink-0"></i>
                <span>How can I track my order?</span>
              </h3>
              <p className="text-muted-foreground text-sm pl-7">
                We'll send you tracking information via WhatsApp or email once your order ships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage