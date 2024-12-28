const mongoose = require('mongoose');

// Drop the existing index if it exists
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.collection('stats').dropIndex('adminUsername_1');
  } catch (error) {
    // Index might not exist, that's okay
    console.log('No existing index to drop');
  }
});

const activeBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  phone: String,
  location: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    spotRate: Number
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active'
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
    required: true,
    index: true  // indexed but not unique
  },
  totalSpaces: {
    twoWheeler: {
      type: Number,
      default: 0
    },
    fourWheeler: {
      type: Number,
      default: 0
    }
  },
  availableSpaces: {
    twoWheeler: {
      type: Number,
      default: 0
    },
    fourWheeler: {
      type: Number,
      default: 0
    }
  },
  revenue: {
    type: Number,
    default: 0
  },
  activeBookings: [activeBookingSchema]
}, {
  timestamps: true
});

// Initialize stats for a new admin
statsSchema.statics.initializeStats = async function(admin) {
  const existingStats = await this.findOne({ admin: admin._id });
  if (existingStats) {
    return existingStats;
  }

  return await this.create({
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
};

// Get stats for an admin
statsSchema.statics.getAdminStats = async function(admin) {
  let stats = await this.findOne({ admin: admin._id });
  
  if (!stats) {
    stats = await this.initializeStats(admin);
  }

  // Update total spaces from admin data
  stats.totalSpaces = {
    twoWheeler: admin.twoWheelerSpaces || 0,
    fourWheeler: admin.fourWheelerSpaces || 0
  };

  // Ensure available spaces don't exceed total spaces
  stats.availableSpaces = {
    twoWheeler: Math.min(stats.availableSpaces.twoWheeler, stats.totalSpaces.twoWheeler),
    fourWheeler: Math.min(stats.availableSpaces.fourWheeler, stats.totalSpaces.fourWheeler)
  };

  return stats;
};

// Update stats when a new booking is made
statsSchema.statics.updateOnBooking = async function(adminUsername, bookingData) {
  // Clean the username/email
  adminUsername = adminUsername.trim();
  
  const Admin = require('./Admin');
  const admin = await Admin.findOne({
    $or: [
      { username: adminUsername },
      { email: adminUsername }
    ]
  });

  if (!admin) {
    console.error('Admin lookup failed for:', adminUsername);
    throw new Error(`Admin not found for username: ${adminUsername}`);
  }

  console.log('Found admin:', admin.email);

  // Try to find stats, create if not exists
  let stats = await this.findOne({ 
    $or: [
      { adminUsername: admin.username },
      { adminUsername: admin.email }
    ]
  });
  
  if (!stats) {
    // Initialize stats with admin's data
    stats = await this.create({
      admin: admin._id,
      adminUsername: admin.email, // Use email consistently
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

  // Update available spaces
  const spaceType = bookingData.vehicleType === 'two-wheeler' ? 'twoWheeler' : 'fourWheeler';
  stats.availableSpaces[spaceType] = Math.max(0, stats.availableSpaces[spaceType] - 1);

  // Add to revenue
  stats.revenue += bookingData.amount;

  // Add to active bookings
  stats.activeBookings.push({
    bookingId: bookingData.bookingId,
    vehicleId: bookingData.vehicleId,
    userId: bookingData.userId,
    vehicleType: bookingData.vehicleType,
    amount: bookingData.amount,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    duration: bookingData.duration,
    phone: bookingData.phone,
    location: bookingData.location,
    status: 'Active'
  });

  return await stats.save();
};

// Update stats when a booking is completed
statsSchema.statics.updateOnBookingComplete = async function(adminUsername, bookingId) {
  const Admin = require('./Admin');
  const admin = await Admin.findOne({ username: adminUsername });
  if (!admin) {
    throw new Error('Admin not found for username');
  }

  // Try to find stats
  const stats = await this.findOne({ admin: admin._id });
  if (!stats) {
    throw new Error('Stats not found for admin');
  }

  // Find the booking
  const booking = stats.activeBookings.find(b => b.bookingId === bookingId);
  if (booking) {
    // Increase available spaces
    const spaceType = booking.vehicleType === 'two-wheeler' ? 'twoWheeler' : 'fourWheeler';
    stats.availableSpaces[spaceType] += 1;

    // Remove from active bookings
    stats.activeBookings = stats.activeBookings.filter(b => b.bookingId !== bookingId);
  }

  return await stats.save();
};

module.exports = mongoose.model('Stats', statsSchema);
