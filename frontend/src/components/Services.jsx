import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TruckIcon, ShieldCheckIcon, CreditCardIcon, ClockIcon } from '@heroicons/react/24/outline';

const services = [
  {
    icon: TruckIcon,
    title: "Fast Delivery",
    description: "All it takes is 3 to 5 business days"
  },
  {
    icon: ShieldCheckIcon,
    title: "Complete Transparency",
    description: "All defects if any will be clearly noted in the device description"
  },
  {
    icon: CreditCardIcon,
    title: "Money Back Guarantee",
    description: "7-days money-back guarantee if the product has not been received"
  },
  {
    icon: ClockIcon,
    title: "Doorstep Delivery",
    description: "Free delivery if you live in YOLA or JIMETA"
  }
];

const Services = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-600 opacity-5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600 opacity-5 blur-3xl"></div>
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 relative z-10"
      >
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 border border-teal-500 text-teal-400 text-sm font-normal tracking-wider mb-4">
            WHY CHOOSE US
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-white">
            Our <span className="text-teal-400 font-normal">Commitment</span> to You
          </h2>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/60 p-8 rounded-xl border border-gray-800 hover:border-teal-900 transition-all duration-300 group"
            >
              <div className="bg-gray-800/80 p-4 rounded-lg inline-flex items-center justify-center mb-6 group-hover:bg-teal-900/30 transition-colors duration-300">
                <service.icon className="h-8 w-8 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
              </div>
              
              <h3 className="text-xl font-normal text-white mb-3 group-hover:text-teal-300 transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-400 font-light leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <a href="#about" className="inline-block py-3 px-8 bg-transparent border border-gray-700 text-gray-300 hover:text-teal-400 hover:border-teal-400 rounded-md transition-all duration-300 font-normal">
            Learn More About Our Process
          </a>
        </motion.div>
      </motion.div>
      
      {/* Bottom subtle divider */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>
    </section>
  );
};

export default Services;