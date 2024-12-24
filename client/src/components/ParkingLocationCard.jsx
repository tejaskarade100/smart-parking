import React from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, Umbrella, UserCheck, MapPin, DollarSign } from 'lucide-react';

const ParkingLocationCard = ({ location, onSelect, isSelected, onBookNow }) => {
  const getFacilityIcon = (facility) => {
    switch (facility.toLowerCase()) {
      case 'ev charging':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'covered parking':
        return <Umbrella className="w-4 h-4 text-blue-500" />;
      case 'valet':
        return <UserCheck className="w-4 h-4 text-purple-500" />;
      default:
        return <Car className="w-4 h-4 text-gray-500" />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    hover: { 
      scale: 1.03,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onClick={() => onSelect(location)}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{location.name}</h3>
        <motion.div 
          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {location.price}
        </motion.div>
      </div>
      <div className="flex items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
        <MapPin className="w-4 h-4 mr-1 text-gray-500" />
        <span>2.5 km from city center</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {location.facilities.map((facility, index) => (
          <motion.div 
            key={index} 
            className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1"
            whileHover={{ scale: 1.05 }}
          >
            {getFacilityIcon(facility)}
            <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">{facility}</span>
          </motion.div>
        ))}
      </div>
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onBookNow(location);
        }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* <DollarSign className="w-4 h-4 mr-2" /> */}
        Book Now
      </motion.button>
    </motion.div>
  );
};

export default ParkingLocationCard;

