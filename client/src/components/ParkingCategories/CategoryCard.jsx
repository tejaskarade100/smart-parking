import React from 'react';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, onLearnMore, index }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <category.icon className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
        <p className="text-gray-600 mb-4">{category.description}</p>
        <button
          onClick={onLearnMore}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Learn More
        </button>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
