import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { FaDownload, FaShare, FaWhatsapp } from 'react-icons/fa';

const BookingConfirmation = ({ booking, onClose }) => {
  const receiptRef = useRef();

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6" ref={receiptRef}>
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
            <p className="text-gray-600">Your parking spot has been reserved</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <QRCode 
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
                {new Date(booking.date).toLocaleDateString()} • {booking.duration} hour(s)
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
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;
