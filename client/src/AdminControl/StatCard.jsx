import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, details }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      whileHover={{ y: -5, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold mb-2">{value}</p>
      {details.map((detail, index) => (
        <p key={index} className="text-sm text-gray-600">
          {detail.label}: <span className="font-semibold">{detail.value}</span>
        </p>
      ))}
    </motion.div>
  );
};

export default StatCard;
