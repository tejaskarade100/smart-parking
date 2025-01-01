import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Car, Phone, CreditCard, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const BookNow = ({ onClose, location, bookingDateTime }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    makeModel: '',
    licensePlate: '',
    state: '',
    category: ''
  });

  // Constants for pricing
  const SERVICE_FEE_PERCENTAGE = 5; // 5%

  useEffect(() => {
    console.log('BookNow received props:', { location, bookingDateTime });
    fetchVehicles();
  }, [location]);

  // Calculate duration in hours between start and end datetime
  const calculateDuration = () => {
    if (!bookingDateTime?.startDateTime || !bookingDateTime?.endDateTime) {
      console.log('Missing datetime values:', bookingDateTime);
      return 0;
    }
    const start = new Date(bookingDateTime.startDateTime);
    const end = new Date(bookingDateTime.endDateTime);
    console.log('Calculating duration for:', { start, end });
    const durationInMs = end - start;
    const durationInHours = durationInMs / (1000 * 60 * 60);
    return Math.ceil(durationInHours);
  };

  // Calculate costs based on location's rate
  const calculateCosts = () => {
    const duration = calculateDuration();
    const baseRate = location?.spotRate || 0;
    console.log('Calculating costs with rate:', baseRate);
    
    const subtotal = baseRate * duration;
    const serviceFee = (subtotal * SERVICE_FEE_PERCENTAGE) / 100;
    const total = subtotal + serviceFee;

    return {
      baseRate,
      subtotal,
      serviceFee,
      total
    };
  };

  const { baseRate, subtotal, serviceFee, total } = calculateCosts();

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/user/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to load vehicles');
    }
  };

  const handleVehicleChange = async (e) => {
    const vehicleId = e.target.value;
    setSelectedVehicle(vehicleId);
    
    if (vehicleId) {
      const vehicle = vehicles.find(v => v._id === vehicleId);
      if (vehicle) {
        setVehicleType(vehicle.type || 'four-wheeler');
      }
    }
  };

  const handleVehicleTypeChange = async (e) => {
    const newType = e.target.value;
    setVehicleType(newType);
    
    // Update vehicle type in database if a vehicle is selected
    if (selectedVehicle) {
      try {
        await api.patch(`/user/vehicles/${selectedVehicle}`, {
          type: newType
        });
        // Update vehicles array with new type
        setVehicles(vehicles.map(vehicle => 
          vehicle._id === selectedVehicle 
            ? { ...vehicle, type: newType }
            : vehicle
        ));
      } catch (error) {
        console.error('Error updating vehicle type:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedVehicle) {
      setError('Please select a vehicle');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { total, baseRate } = calculateCosts();
      const duration = calculateDuration();

      // Get the selected vehicle details
      const selectedVehicleDetails = vehicles.find(v => v._id === selectedVehicle);

      // Prepare booking data
      const bookingData = {
        vehicleId: selectedVehicle,
        vehicle: {
          ...selectedVehicleDetails,
          category: selectedVehicleDetails.category
        },
        location: {
          name: location.name,
          address: location.address || '',
          adminUsername: location.adminEmail || location.adminUsername,
          adminEmail: location.adminEmail,
          coordinates: location.coordinates,
          spotRate: parseFloat(location.spotRate)
        },
        duration: duration,
        total: total,
        startDateTime: bookingDateTime.startDateTime,
        endDateTime: bookingDateTime.endDateTime,
        phone: phone.trim() || null,
        userName: user.name,
        userEmail: user.email
      };

      console.log('Submitting booking with data:', bookingData);

      const response = await api.post('/user/bookings', bookingData);
      console.log('Booking response:', response.data);

      if (response.data && response.data._id) {
        try {
          // Get admin username from location
          const adminUsername = location.adminEmail || location.adminUsername;
          
          if (!adminUsername) {
            console.error('Admin username/email not found in location data:', location);
            throw new Error('Admin information missing');
          }

          // Update stats with the booking data
          await api.post(`/admin/updateStats/${adminUsername}`, {
            bookingId: response.data._id,
            _id: response.data._id,
            vehicleId: selectedVehicle,
            userId: user._id,
            vehicle: {
              category: selectedVehicleDetails.category
            },
            vehicleType: selectedVehicleDetails.category,
            total: total,
            amount: total,
            startDateTime: bookingDateTime.startDateTime,
            endDateTime: bookingDateTime.endDateTime,
            startTime: bookingDateTime.startDateTime,
            endTime: bookingDateTime.endDateTime,
            duration: duration
          });

          setBookingConfirmation(response.data);
          navigate(`/booking-confirmation/${response.data._id}`);
        } catch (statsError) {
          console.error('Error updating stats:', statsError);
          // Continue with booking confirmation even if stats update fails
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      state: newVehicle.state.trim().toUpperCase(),
      category: newVehicle.category
    };

    try {
      const response = await api.post('/user/vehicles', vehicleData);
      console.log('Vehicle added successfully:', response.data);
      
      // Update vehicles list with new vehicle
      setVehicles(prevVehicles => [...prevVehicles, response.data]);
      
      // Select the newly added vehicle
      setSelectedVehicle(response.data._id);
      
      // Reset form and close add vehicle form
      setNewVehicle({ makeModel: '', licensePlate: '', state: '', category: '' });
      setShowAddVehicle(false);
      setError('');
    } catch (error) {
      console.error('Error adding vehicle:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  const renderVehicleSelection = () => (
    <div className="space-y-4">
      {showAddVehicle ? (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select
                value={newVehicle.category}
                onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select vehicle type</option>
                <option value="two-wheeler">Two Wheeler</option>
                <option value="four-wheeler">Four Wheeler</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddVehicle(e);
              }}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Adding...' : 'Add Vehicle'}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddVehicle(false);
                setNewVehicle({ makeModel: '', licensePlate: '', state: '', category: '' });
                setError('');
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Vehicle
            </label>
            <select
              value={selectedVehicle}
              onChange={handleVehicleChange}
              className="w-full px-3 py-2 border rounded-md mb-2"
            >
              <option value="">Choose a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.makeModel} ({vehicle.licensePlate})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddVehicle(true)}
              className="w-full flex items-center justify-center space-x-2 p-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
            >
              <Plus size={20} />
              <span>Add New Vehicle</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center mt-16"
      style={{ zIndex: 9999 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl p-4 w-full max-w-4xl relative"
        style={{ zIndex: 10000 }}
      >
        {/* <div className="absolute top-3 right-16 text-right text-xs">
          <p className="text-gray-600">From: {bookingDateTime.startDateTime}</p>
          <p className="text-gray-600">To: {bookingDateTime.endDateTime}</p>
        </div> */}

        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-4">Book Parking Space</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Parking Details */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Parking Details</h3>
              <p className="text-sm text-gray-600">{location.name}</p>
              <p className="text-sm text-gray-600">{location.address}</p>
              {location.adminUsername && (
                <p className="text-xs text-gray-500">Owner: @{location.adminUsername}</p>
              )}
            </div>

            {/* Account Info */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Account Information</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {renderVehicleSelection()}

              {/* Contact Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border rounded-md text-sm"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2 bg-red-100 text-red-700 rounded-md text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !selectedVehicle}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <CreditCard size={16} />
                <span>{isLoading ? 'Processing...' : 'Pay and Reserve'}</span>
              </button>
            </form>
          </div>

          {/* Right Side - Bill Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-base font-semibold">Bill Summary</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate per hour</span>
                <span className="font-medium">₹{baseRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{calculateDuration()} hour(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee ({SERVICE_FEE_PERCENTAGE}%)</span>
                <span className="font-medium">₹{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-medium mb-2 text-sm">Booking Details</h4>
              <div className="text-xs text-gray-600 space-y-0.5">
                <p>Location: {location?.name || 'Selected Parking Space'}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">From: {bookingDateTime.startDateTime}</p>
                <p className="text-sm text-gray-600">To: {bookingDateTime.endDateTime}</p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 p-3 bg-white rounded-md">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <CreditCard className="text-gray-600" size={20} />
              </div>
              <div className="text-xs">
                <p className="font-medium">Secure Payment</p>
                <p className="text-gray-500">Norton DigiCert Protected</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookNow;
