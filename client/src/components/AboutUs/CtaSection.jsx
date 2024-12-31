import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaParking } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: -100,
              y: Math.random() * 100,
              scale: 0.5,
              opacity: 0.3
            }}
            animate={{
              x: '120vw',
              y: Math.random() * 100,
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
          >
            <FaParking className="text-white/10 text-6xl" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Parking Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of satisfied users who have already made the smart switch to ParkEase.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/signup">
              <motion.button
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started Now</span>
                <motion.div
                  className="inline-block"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <FaArrowRight />
                </motion.div>
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-12 text-blue-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-sm">
              No credit card required • Free trial available • Cancel anytime
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
