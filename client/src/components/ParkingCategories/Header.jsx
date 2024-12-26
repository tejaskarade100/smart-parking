import React from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-6">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Car className="w-10 h-10 mr-4" />
          <h1 className="text-4xl font-bold">Parking Categories Across the Country</h1>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;

