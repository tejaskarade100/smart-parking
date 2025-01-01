const mongoose = require('mongoose');

const activeBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['two-wheeler', 'four-wheeler'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  isOffline: {
    type: Boolean,
    default: false
  }
});

const statsSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    unique: true
  },
  adminUsername: {
    type: String,
    required: true
  },
  totalSpaces: {
    twoWheeler: { type: Number, default: 0 },
    fourWheeler: { type: Number, default: 0 }
  },
  availableSpaces: {
    twoWheeler: { type: Number, default: 0 },
    fourWheeler: { type: Number, default: 0 }
  },
  revenue: {
    type: Number,
    default: 0
  },
  activeBookings: {
    type: [activeBookingSchema],
    default: []
  }
});

// Method to clean up and reinitialize stats
statsSchema.statics.cleanupAndInitialize = async function(adminId) {
  try {
    const Admin = require('./Admin');
    const Booking = require('./Booking');

    const admin = await Admin.findById(adminId);
    if (!admin) throw new Error('Admin not found');

    // Find or create stats
    let stats = await this.findOne({ admin: adminId });
    if (!stats) {
      stats = new this({
        admin: adminId,
        adminUsername: admin.email,
        totalSpaces: {
          twoWheeler: admin.twoWheelerSpaces || 0,
          fourWheeler: admin.fourWheelerSpaces || 0
        },
        availableSpaces: {
          twoWheeler: admin.twoWheelerSpaces || 0,
          fourWheeler: admin.fourWheelerSpaces || 0
        },
        revenue: 0,
        activeBookings: []
      });
    }

    // Reset stats
    stats.activeBookings = [];
    stats.revenue = 0;

    // Get all active bookings (both online and offline)
    const activeBookings = await Booking.find({
      admin: adminId,
      status: 'Active'
    }).populate('user vehicle');

    // Re-add all valid bookings
    for (const booking of activeBookings) {
      const bookingEntry = {
        bookingId: booking._id.toString(),
        vehicleId: booking.vehicle?._id || booking.admin,
        userId: booking.user?._id || booking.admin,
        vehicleType: booking.vehicleDetails?.category || 'four-wheeler',
        amount: booking.total || 0,
        startTime: booking.startDateTime || booking.date,
        endTime: booking.endDateTime || new Date(new Date(booking.date).getTime() + (booking.duration * 60 * 60 * 1000)),
        duration: booking.duration || 1,
        isOffline: booking.isOffline || false
      };

      stats.activeBookings.push(bookingEntry);
      stats.revenue += bookingEntry.amount;
    }

    await stats.save();
    return stats;
  } catch (error) {
    console.error('Error in cleanupAndInitialize:', error);
    throw error;
  }
};

// Method to safely add a new booking
statsSchema.methods.addBooking = async function(bookingData) {
  try {
    const booking = {
      bookingId: bookingData.bookingId,
      vehicleId: new mongoose.Types.ObjectId(bookingData.vehicleId),
      userId: new mongoose.Types.ObjectId(bookingData.userId),
      vehicleType: bookingData.vehicleType,
      amount: parseFloat(bookingData.amount),
      startTime: new Date(bookingData.startTime),
      endTime: new Date(bookingData.endTime),
      duration: parseInt(bookingData.duration),
      isOffline: bookingData.isOffline || false
    };

    this.activeBookings.push(booking);
    this.revenue += booking.amount;

    const spaceType = booking.vehicleType === 'two-wheeler' ? 'twoWheeler' : 'fourWheeler';
    this.availableSpaces[spaceType] = Math.max(0, this.availableSpaces[spaceType] - 1);

    return await this.save();
  } catch (error) {
    console.error('Error adding booking:', error);
    throw error;
  }
};

// Add this method back to the Stats model, after the existing methods
statsSchema.statics.updateOnBooking = async function(adminUsername, bookingData) {
  try {
    // Clean the username/email and handle ObjectId case
    adminUsername = adminUsername.trim();
    
    const Admin = require('./Admin');
    let admin;

    // First try to find by username/email
    admin = await Admin.findOne({
      $or: [
        { username: adminUsername },
        { email: adminUsername }
      ]
    });

    // If not found, try to find by ID
    if (!admin && mongoose.Types.ObjectId.isValid(adminUsername)) {
      admin = await Admin.findById(adminUsername);
    }

    if (!admin) {
      console.error('Admin lookup failed for:', adminUsername);
      throw new Error(`Admin not found for identifier: ${adminUsername}`);
    }

    console.log('Found admin:', admin.email);

    // Find stats
    let stats = await this.findOne({ admin: admin._id });
    if (!stats) {
      // Initialize new stats
      stats = new this({
        admin: admin._id,
        adminUsername: admin.email,
        totalSpaces: {
          twoWheeler: admin.twoWheelerSpaces || 0,
          fourWheeler: admin.fourWheelerSpaces || 0
        },
        availableSpaces: {
          twoWheeler: admin.twoWheelerSpaces || 0,
          fourWheeler: admin.fourWheelerSpaces || 0
        },
        revenue: 0,
        activeBookings: []
      });
    }

    // Clean up existing invalid entries
    stats.activeBookings = stats.activeBookings.filter(booking => 
      booking && 
      booking.bookingId && 
      booking.vehicleId && 
      booking.userId && 
      booking.vehicleType &&
      booking.amount &&
      booking.startTime &&
      booking.endTime &&
      booking.duration
    );

    // Create new booking entry with proper validation
    const newBooking = {
      bookingId: bookingData._id?.toString() || bookingData.bookingId?.toString(),
      vehicleId: new mongoose.Types.ObjectId(bookingData.vehicleId),
      userId: new mongoose.Types.ObjectId(bookingData.userId),
      vehicleType: bookingData.vehicle?.category || bookingData.vehicleType,
      amount: parseFloat(bookingData.total || bookingData.amount || 0),
      startTime: new Date(bookingData.startDateTime || bookingData.startTime),
      endTime: new Date(bookingData.endDateTime || bookingData.endTime),
      duration: parseInt(bookingData.duration),
      isOffline: false
    };

    // Validate all required fields
    const requiredFields = ['bookingId', 'vehicleId', 'userId', 'vehicleType', 'amount', 'startTime', 'endTime', 'duration'];
    for (const field of requiredFields) {
      if (!newBooking[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Add the new booking
    stats.activeBookings.push(newBooking);

    // Update revenue and spaces
    stats.revenue += newBooking.amount;
    const spaceType = newBooking.vehicleType === 'two-wheeler' ? 'twoWheeler' : 'fourWheeler';
    stats.availableSpaces[spaceType] = Math.max(0, stats.availableSpaces[spaceType] - 1);

    await stats.save();
    return stats;
  } catch (error) {
    console.error('Error in updateOnBooking:', error);
    throw error;
  }
};

module.exports = mongoose.model('Stats', statsSchema);
