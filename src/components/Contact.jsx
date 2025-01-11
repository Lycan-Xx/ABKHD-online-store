<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
=======
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
>>>>>>> merge-test
  faTiktok,
  faYoutube,
  faTwitter,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
<<<<<<< HEAD
import { BUSINESS_HOURS, SOCIAL_MEDIA } from '../utils/constants';
import { getSettings } from '../services/settings';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

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

    const date = new Date("2025-01-10T14:13:55+01:00");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);
    const currentTime = `${day} ${month} ${year} at ${hour}:${minutes}:${seconds}`;
    
    const subject = "ABKHD Contact Form";
    const body = [
      "",
      `Name: ${formData.name}\n`,
      formData.phone ? `Contact Number: ${formData.phone}\n` : "",
      "",
      `Message: ${formData.message} \n`,
      "",
      `Sent on: ${currentTime}\n`,
    ].filter(Boolean).join("\n");

    window.location.href = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
=======

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <footer id="contact" className="bg-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
>>>>>>> merge-test
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-400 mb-2">
<<<<<<< HEAD
                  Name <span className="text-red-500">*</span>
=======
                  Name
>>>>>>> merge-test
                </label>
                <input
                  type="text"
                  id="name"
<<<<<<< HEAD
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
=======
>>>>>>> merge-test
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
<<<<<<< HEAD
                <label htmlFor="phone" className="block text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
=======
                <label htmlFor="email" className="block text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
>>>>>>> merge-test
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-400 mb-2">
<<<<<<< HEAD
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
=======
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows="4"
>>>>>>> merge-test
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                ></textarea>
              </div>

              <button
                type="submit"
<<<<<<< HEAD
                disabled={!settings?.contactEmail || !formData.name || !formData.message}
                className={`w-full bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors ${
                  (!settings?.contactEmail || !formData.name || !formData.message)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-yellow-500'
                }`}
=======
                className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
>>>>>>> merge-test
              >
                Send Message
              </button>
            </form>
          </motion.div>

<<<<<<< HEAD
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
=======
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
>>>>>>> merge-test
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Business Hours
              </h3>
<<<<<<< HEAD
              <div className="space-y-2">
                <p className="text-gray-400">Monday - Friday: {BUSINESS_HOURS.weekdays}</p>
                <p className="text-gray-400">Saturday: {BUSINESS_HOURS.saturday}</p>
                <p className="text-gray-400">Sunday: {BUSINESS_HOURS.sunday}</p>
              </div>
            </div>

            {/* Social Media Links */}
=======
              <p className="text-gray-400">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>

>>>>>>> merge-test
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
<<<<<<< HEAD
                  href={SOCIAL_MEDIA.facebook}
=======
                  href="https://www.facebook.com"
>>>>>>> merge-test
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
<<<<<<< HEAD
                  <FontAwesomeIcon icon={faFacebookF} size="2x" />
                </a>
                <a
                  href={SOCIAL_MEDIA.youtube}
=======
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faTiktok} size="2x" />
                </a>
                <a
                  href="https://www.youtube.com"
>>>>>>> merge-test
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faYoutube} size="2x" />
                </a>
                <a
<<<<<<< HEAD
                  href={SOCIAL_MEDIA.twitter}
=======
                  href="https://www.twitter.com"
>>>>>>> merge-test
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
                <a
<<<<<<< HEAD
                  href={SOCIAL_MEDIA.instagram}
=======
                  href="https://www.instagram.com"
>>>>>>> merge-test
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Centered Copyright */}
        <div className="mt-12">
          <p className="text-center text-gray-300 font-mono">
<<<<<<< HEAD
            2024 ABKHD. All rights reserved.
          </p>
        </div>
      </div>
    </section>
=======
            © 2024 ABKHD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
>>>>>>> merge-test
  );
};

export default Contact;
