import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { Car, Bike, Clock, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const OfflineBooking = () => {
  const { user } = useAuth();
  const [vehicleType, setVehicleType] = useState('');
  const [duration, setDuration] = useState(1);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateBooking = async () => {
    try {
      setLoading(true);
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + (parseInt(duration) * 60 * 60 * 1000));
      
      const bookingData = {
        vehicleType,
        duration: parseInt(duration),
        date: startTime.toISOString(),
        startDateTime: startTime.toISOString(),
        endDateTime: endTime.toISOString(),
        adminId: user._id,
        adminEmail: user.email,
        parkingName: user.parkingName,
        parkingAddress: user.parkingAddress,
        spotRate: user.hourlyRate || 0,
        total: (user.hourlyRate || 0) * parseInt(duration),
        isOffline: true,
        status: 'Active',
        vehicleDetails: {
          category: vehicleType,
          makeModel: 'Offline Vehicle',
          licensePlate: 'OFFLINE'
        }
      };

      console.log('Sending booking data:', bookingData);
      const response = await api.post('/admin/offline-booking', bookingData);
      console.log('Booking response:', response.data);
      
      if (response.data) {
        const ticketData = {
          ...response.data,
          startDateTime: response.data.startDateTime || response.data.date,
          endDateTime: response.data.endDateTime || new Date(new Date(response.data.date).getTime() + (parseInt(duration) * 60 * 60 * 1000)).toISOString(),
          bookingId: response.data._id || response.data.bookingId
        };
        
        setTicket(ticketData);
        
        try {
          await api.post(`/admin/updateStats/${user._id}`, {
            activeBookings: 1,
            revenue: bookingData.total,
            vehicleType: bookingData.vehicleType
          });
        } catch (error) {
          console.error('Error updating stats:', error);
        }
      }
    } catch (error) {
      console.error('Error creating offline booking:', error);
      alert('Failed to create booking: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async () => {
    const element = document.getElementById('offline-ticket');
    if (!element) return;

    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = `parking-ticket-${ticket.bookingId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Offline Booking</h2>

      {!ticket ? (
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setVehicleType('two-wheeler')}
                  className={`flex items-center justify-center p-4 rounded-lg border ${
                    vehicleType === 'two-wheeler' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <Bike className="w-6 h-6 mr-2" />
                  Two Wheeler
                </button>
                <button
                  onClick={() => setVehicleType('four-wheeler')}
                  className={`flex items-center justify-center p-4 rounded-lg border ${
                    vehicleType === 'four-wheeler' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <Car className="w-6 h-6 mr-2" />
                  Four Wheeler
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <button
              onClick={generateBooking}
              disabled={!vehicleType || loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Generating...' : 'Generate Ticket'}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto"
        >
          <div id="offline-ticket" className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold">Parking Ticket</h3>
              <p className="text-gray-500">Offline Booking</p>
            </div>

            <div className="flex justify-center">
              <QRCodeSVG
                value={`PARKING:${ticket.bookingId}`}
                size={128}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{ticket.bookingId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Vehicle Type:</span>
                <span className="font-medium">
                  {vehicleType === 'two-wheeler' ? 'Two Wheeler' : 'Four Wheeler'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{duration} hours</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Start Time:</span>
                <span className="font-medium">
                  {formatDateTime(ticket.startDateTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">End Time:</span>
                <span className="font-medium">
                  {formatDateTime(ticket.endDateTime)}
                </span>
              </div>

              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>₹{ticket.total}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={downloadTicket}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Download Ticket
            </button>
            <button
              onClick={() => setTicket(null)}
              className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200"
            >
              Create New Booking
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OfflineBooking; 