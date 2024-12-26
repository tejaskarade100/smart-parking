import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DetailModal = ({ category, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg max-w-2xl w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">{category.title}</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{category.fullDescription}</p>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Examples:</h4>
              <p>{category.examples}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Features:</h4>
              <ul className="list-disc pl-5">
                {category.keyFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailModal;
