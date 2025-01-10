import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers."
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping typically takes 3-5 business days within the continental US."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unused items in original packaging."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs vary by location."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="py-20 bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className="text-white font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDownIcon className="h-5 w-5 text-yellow-400" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-400">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;