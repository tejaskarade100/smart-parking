import React from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, Settings, LogOut, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, text: 'Dashboard', path: '/admin/dashboard' },
    { icon: FileText, text: 'Bookings', path: '/admin/bookings' },
    { icon: Plus, text: 'Offline Booking', path: '/admin/offline-booking' },
    { icon: Settings, text: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="bg-white h-screen w-64 fixed left-0 shadow-lg pt-20"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index}>
              <motion.div
                className={`flex items-center space-x-3 px-6 py-3 cursor-pointer transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                whileHover={{ x: 5 }}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          className="px-6 py-4 border-t"
          whileHover={{ x: 5 }}
        >
          <button
            onClick={logout}
            className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
