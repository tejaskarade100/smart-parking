import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaLeaf, FaCogs, FaUsers } from 'react-icons/fa';

const VisionSection = () => {
  const visionPoints = [
    {
      icon: <FaRocket />,
      title: "Innovation",
      description: "Leading the future of smart urban mobility"
    },
    {
      icon: <FaLeaf />,
      title: "Sustainability",
      description: "Reducing emissions through efficient parking"
    },
    {
      icon: <FaCogs />,
      title: "Smart Technology",
      description: "Leveraging IoT and AI for better parking"
    },
    {
      icon: <FaUsers />,
      title: "Community",
      description: "Building better cities together"
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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Vision for the Future
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Creating smarter, more sustainable cities through innovative parking solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
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
                src="/images/smart-city.svg"
                alt="Future of Smart Parking"
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent"></div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {visionPoints.map((point, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="text-3xl text-purple-500 mb-4"
                >
                  {point.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {point.title}
                </h3>
                <p className="text-gray-600">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
