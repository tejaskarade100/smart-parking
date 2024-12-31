import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaClock, FaCarCrash, FaSmog } from 'react-icons/fa';

const ProblemSection = () => {
  const problems = [
    {
      icon: <FaClock />,
      title: "Time Waste",
      description: "Hours spent searching for parking spots"
    },
    {
      icon: <FaCarCrash />,
      title: "Congestion",
      description: "Increased traffic due to parking searches"
    },
    {
      icon: <FaSmog />,
      title: "Pollution",
      description: "Environmental impact of circling vehicles"
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
    <section className="py-20 bg-gray-50">
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
              className="text-4xl text-red-500"
            >
              <FaExclamationTriangle />
            </motion.div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Current Parking Challenges
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Urban parking has become increasingly problematic, affecting daily life and city efficiency.
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
            <img
              src="/images/parking-infographic.svg"
              alt="Urban Parking Problems Illustration"
              className="w-full h-auto rounded-lg shadow-2xl"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-transparent rounded-lg"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="text-2xl text-red-500"
                >
                  {problem.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600">
                    {problem.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
