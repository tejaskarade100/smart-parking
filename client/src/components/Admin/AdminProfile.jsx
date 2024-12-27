import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LogOut, X, Mail, MapPin, Building, Phone, User, Briefcase, Hash, Home } from 'lucide-react';

const AdminProfile = ({ onClose }) => {
  const { logout } = useAuth();
  const { user } = useAuth(); // Get user data from AuthContext

  const handleLogout = () => {
    logout();
  };

  const profileSections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', value: user?.fullName, icon: User },
        { label: 'Email', value: user?.email, icon: Mail },
        { label: 'Phone', value: user?.phone, icon: Phone },
        { label: 'Address', value: user?.address, icon: Home },
        { label: 'City', value: user?.city, icon: Building },
        { label: 'State', value: user?.state, icon: MapPin },
        { label: 'ZIP Code', value: user?.zipCode, icon: Hash }
      ]
    },
    {
      title: 'Parking Information',
      fields: [
        { label: 'Parking Name', value: user?.parkingName, icon: Building },
        { label: 'Parking Type', value: user?.parkingType, icon: Briefcase },
        { label: 'Category', value: user?.category, icon: Briefcase },
        { label: 'Parking Address', value: user?.parkingAddress, icon: MapPin },
        { label: 'Total Spaces', value: user?.totalSpaces, icon: Hash },
        { label: 'Two Wheeler Spaces', value: user?.twoWheelerSpaces, icon: Hash },
        { label: 'Four Wheeler Spaces', value: user?.fourWheelerSpaces, icon: Hash }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>

        <div className="space-y-6 mb-6">
          {profileSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.fields.map((field, fieldIndex) => (
                  field.value && (
                    <div key={fieldIndex} className="flex items-start space-x-3">
                      <field.icon className="w-5 h-5 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">{field.label}</label>
                        <p className="font-medium text-gray-800 break-words">{field.value}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;
