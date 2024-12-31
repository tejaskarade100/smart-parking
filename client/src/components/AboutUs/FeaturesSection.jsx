import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMoneyBillWave, FaShieldAlt, FaClock, FaChartLine, FaBell } from 'react-icons/fa';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaSearch />,
      title: "Smart Search",
      description: "Find available parking spots in real-time",
      color: "blue"
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Easy Payments",
      description: "Secure and contactless payment options",
      color: "green"
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Booking",
      description: "Guaranteed parking spot reservation",
      color: "indigo"
    },
    {
      icon: <FaClock />,
      title: "Time Saving",
      description: "No more circling for parking spots",
      color: "purple"
    },
    {
      icon: <FaChartLine />,
      title: "Analytics",
      description: "Track your parking history and expenses",
      color: "red"
    },
    {
      icon: <FaBell />,
      title: "Notifications",
      description: "Get alerts for booking and expiry",
      color: "yellow"
    }
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for a seamless parking experience
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`text-4xl text-${feature.color}-500 mb-6 transform transition-transform group-hover:rotate-12`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
