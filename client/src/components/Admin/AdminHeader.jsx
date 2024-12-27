import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, User } from 'lucide-react';
import AdminProfile from './AdminProfile';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = () => {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo and Name */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Car className="text-blue-600 w-8 h-8" />
            <span className="text-blue-600 font-bold text-2xl">PARK</span>
            <span className="font-bold text-2xl">EASE</span>
          </motion.div>

          {/* Admin Title */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-semibold text-gray-700">ADMIN DASHBOARD</h1>
          </div>

          {/* Profile Button */}
          <motion.button
            onClick={() => setShowProfile(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-gray-700 font-medium">{user?.fullName || 'Admin'}</span>
            <User className="w-6 h-6 text-gray-700" />
          </motion.button>
        </div>
      </motion.header>

      {/* Admin Profile Modal */}
      {showProfile && (
        <AdminProfile onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default AdminHeader;
