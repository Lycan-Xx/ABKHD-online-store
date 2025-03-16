import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaYoutube, FaTwitter, FaInstagram, FaTiktok, FaPhone, FaClock, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { BUSINESS_HOURS, SOCIAL_MEDIA } from '../utils/constants';
import { getSettings } from '../services/settings';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!settings?.contactEmail || !formData.name || !formData.message) return;

    setIsSubmitting(true);

    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentTime = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} at ${date.getHours()}:${`0${date.getMinutes()}`.slice(-2)}:${`0${date.getSeconds()}`.slice(-2)}`;

    const subject = "TechRevival Contact Form";
    const body = [
      `Name: ${formData.name}`,
      formData.phone ? `Contact Number: ${formData.phone}` : "",
      `Message: ${formData.message}`,
      `Sent on: ${currentTime}`,
    ].filter(Boolean).join("\n\n");

    setTimeout(() => {
      window.location.href = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setIsSubmitting(false);
    }, 500);
  };

  const socialIcons = {
    facebook: FaFacebookF,
    youtube: FaYoutube,
    twitter: FaTwitter,
    instagram: FaInstagram,
    tiktok: FaTiktok
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 border border-teal-500 text-teal-400 text-sm tracking-wider mb-4">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-white">
            We'd Love to <span className="text-teal-400 font-normal">Hear From You</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-gray-900/30 p-8 rounded-xl border border-gray-800 shadow-xl"
          >
            <h3 className="text-xl font-normal text-white mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 text-white rounded-md px-4 py-3 border border-gray-700"
                  placeholder="Your name"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white rounded-md px-4 py-3 border border-gray-700"
                  placeholder="Your phone number (optional)"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  className="w-full bg-gray-800 text-white rounded-md px-4 py-3 border border-gray-700 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!settings?.contactEmail || !formData.name || !formData.message || isSubmitting}
                className="w-full bg-teal-600 text-white py-3 px-6 rounded-md flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <FaPaperPlane className={isSubmitting ? "animate-pulse" : ""} />
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
              <div className="flex items-start space-x-4 mb-6">
                <FaClock className="text-teal-400 text-2xl" />
                <div>
                  <h3 className="text-lg font-normal text-white">Business Hours</h3>
                  <p className="text-gray-400">Monday - Friday: {BUSINESS_HOURS.weekdays}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <FaMapMarkerAlt className="text-teal-400 text-2xl" />
                <div>
                  <h3 className="text-lg font-normal text-white">Location</h3>
                  <p className="text-gray-400">YOLA / JIMETA, Adamawa State</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
              <h3 className="text-lg font-normal text-white mb-4">Connect With Us</h3>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(SOCIAL_MEDIA).map(([platform, url]) => {
                  const IconComponent = socialIcons[platform];
                  return IconComponent ? (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                      <IconComponent className="text-gray-400 text-2xl hover:text-teal-400" />
                    </a>
                  ) : null;
                })}
              </div>
              <div className="mt-6">
                <a href={`tel:${settings?.contactPhone || ''}`} className="flex items-center space-x-3">
                  <FaPhone className="text-teal-400 text-lg" />
                  <span className="text-gray-400">{settings?.contactPhone || 'Contact us by phone'}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
