import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <motion.div 
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MainContent />
      </motion.div>
    </div>
  );
};

export default Dashboard;
