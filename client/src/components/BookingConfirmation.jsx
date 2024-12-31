import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { FaDownload, FaShare, FaWhatsapp } from 'react-icons/fa';
import { Car, Bike } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// Utility function for date formatting
const formatDateTime = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Date parsing error:', error);
    return 'Invalid Date';
  }
};

const SERVICE_FEE_PERCENTAGE = 10; // Assuming 10% service fee

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const receiptRef = useRef();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console.log('Fetching booking with ID:', bookingId);
        const response = await api.get(`/user/bookings/${bookingId}`);
        console.log('Raw booking data:', response.data);
        
        if (!response.data) {
          throw new Error('No booking data received');
        }

        // Process the booking data with fallbacks
        const bookingData = {
          ...response.data,
          startDateTime: response.data.startDateTime || response.data.startTime || response.data.date,
          endDateTime: response.data.endDateTime || response.data.endTime,
          spotRate: parseFloat(response.data.spotRate),
          duration: response.data.duration || 0,
          total: parseFloat(response.data.total || 0),
          userName: response.data.userName || user?.name || 'N/A',
          location: {
            name: response.data.location?.name || 'N/A',
            address: response.data.location?.address || 'N/A',
            adminUsername: response.data.location?.adminUsername || 'N/A'
          },
          vehicle: {
            makeModel: response.data.vehicle?.makeModel || response.data.vehicleDetails?.makeModel,
            licensePlate: response.data.vehicle?.licensePlate || response.data.vehicleDetails?.licensePlate,
            category: response.data.vehicle?.category || response.data.vehicleDetails?.category
          },
          phone: response.data.phone || ''
        };
        
        console.log('Processed booking data:', bookingData);
        setBooking(bookingData);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load booking details');
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      setError('No booking ID provided');
    }
  }, [bookingId, user]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    
    link.href = data;
    link.download = `parking-receipt-${booking._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      const element = document.getElementById('booking-receipt');
      if (!element) return;

      const canvas = await html2canvas(element);
      const imageUrl = canvas.toDataURL('image/png');
      const receiptUrl = window.location.href;

      // Create HTML content with styled link
      const shareContent = `
        <div>
          <p>Parking Booking Receipt</p>
          <p>Booking Reference: ${booking?.bookingReference}</p>
          <p>View receipt at: <a href="${receiptUrl}" style="color: #3B82F6; text-decoration: underline;">${receiptUrl}</a></p>
          <img src="${imageUrl}" alt="Booking Receipt" style="max-width: 100%; margin-top: 10px;"/>
        </div>
      `;

      if (navigator.share) {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], `booking-${booking?.bookingReference || 'receipt'}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'Parking Booking Receipt',
          text: `Booking Reference: ${booking?.bookingReference}\nView receipt at: ${receiptUrl}`,
          url: receiptUrl,
          files: [file]
        });
      } else {
        // Fallback for browsers that don't support native sharing
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareContent);
          // toast.success('Receipt and link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // toast.error('Failed to share receipt');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 pt-16">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6" ref={receiptRef} id="booking-receipt">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
            <p className="text-gray-600">Your parking spot has been reserved</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <QRCodeSVG 
              value={`PARKING:${booking._id}`}
              size={128}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Booking Details */}
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">Customer Details</h3>
              <p className="text-gray-600">
                <span className="font-medium">Name:</span> {booking.userName}
              </p>
              {booking.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {booking.phone}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Location</h3>
              <p className="text-gray-600">
                <span className="font-medium">Parking Name:</span> {booking.location.name}
              </p>
              {booking.location.address && (
                <p className="text-gray-600">
                  <span className="font-medium">Parking Address:</span> {booking.location.address}
                </p>
              )}
              {booking.location.adminUsername && booking.location.adminUsername !== 'N/A' && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Owner:</span> @{booking.location.adminUsername}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Vehicle</h3>
              <div className="flex items-center space-x-2">
                {(booking.vehicle?.category || booking.vehicleDetails?.category) === 'two-wheeler' ? (
                  <Bike className="text-gray-600" size={20} />
                ) : (
                  <Car className="text-gray-600" size={20} />
                )}
                <p className="text-gray-600">
                  {booking.vehicle.makeModel} ({booking.vehicle.licensePlate})
                  <span className="text-sm text-gray-500 ml-2">
                    {(booking.vehicle?.category || booking.vehicleDetails?.category) === 'two-wheeler' 
                      ? '• Two Wheeler' 
                      : '• Four Wheeler'}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Date & Time</h3>
              <p className="text-gray-600">
                From: {(() => {
                  try {
                    const date = new Date(booking?.startDateTime || booking?.from || booking?.date);
                    return date.toLocaleString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });
                  } catch (e) {
                    console.error('Error formatting start date:', e);
                    return 'Not available';
                  }
                })()}
              </p>
              <p className="text-gray-600">
                To: {(() => {
                  try {
                    const date = new Date(booking?.endDateTime || booking?.to || 
                      new Date(new Date(booking?.date).getTime() + (booking?.duration || 0) * 60 * 60 * 1000));
                    return date.toLocaleString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });
                  } catch (e) {
                    console.error('Error formatting end date:', e);
                    return 'Not available';
                  }
                })()}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {booking?.duration || 0} hour(s)
              </p>
              <p className="text-sm text-gray-500">
                Rate: ₹{parseFloat(booking.spotRate).toFixed(2)}/hour
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Amount Paid</h3>
              <p className="text-xl font-bold text-green-600">₹{booking?.total?.toFixed(2) || '0.00'}</p>
              <p className="text-sm text-gray-500">
                (Including {SERVICE_FEE_PERCENTAGE}% service fee)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={downloadReceipt}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaDownload /> Download
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaShare /> Share
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="border-t p-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
