import React from 'react';
import { motion } from 'framer-motion';

const cardColors = [
  { 
    bg: 'bg-gradient-to-br from-white to-blue-50', 
    icon: 'text-blue-500',
    text: 'text-gray-800',
    border: 'border-blue-100',
    shadow: 'shadow-blue-100/50',
    button: 'bg-blue-500 hover:bg-blue-600'
  },
  { 
    bg: 'bg-gradient-to-br from-white to-indigo-50', 
    icon: 'text-indigo-500',
    text: 'text-gray-800',
    border: 'border-indigo-100',
    shadow: 'shadow-indigo-100/50',
    button: 'bg-indigo-500 hover:bg-indigo-600'
  },
  { 
    bg: 'bg-gradient-to-br from-white to-sky-50', 
    icon: 'text-sky-500',
    text: 'text-gray-800',
    border: 'border-sky-100',
    shadow: 'shadow-sky-100/50',
    button: 'bg-sky-500 hover:bg-sky-600'
  },
  { 
    bg: 'bg-gradient-to-br from-white to-teal-50', 
    icon: 'text-teal-500',
    text: 'text-gray-800',
    border: 'border-teal-100',
    shadow: 'shadow-teal-100/50',
    button: 'bg-teal-500 hover:bg-teal-600'
  },
  { 
    bg: 'bg-gradient-to-br from-white to-cyan-50', 
    icon: 'text-cyan-500',
    text: 'text-gray-800',
    border: 'border-cyan-100',
    shadow: 'shadow-cyan-100/50',
    button: 'bg-cyan-500 hover:bg-cyan-600'
  },
  { 
    bg: 'bg-gradient-to-br from-white to-blue-50', 
    icon: 'text-blue-500',
    text: 'text-gray-800',
    border: 'border-blue-100',
    shadow: 'shadow-blue-100/50',
    button: 'bg-blue-500 hover:bg-blue-600'
  },
];

const CategoryCard = ({ category, onLearnMore, index }) => {
  const colorScheme = cardColors[index % cardColors.length];

  return (
    <motion.div 
      className={`rounded-2xl border ${colorScheme.border} ${colorScheme.bg} ${colorScheme.shadow} 
                  overflow-hidden transform transition-all duration-300 hover:scale-102 shadow-lg`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="p-8">
        <motion.div 
          className="flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-white 
                          shadow-md ${colorScheme.icon}`}>
            <category.icon className="w-8 h-8" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          className="space-y-4"
        >
          <h3 className={`text-xl font-semibold ${colorScheme.text} text-center`}>
            {category.title}
          </h3>
          <p className="text-gray-600 text-center text-sm leading-relaxed">
            {category.description}
          </p>
          <div className="flex justify-center pt-2">
            <motion.button
              onClick={onLearnMore}
              className={`px-6 py-2 ${colorScheme.button} text-white rounded-lg font-medium 
                         transition-all duration-300 flex items-center space-x-2
                         shadow-sm hover:shadow-md`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Learn More</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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
