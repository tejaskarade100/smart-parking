import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-wrap justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <h4 className="text-xl font-semibold mb-2">Contact Us</h4>
            <p>Email: info@parkingcategories.com</p>
            <p>Phone: +91 123-456-7890</p>
          </div>
          <div className="w-full md:w-1/2">
            <h4 className="text-xl font-semibold mb-2">Additional Resources</h4>
            <ul>
              <li><a href="#" className="hover:text-blue-400">Parking Guide</a></li>
              <li><a href="#" className="hover:text-blue-400">Parking Apps</a></li>
              <li><a href="#" className="hover:text-blue-400">Partnership Opportunities</a></li>
            </ul>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

