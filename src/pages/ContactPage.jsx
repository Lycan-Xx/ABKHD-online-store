import React, { useState } from 'react'
import BackButton from '../components/ui/BackButton'
import Breadcrumb from '../components/ui/Breadcrumb'
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
  const [showForm, setShowForm] = useState(false)

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
    <div className="container py-8 md:py-12">
      {/* Navigation */}
      <div className="mb-12">
        <Breadcrumb className="mb-4" />
        <BackButton to="/" text="Back to Home" variant="prominent" />
      </div>
      
      {/* Content Container */}
      <div className="max-w-6xl mx-auto">
        {/* Header - Minimal */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Questions about a product? Need help? We're here.
          </p>
        </div>

        {/* Primary Contact - WhatsApp Hero */}
        <div className="mb-16 max-w-2xl mx-auto">
          <div className="text-center p-10 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <i className="bi bi-whatsapp text-primary text-4xl"></i>
            </div>
            <h2 className="text-2xl font-bold mb-3">Chat with us on WhatsApp</h2>
            <p className="text-muted-foreground mb-6">
              The fastest way to get answers. We typically respond within minutes.
            </p>
            <a 
              href="https://wa.me/2348012345678" 
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <i className="bi bi-whatsapp mr-2 text-xl"></i>
              Start Conversation
            </a>
          </div>
        </div>

        {/* Alternative Contact Methods */}
        <div className="mb-16 max-w-2xl mx-auto">
          <h3 className="text-sm font-medium text-muted-foreground text-center mb-6">
            Or reach us via
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="mailto:hello@abkhdstore.com"
              className="flex items-center space-x-4 p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <i className="bi bi-envelope text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">hello@abkhdstore.com</p>
              </div>
            </a>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-4 p-6 rounded-xl border border-border bg-card/50 hover:border-primary transition-colors group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <i className="bi bi-pencil-square text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Contact Form</h3>
                <p className="text-sm text-muted-foreground">Send us a message</p>
              </div>
            </button>
          </div>
        </div>

        {/* Contact Form - Collapsible */}
        {showForm && (
          <div className="mb-16 p-8 rounded-xl border border-border bg-card/50 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Send us a Message</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
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
                  Subject
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
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full p-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-vertical"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
        )}

        {/* Response Time Note */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground">
            <i className="bi bi-clock text-primary mr-2"></i>
            We typically respond within 2 hours during business hours
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
