import React from 'react';
import { motion } from 'framer-motion';
import { FaParking, FaCar, FaCity } from 'react-icons/fa';

const HeroSection = () => {
  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    hover: { scale: 1.2, rotate: 15 }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/cityscape.svg"
          alt="Cityscape with parking lots"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-800/70 to-blue-700/60"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 space-y-8">
        <div className="flex justify-center space-x-8 mb-8">
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl text-blue-400"
          >
            <FaParking />
          </motion.div>
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl text-blue-300"
          >
            <FaCar />
          </motion.div>
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-4xl text-blue-200"
          >
            <FaCity />
          </motion.div>
        </div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white"
        >
          Transforming Urban Parking
          <br />
          for a Smarter Future
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
        >
          Experience the future of parking with our innovative smart parking solutions.
          Say goodbye to parking hassles and hello to convenience.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors duration-300"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-blue-900 to-transparent"
      />
    </section>
  );
};

export default HeroSection;
