import React from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaBolt, FaUmbrella, FaUserTie } from 'react-icons/fa';

const ParkingLocationCard = ({ location, onSelect, isSelected, onBookNow }) => {
  const getFacilityIcon = (facility) => {
    switch (facility.toLowerCase()) {
      case 'ev charging':
        return <FaBolt className="text-yellow-500" />;
      case 'covered parking':
        return <FaUmbrella className="text-blue-500" />;
      case 'valet':
        return <FaUserTie className="text-purple-500" />;
      default:
        return <FaCar className="text-gray-500" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(location)}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 mb-3 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{location.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-1">{location.price}</p>
      <div className="flex items-center mb-1">
        <FaCar className="text-gray-500 mr-2" />
        <span className="text-xs text-gray-600 dark:text-gray-400">2.5 km from city center</span>
      </div>
      <div className="flex flex-wrap mb-2">
        {location.facilities.map((facility, index) => (
          <div key={index} className="flex items-center mr-2 mb-1">
            {getFacilityIcon(facility)}
            <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">{facility}</span>
          </div>
        ))}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBookNow(location);
        }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
      >
        Book Now
      </button>
    </motion.div>
  );
};

export default ParkingLocationCard;
