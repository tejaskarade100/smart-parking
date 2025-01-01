import React from 'react';
import { motion } from 'framer-motion';

const cardColors = [
  { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', icon: 'text-blue-100', hover: 'hover:from-blue-600 hover:to-blue-700' },
  { bg: 'bg-gradient-to-br from-purple-500 to-purple-600', icon: 'text-purple-100', hover: 'hover:from-purple-600 hover:to-purple-700' },
  { bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', icon: 'text-emerald-100', hover: 'hover:from-emerald-600 hover:to-emerald-700' },
  { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', icon: 'text-orange-100', hover: 'hover:from-orange-600 hover:to-orange-700' },
  { bg: 'bg-gradient-to-br from-pink-500 to-pink-600', icon: 'text-pink-100', hover: 'hover:from-pink-600 hover:to-pink-700' },
  { bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600', icon: 'text-cyan-100', hover: 'hover:from-cyan-600 hover:to-cyan-700' },
];

const CategoryCard = ({ category, onLearnMore, index }) => {
  const colorScheme = cardColors[index % cardColors.length];

  return (
    <motion.div 
      className={`rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${colorScheme.bg} ${colorScheme.hover}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="p-6">
        <motion.div 
          className="flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm ${colorScheme.icon}`}>
            <category.icon className="w-12 h-12" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white mb-3 text-center">{category.title}</h3>
          <p className="text-white/90 mb-6 text-center">{category.description}</p>
          <div className="flex justify-center">
            <motion.button
              onClick={onLearnMore}
              className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium 
                       hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Learn More</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
