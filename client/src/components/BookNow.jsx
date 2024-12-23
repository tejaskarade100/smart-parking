import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Phone, CreditCard, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const BookNow = ({ onClose, location }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const subtotal = 6.00;
  const serviceFee = 0.75;
  const total = subtotal + serviceFee;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/user/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to load vehicles');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate vehicle selection
    if (!selectedVehicle) {
      setError('Please select a vehicle');
      return;
    }

    // Validate location
    if (!location?.name) {
      setError('Invalid location data');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Selected location:', location);
      console.log('Selected vehicle:', selectedVehicle);

      // Prepare booking data
      const bookingData = {
        vehicleId: selectedVehicle,
        location: {
          name: location.name,
          address: location.address || '',
          lat: location.lat || null,
          lng: location.lng || null
        },
        phone: phone.trim(),
        total: parseFloat(total.toFixed(2)),
        duration: 1
      };

      console.log('Sending booking data:', bookingData);

      // Make API request
      const response = await api.post('/user/bookings', bookingData);
      console.log('Booking response:', response.data);

      // Update state with confirmation
      if (response.data && response.data._id) {
        setBookingConfirmation(response.data);
      } else {
        throw new Error('Invalid booking response');
      }
    } catch (error) {
      console.error('Booking error:', error.response || error);
      setError(
        error.response?.data?.message || 
        'Failed to create booking. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show confirmation if booking was successful
  if (bookingConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <BookingConfirmation
          booking={bookingConfirmation}
          onClose={() => {
            setBookingConfirmation(null);
            onClose();
          }}
        />
      </div>
    );
  }

  return (
    <AnimatePresence>
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
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-6">Book Parking Space</h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Account Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Account Information</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vehicle
                  </label>
                  {vehicles.length > 0 ? (
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
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
                        onClick={() => {/* Navigate to profile vehicles tab */}}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Add a vehicle in your profile
                      </button>
                    </div>
                  )}
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
                <div className="bg-white p-2 rounded-md">
                  <QrCode className="text-gray-600" size={24} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h4 className="font-medium mb-2">Booking Details</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Location: {location?.name || 'Selected Parking Space'}</p>
                  <p>Duration: 1 hour</p>
                  <p>Date: {new Date().toLocaleDateString()}</p>
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
    </AnimatePresence>
  );
};

export default BookNow;
