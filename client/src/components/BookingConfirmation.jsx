import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { FaDownload, FaShare, FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const receiptRef = useRef();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/user/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

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

  const shareReceipt = async () => {
    const shareData = {
      title: 'Parking Booking Receipt',
      text: `Booking at ${booking.location.name}\nDate: ${new Date(booking.date).toLocaleDateString()}\nDuration: ${booking.duration} hour(s)\nTotal: ₹${booking.total.toFixed(2)}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to WhatsApp share
        const text = encodeURIComponent(shareData.text);
        window.open(`https://wa.me/?text=${text}`);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 pt-16">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6" ref={receiptRef}>
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
              <h3 className="font-semibold text-gray-800">Location</h3>
              <p className="text-gray-600">{booking.location.name}</p>
              {booking.location.address && (
                <p className="text-sm text-gray-500">{booking.location.address}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Vehicle</h3>
              <p className="text-gray-600">
                {booking.vehicle.makeModel} ({booking.vehicle.licensePlate})
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Date & Time</h3>
              <p className="text-gray-600">
                From: {new Date(booking.startDateTime).toLocaleString()}
              </p>
              <p className="text-gray-600">
                To: {new Date(booking.endDateTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {booking.duration} hour(s)
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Amount Paid</h3>
              <p className="text-xl font-bold text-green-600">₹{booking.total.toFixed(2)}</p>
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
              onClick={shareReceipt}
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
