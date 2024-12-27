const mongoose = require('mongoose');

// Function to generate unique booking reference
function generateBookingRef() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK${timestamp}${random}`;
}

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,
    required: true,
    default: generateBookingRef
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  location: {
    name: {
      type: String,
      required: [true, 'Please provide location name']
    },
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in hours']
  },
  total: {
    type: Number,
    required: [true, 'Please provide total amount']
  },
  phone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled', 'Pending'],
    default: 'Active'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Paid'
  }
}, {
  timestamps: true
});

// Add index for bookingReference
bookingSchema.index({ bookingReference: 1 }, { unique: true });

// Pre-save middleware to ensure bookingReference is set
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = generateBookingRef();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
