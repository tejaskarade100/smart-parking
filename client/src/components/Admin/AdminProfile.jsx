import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, X, Mail, MapPin, Building, Phone, User, Briefcase, Hash, Home,
  Car, Bike, Calendar, Clock, CreditCard, Settings
} from 'lucide-react';

const AdminProfile = ({ onClose }) => {
  const { logout } = useAuth();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'A';
  };

  const profileSections = [
    {
      title: 'Personal Information',
      icon: User,
      color: 'bg-blue-500',
      fields: [
        { label: 'Full Name', value: user?.fullName, icon: User, color: 'text-blue-500' },
        { label: 'Email', value: user?.email, icon: Mail, color: 'text-purple-500' },
        { label: 'Phone', value: user?.phone, icon: Phone, color: 'text-green-500' },
        { label: 'Address', value: user?.address, icon: Home, color: 'text-orange-500' },
        { label: 'City', value: user?.city, icon: Building, color: 'text-cyan-500' },
        { label: 'State', value: user?.state, icon: MapPin, color: 'text-pink-500' },
        { label: 'ZIP Code', value: user?.zipCode, icon: Hash, color: 'text-indigo-500' }
      ]
    },
    {
      title: 'Parking Information',
      icon: Car,
      color: 'bg-green-500',
      fields: [
        { label: 'Parking Name', value: user?.parkingName, icon: Building, color: 'text-emerald-500' },
        { label: 'Parking Type', value: user?.parkingType, icon: Briefcase, color: 'text-blue-500' },
        { label: 'Category', value: user?.category, icon: Settings, color: 'text-purple-500' },
        { label: 'Parking Address', value: user?.parkingAddress, icon: MapPin, color: 'text-red-500' },
        { label: 'Total Spaces', value: user?.totalSpaces, icon: Car, color: 'text-orange-500' },
        { label: 'Two Wheeler Spaces', value: user?.twoWheelerSpaces, icon: Bike, color: 'text-teal-500' },
        { label: 'Four Wheeler Spaces', value: user?.fourWheelerSpaces, icon: Car, color: 'text-indigo-500' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative"
      >
        {/* Header with Avatar */}
        <div className="relative h-20 bg-gradient-to-r from-gray-900 to-gray-700 px-6 flex items-center">
          <div className="absolute -bottom-10 flex items-end space-x-4">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{getInitials(user?.fullName)}</span>
              </div>
            </div>
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white">{user?.fullName || 'Admin'}</h2>
              <p className="text-gray-300">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition-colors hover:bg-red-50 p-1 rounded-full bg-white/90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-16 space-y-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
          {profileSections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className={`px-4 py-3 flex items-center space-x-2 ${section.color} text-white`}>
                <section.icon className="w-5 h-5" />
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <div className="p-4 grid gap-4 md:grid-cols-2">
                {section.fields.map((field, fieldIndex) => (
                  field.value && (
                    <motion.div
                      key={fieldIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (fieldIndex * 0.05) }}
                      className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <field.icon className={`w-5 h-5 ${field.color} mt-1`} />
                      <div className="flex-1 min-w-0">
                        <label className="text-sm text-gray-600">{field.label}</label>
                        <p className="font-medium text-gray-800 break-words">{field.value}</p>
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 px-4 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;
