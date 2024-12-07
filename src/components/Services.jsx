import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TruckIcon, ShieldCheckIcon, CreditCardIcon, ClockIcon } from '@heroicons/react/24/outline';

const services = [
  {
    icon: TruckIcon,
    title: "Fast delivery",
    description: "All it takes is 3 to 5 business days"
  },
  {
    icon: ShieldCheckIcon,
    title: "Transparency",
    description: "All defects if any will be on the description of a device"
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
    <section id="services" className="py-20 bg-gray-800">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          Our Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`bg-gray-900 p-6 rounded-lg text-center ${index === 3 ? 'md:col-span-3' : ''}`}
            >
              <service.icon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {service.title}
              </h3>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Services;
