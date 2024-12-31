import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaMobileAlt, FaMapMarkedAlt, FaCreditCard } from 'react-icons/fa';

const SolutionSection = () => {
  const solutions = [
    {
      icon: <FaMobileAlt />,
      title: "Mobile App",
      description: "Book parking spots instantly from your phone"
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Real-time Tracking",
      description: "Live updates on parking availability"
    },
    {
      icon: <FaCreditCard />,
      title: "Easy Payment",
      description: "Secure and contactless payment options"
    }
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-4xl text-yellow-500"
            >
              <FaLightbulb />
            </motion.div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Smart Solutions for Modern Parking
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've revolutionized parking with cutting-edge technology and user-friendly features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="text-2xl text-blue-500"
                >
                  {solution.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {solution.title}
                  </h3>
                  <p className="text-gray-600">
                    {solution.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-lg overflow-hidden shadow-2xl"
            >
              <img
                src="/images/parkease-mockup.png"
                alt="ParkEase App Mockup"
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
