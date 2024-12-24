import React from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, RefreshCw, ClipboardList, Settings } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard' },
  { icon: MapPin, label: 'Design Parking' },
  { icon: RefreshCw, label: 'Update Details' },
  { icon: ClipboardList, label: 'Booking History' },
  { icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  return (
    <motion.aside 
      className="w-64 bg-blue-600 text-white p-6"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="flex items-center mb-8">
        <motion.div
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h.01" />
            <path d="M17 7h.01" />
            <path d="M7 17h.01" />
            <path d="M17 17h.01" />
          </svg>
        </motion.div>
        <h1 className="text-2xl font-bold">ParkEase</h1>
      </div>
      <nav>
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <motion.li 
              key={item.label}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="#" className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200">
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
