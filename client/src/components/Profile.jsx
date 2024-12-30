import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Mail, User, X, Car, Clock, Plus, Trash2, ChevronRight, Calendar, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Profile = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    makeModel: '',
    licensePlate: '',
    state: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin and redirect to admin dashboard
    if (user?.role === 'admin') {
      onClose(); // Close the profile modal
      navigate('/admin/dashboard'); // Redirect to admin dashboard
      return;
    }

    fetchVehicles();
    fetchBookings();
  }, [user, navigate, onClose]);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/user/vehicles');
      console.log('Fetched vehicles:', response.data);
      setVehicles(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching vehicles:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to load vehicles');
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/user/bookings');
      console.log('Fetched bookings:', response.data);
      
      // Process bookings to add status based on end time
      const processedBookings = response.data.map(booking => {
        // Get the end time from either endDateTime or calculate from date and duration
        let endTime;
        if (booking.endDateTime) {
          endTime = new Date(booking.endDateTime);
        } else if (booking.date && booking.duration) {
          // If we have date and duration, calculate end time
          endTime = new Date(booking.date);
          endTime.setHours(endTime.getHours() + booking.duration);
        } else {
          // If no end time info, default to active
          return { ...booking, status: 'Active' };
        }

        const now = new Date();
        console.log('Booking end time:', endTime);
        console.log('Current time:', now);
        const status = endTime < now ? 'Completed' : 'Active';
        console.log('Calculated status:', status);
        
        return { ...booking, status };
      });
      
      console.log('Processed bookings:', processedBookings);
      setBookings(processedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate input
    if (!newVehicle.makeModel.trim()) {
      setError('Please enter make and model');
      setIsLoading(false);
      return;
    }
    if (!newVehicle.licensePlate.trim()) {
      setError('Please enter license plate number');
      setIsLoading(false);
      return;
    }
    if (!newVehicle.state.trim()) {
      setError('Please enter state');
      setIsLoading(false);
      return;
    }

    // Format data
    const vehicleData = {
      makeModel: newVehicle.makeModel.trim(),
      licensePlate: newVehicle.licensePlate.trim().toUpperCase(),
      state: newVehicle.state.trim().toUpperCase()
    };

    console.log('Sending vehicle data:', vehicleData);

    try {
      const response = await api.post('/user/vehicles', vehicleData);
      console.log('Vehicle added successfully:', response.data);
      
      // Update vehicles list with new vehicle
      setVehicles(prevVehicles => [...prevVehicles, response.data]);
      
      // Reset form
      setNewVehicle({ makeModel: '', licensePlate: '', state: '' });
      setShowAddVehicle(false);
      setError('');
    } catch (error) {
      console.error('Error adding vehicle:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await api.delete(`/api/user/vehicles/${vehicleId}`);
      setVehicles(vehicles.filter(vehicle => vehicle._id !== vehicleId));
      setError('');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setError(error.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/', { replace: true }); // Use replace to prevent going back to the login page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Car className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vehicles</p>
                <p className="text-xl font-semibold text-gray-800">{vehicles.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Clock className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bookings</p>
                <p className="text-xl font-semibold text-gray-800">{bookings.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Quick Actions</h3>
        <div className="grid gap-4">
          <button
            onClick={() => setActiveTab('vehicles')}
            className="flex items-center justify-between w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="text-blue-600" size={24} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Manage Vehicles</p>
                <p className="text-sm text-gray-500">{vehicles.length} vehicles registered</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>

          <button
            onClick={() => setShowBookings(!showBookings)}
            className="flex items-center justify-between w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">View Bookings</p>
                <p className="text-sm text-gray-500">{bookings.length} total bookings</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderVehiclesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Your Vehicles</h3>
        <button
          onClick={() => setActiveTab('profile')}
          className="text-blue-600 hover:text-blue-700"
        >
          Back to Profile
        </button>
      </div>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle._id} 
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Car className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{vehicle.makeModel}</p>
                  <p className="text-sm text-gray-500">{vehicle.licensePlate} • {vehicle.state}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteVehicle(vehicle._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {showAddVehicle ? (
          <form onSubmit={handleAddVehicle} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Vehicle</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make & Model</label>
                <input
                  type="text"
                  value={newVehicle.makeModel}
                  onChange={(e) => setNewVehicle({ ...newVehicle, makeModel: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Toyota Camry"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                <input
                  type="text"
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ABC123"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={newVehicle.state}
                  onChange={(e) => setNewVehicle({ ...newVehicle, state: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., CA"
                  maxLength="2"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Adding...' : 'Add Vehicle'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddVehicle(false);
                  setNewVehicle({ makeModel: '', licensePlate: '', state: '' });
                  setError('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mt-4">
                {error}
              </div>
            )}
          </form>
        ) : (
          <button
            onClick={() => setShowAddVehicle(true)}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
          >
            <Plus size={20} />
            <span>Add New Vehicle</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl min-h-[80vh] max-h-[90vh] flex flex-col relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' ? renderProfileTab() : renderVehiclesTab()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bookings Slide-up Panel */}
        <AnimatePresence>
          {showBookings && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-white rounded-2xl shadow-2xl"
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Your Bookings</h3>
                <button
                  onClick={() => setShowBookings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-2">{error}</div>
                    <button
                      onClick={fetchBookings}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Try Again
                    </button>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No bookings yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg text-gray-800">
                                {booking.location.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Booking Ref: {booking.bookingReference}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                booking.status === 'Active'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                              <Calendar className="text-gray-400" size={20} />
                              <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="text-gray-700">{new Date(booking.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Clock className="text-gray-400" size={20} />
                              <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="text-gray-700">{booking.duration} hour(s)</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Car className="text-gray-400" size={20} />
                              <div>
                                <p className="text-sm text-gray-500">Vehicle</p>
                                <p className="text-gray-700">{booking.vehicle.makeModel}</p>
                                <p className="text-sm text-gray-500">{booking.vehicle.licensePlate}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <MapPin className="text-gray-400" size={20} />
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="text-gray-700">{booking.location.address}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="text-green-500" size={20} />
                              <span className="text-lg font-semibold text-green-600">
                                ₹{booking.total.toFixed(2)}
                              </span>
                            </div>
                            {booking.status === 'Active' && (
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Profile;