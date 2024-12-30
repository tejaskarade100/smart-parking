import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Car, Phone, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const BookNow = ({ onClose, location, bookingDateTime }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleType, setVehicleType] = useState('four-wheeler');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

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
          type: vehicleType
        },
        adminId: location.adminId,
        location: {
          name: location.name,
          address: location.address || '',
          adminUsername: location.adminUsername || '',
          coordinates: {
            lat: location.coordinates?.lat || null,
            lng: location.coordinates?.lng || null
          },
          spotRate: location.spotRate
        },
        phone: phone.trim() || null,
        total: parseFloat(total.toFixed(2)),
        duration: duration,
        startDateTime: new Date(bookingDateTime.startDateTime).toISOString(),
        endDateTime: new Date(bookingDateTime.endDateTime).toISOString(),
        hourlyRate: location.spotRate,
        rate: location.spotRate,
        userName: user.name,
        userEmail: user.email
      };

      console.log('Submitting booking with data:', bookingData);

      const response = await api.post('/user/bookings', bookingData);
      console.log('Booking response:', response.data);

      if (response.data && response.data._id) {
        setBookingConfirmation(response.data);
        navigate(`/booking-confirmation/${response.data._id}`);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl relative z-[10000]"
      >
        <div className="absolute top-4 right-20 text-right">
          <p className="text-sm text-gray-600">From: {bookingDateTime.startDateTime}</p>
          <p className="text-sm text-gray-600">To: {bookingDateTime.endDateTime}</p>
        </div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Book Parking Space</h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Parking Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Parking Details</h3>
              <p className="text-gray-600">{location.name}</p>
              <p className="text-gray-600">{location.address}</p>
              {location.adminUsername && (
                <p className="text-sm text-gray-500">Owner: @{location.adminUsername}</p>
              )}
            </div>

            {/* Account Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Account Information</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vehicle
                  </label>
                  {vehicles.length > 0 ? (
                    <select
                      value={selectedVehicle}
                      onChange={handleVehicleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Choose a vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle._id} value={vehicle._id}>
                          {vehicle.makeModel} ({vehicle.licensePlate})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-md">
                      <Car className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-sm text-gray-600">No vehicles found</p>
                      <button
                        type="button"
                        onClick={() => navigate('/vehicles')}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Add a vehicle
                      </button>
                    </div>
                  )}
                </div>

                {/* Vehicle Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={handleVehicleTypeChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="two-wheeler">Two Wheeler</option>
                    <option value="four-wheeler">Four Wheeler</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !selectedVehicle}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard size={20} />
                <span>{isLoading ? 'Processing...' : 'Pay and Reserve'}</span>
              </button>
            </form>
          </div>

          {/* Right Side - Bill Summary */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-lg font-semibold">Bill Summary</h3>
            </div>

            <div className="space-y-4">
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

            <div className="pt-6 border-t">
              <h4 className="font-medium mb-2">Booking Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Location: {location?.name || 'Selected Parking Space'}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">From: {bookingDateTime.startDateTime}</p>
                <p className="text-sm text-gray-600">To: {bookingDateTime.endDateTime}</p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 p-4 bg-white rounded-md">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <CreditCard className="text-gray-600" size={24} />
              </div>
              <div className="text-sm">
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
