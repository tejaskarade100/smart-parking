import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Umbrella, 
  Shield, 
  Sun, 
  Phone, 
  Key, 
  Check,
  MapPin, 
  Clock, 
  Tag, 
  Car,
  Camera,
  AlertTriangle,
  Users,
  Fingerprint,
  Lock,
  Bell
} from 'lucide-react';
import api from '../api/axios';

const ParkingLocationCard = ({ location, onSelect, isSelected, onBookNow }) => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (location.adminId) {
          const response = await api.get(`/admin/${location.adminId}`);
          setAdminData(response.data);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, [location.adminId]);

  const getFacilityIcon = (facility) => {
    const facilityLower = facility.toLowerCase();
    switch (facilityLower) {
      case 'covered parking':
        return <Umbrella className="w-4 h-4 text-blue-500" />;
      case '24/7 security':
      case 'security guard':
      case 'emergency-response':  
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'lighting':
      case 'proper lighting':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'emergency contact':
      case 'emergency support':
        return <Phone className="w-4 h-4 text-red-500" />;
      case 'access-control':
      case 'controlled access':
        return <Key className="w-4 h-4 text-purple-500" />;
      case 'cctv':
      case 'surveillance cameras':
      case 'security cameras':
        return <Camera className="w-4 h-4 text-indigo-500" />;
      case 'security personnel':
      case 'security staff':
      case 'guards':  
        return <Users className="w-4 h-4 text-teal-500" />;
      case 'biometric access':
      case 'fingerprint access':
        return <Fingerprint className="w-4 h-4 text-rose-500" />;
      case 'gated entry':
      case 'secure gates':
        return <Lock className="w-4 h-4 text-amber-500" />;
      case 'alarm system':
      case 'security alarms':
        return <Bell className="w-4 h-4 text-orange-500" />;
      case 'emergency exits':
      case 'emergency routes':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Check className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
        <h3 className="text-xl font-bold mb-1">{location.name}</h3>
        <div className="flex items-center text-blue-100">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location.address}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Access Hours and Category */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center bg-blue-50 dark:bg-gray-700 rounded-lg p-2">
            <Clock className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {adminData?.accessHours || '24/7'}
            </span>
          </div>
          <div className="flex items-center bg-green-50 dark:bg-gray-700 rounded-lg p-2">
            <Car className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {adminData?.category || location.category}
            </span>
          </div>
        </div>

        {/* Pricing and Availability */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Pricing</span>
            <div className="flex items-center">
              <Tag className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-bold">{location.price}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Two Wheeler Rate:</span>
              <span className="font-medium">₹{adminData?.twoWheelerHourlyRate || location.twoWheelerHourlyRate}/hr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Four Wheeler Rate:</span>
              <span className="font-medium">₹{adminData?.fourWheelerHourlyRate || location.fourWheelerHourlyRate}/hr</span>
            </div>
          </div>
        </div>

        {/* Security Measures */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Security & Facilities
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {adminData?.securityMeasures?.map((measure, index) => (
              <motion.div 
                key={index} 
                className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-2"
                whileHover={{ scale: 1.02 }}
              >
                {getFacilityIcon(measure)}
                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                  {measure}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        {adminData?.emergencyContact && (
          <div className="text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-red-500" />
              <span>Emergency: {adminData.emergencyContact}</span>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onBookNow(location);
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ParkingLocationCard;
