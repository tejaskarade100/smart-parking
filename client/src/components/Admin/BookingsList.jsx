import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Car, User, IndianRupee } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`/api/admin/bookings/${user._id}`);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user._id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Parking Bookings</h2>
      
      <div className="grid gap-4">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* User Info */}
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{booking.userName}</p>
                  <p className="text-sm text-gray-500">{booking.userEmail}</p>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="flex items-start space-x-3">
                <Car className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Vehicle</p>
                  <p className="font-medium">{booking.vehicleType}</p>
                  <p className="text-sm text-gray-500">{booking.vehicleNumber}</p>
                </div>
              </div>

              {/* Time Info */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {new Date(booking.startTime).toLocaleString()} -
                    {new Date(booking.endTime).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex items-start space-x-3">
                <IndianRupee className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-medium">₹{booking.amount}</p>
                  <p className="text-sm text-gray-500">{booking.paymentStatus}</p>
                </div>
              </div>

              {/* Spot Info */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Spot Details</p>
                  <p className="font-medium">{booking.spotNumber}</p>
                  <p className="text-sm text-gray-500">{booking.parkingType}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    booking.status === 'active' ? 'bg-green-100 text-green-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsList;
