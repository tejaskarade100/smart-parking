import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Mail, User, X, Car, Clock, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    makeModel: '',
    licensePlate: '',
    state: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
  }, []);

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
      setBookings(response.data);
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
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="bg-blue-100 p-3 rounded-full">
          <User className="text-blue-600" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user?.name}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="bg-blue-100 p-3 rounded-full">
          <Mail className="text-blue-600" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="bg-blue-100 p-3 rounded-full">
          <Car className="text-blue-600" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Vehicles</p>
          <p className="font-medium">{vehicles.length}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="bg-blue-100 p-3 rounded-full">
          <Clock className="text-blue-600" size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Bookings</p>
          <p className="font-medium">{bookings.length}</p>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('vehicles')}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        <Car size={20} />
        <span>Manage Vehicles</span>
      </button>

      <button
        onClick={() => setActiveTab('bookings')}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        <Clock size={20} />
        <span>View Bookings</span>
      </button>
    </div>
  );

  const renderVehiclesTab = () => (
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <div key={vehicle._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Car className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="font-medium">{vehicle.makeModel}</p>
              <p className="text-sm text-gray-500">{vehicle.licensePlate} • {vehicle.state}</p>
            </div>
          </div>
          <button
            onClick={() => handleDeleteVehicle(vehicle._id)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}

      {showAddVehicle ? (
        <form onSubmit={handleAddVehicle} className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Make & Model</label>
            <input
              type="text"
              value={newVehicle.makeModel}
              onChange={(e) => setNewVehicle({ ...newVehicle, makeModel: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., CA"
              maxLength="2"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
        </form>
      ) : (
        <button
          onClick={() => setShowAddVehicle(true)}
          className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400"
        >
          <Plus size={20} />
          <span>Add Vehicle</span>
        </button>
      )}
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-4">Loading bookings...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-500 text-center py-4">No bookings yet</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {booking.location.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Ref: {booking.bookingReference}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.date).toLocaleDateString()} • {booking.duration} hour(s)
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.vehicle.makeModel} ({booking.vehicle.licensePlate})
                    </p>
                    {booking.phone && (
                      <p className="text-sm text-gray-600">
                        Contact: {booking.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-green-600">
                      ₹{booking.total.toFixed(2)}
                    </p>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Profile Header - Fixed */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-500">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{user?.email || 'User'}</h2>
              <p className="text-blue-100">Member since {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Recent Bookings */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Bookings</h3>
            {isLoading ? (
              <div className="text-center py-4">Loading bookings...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : bookings.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No bookings yet</div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {booking.location.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Ref: {booking.bookingReference}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.date).toLocaleDateString()} • {booking.duration} hour(s)
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.vehicle.makeModel} ({booking.vehicle.licensePlate})
                          </p>
                          {booking.phone && (
                            <p className="text-sm text-gray-600">
                              Contact: {booking.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-green-600">
                            ₹{booking.total.toFixed(2)}
                          </p>
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive booking confirmations and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'vehicles' && renderVehiclesTab()}
          {activeTab === 'bookings' && renderBookingsTab()}
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex justify-end space-x-4 p-4 border-t bg-white flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;