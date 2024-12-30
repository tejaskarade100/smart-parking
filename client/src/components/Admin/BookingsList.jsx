import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Car, User, IndianRupee } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

// Utility function for date formatting
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return 'N/A';
  }
};

// Calculate duration between two dates
const calculateDuration = (startDateTime, endDateTime) => {
  if (!startDateTime || !endDateTime) return 'N/A';
  try {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';
    
    const diffInHours = Math.abs(end - start) / 36e5; // Convert milliseconds to hours
    return `${Math.round(diffInHours * 10) / 10} hours`;
  } catch (error) {
    return 'N/A';
  }
};

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(`/admin/bookings/${user._id}`);
        console.log('Fetched raw bookings:', response.data);

        const now = new Date();
        console.log('Current time:', now.toISOString());

        // Process bookings to calculate status
        const processedBookings = response.data.map(booking => {
          const endDateTime = new Date(booking.endDateTime);
          // Normalize vehicle type
          const vehicleType = booking.vehicleType?.toLowerCase().includes('four') ? 'four-wheeler' : 
                            booking.vehicleType?.toLowerCase().includes('two') ? 'two-wheeler' : 
                            booking.vehicleType;
          
          const status = endDateTime > now ? 'Active' : 'Completed';
          console.log(`Booking ${booking._id}: EndTime=${endDateTime.toISOString()}, Status=${status}`);
          
          return { ...booking, vehicleType, status };
        });

        // Get active and completed bookings
        const activeBookings = processedBookings.filter(b => b.status === 'Active');
        const completedBookings = processedBookings.filter(b => b.status === 'Completed');

        console.log('Active bookings count:', activeBookings.length);
        console.log('Completed bookings count:', completedBookings.length);

        // Update stats in MainContent
        const updateStats = async () => {
          try {
            const activeTwoWheelerCount = activeBookings.filter(b => b.vehicleType === 'two-wheeler').length;
            const activeFourWheelerCount = activeBookings.filter(b => b.vehicleType === 'four-wheeler').length;

            await api.post(`/admin/updateStats/${user._id}`, {
              activeBookings: activeBookings.length,
              completedBookings: completedBookings.length,
              activeTwoWheeler: activeTwoWheelerCount,
              activeFourWheeler: activeFourWheelerCount,
              revenue: processedBookings.reduce((total, booking) => total + (parseFloat(booking.total) || 0), 0)
            });
          } catch (error) {
            console.error('Error updating stats:', error);
          }
        };

        updateStats();
        setBookings(processedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchBookings();
      // Update every 10 seconds
      const interval = setInterval(fetchBookings, 10000);
      return () => clearInterval(interval);
    }
  }, [user?._id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Parking Bookings</h2>
        <div className="text-center text-gray-500">No bookings found</div>
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
                  <p className="text-sm text-gray-600">Vehicle Details</p>
                  <div className="flex flex-col">
                    <span>{booking.vehicleMakeModel !== 'N/A' ? (
                      <span>{booking.vehicleMakeModel}</span>
                    ) : (
                      <span>Vehicle</span>
                    )}</span>
                    <span className="text-xs text-gray-400">{booking.vehicleNumber !== 'N/A' ? (
                      <span className="uppercase">{booking.vehicleNumber}</span>
                    ) : (
                      <span>No plate number</span>
                    )}</span>
                    <span className="text-xs text-blue-500 font-medium mt-1">
                      {booking.vehicleType === 'two-wheeler' ? 'Two Wheeler' : 'Four Wheeler'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Info */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {formatDateTime(booking.startDateTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    to {formatDateTime(booking.endDateTime)}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    ({calculateDuration(booking.startDateTime, booking.endDateTime)})
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex items-start space-x-3">
                <IndianRupee className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-medium">₹{booking.total}</p>
                  <p className="text-sm text-green-500">Paid</p>
                </div>
              </div>

              {/* Location Info */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{booking.location?.name}</p>
                  <p className="text-sm text-gray-500">{booking.location?.address}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-medium ${
                    booking.status === 'Completed' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingsList;
