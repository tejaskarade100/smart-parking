const express = require('express');
const router = express.Router();

const Admin = require('../models/Admin');
const Booking = require('../models/Booking'); 
const Stats = require('../models/Stats');
const protect = require('../middleware/auth');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');



// Check if email exists

router.post('/check-email', async (req, res) => {

  try {

    const { email } = req.body;

    console.log('Checking email:', email);

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    console.log('Existing admin:', existingAdmin);

    res.json({ exists: !!existingAdmin });

  } catch (error) {

    console.error('Error checking email:', error);

    res.status(500).json({ error: 'Internal server error' });

  }

});



// Check if username exists

router.post('/check-username', async (req, res) => {

  try {

    const { username } = req.body;

    console.log('Checking username:', username);

    const existingAdmin = await Admin.findOne({ username });

    console.log('Existing admin:', existingAdmin);

    res.json({ exists: !!existingAdmin });

  } catch (error) {

    console.error('Error checking username:', error);

    res.status(500).json({ error: 'Internal server error' });

  }

});



// Admin Registration

router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      fullName,
      parkingName,
      parkingAddress,
      city,
      state,
      parkingType,
      category,
      twoWheelerSpaces,
      fourWheelerSpaces,
      hourlyRate,
      facilities
    } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    const admin = await Admin.create(req.body);

    // Initialize stats for the new admin
    await Stats.create({
      admin: admin._id,
      adminUsername: admin.username,
      twoWheelerSpaces: parseInt(twoWheelerSpaces) || 0,
      fourWheelerSpaces: parseInt(fourWheelerSpaces) || 0,
      totalSpaces: parseInt(twoWheelerSpaces || 0) + parseInt(fourWheelerSpaces || 0),
      availableTwoWheelerSpaces: parseInt(twoWheelerSpaces) || 0,
      availableFourWheelerSpaces: parseInt(fourWheelerSpaces) || 0
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      adminId: admin._id,
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register admin' });
  }
});

// Get parking spots by location
router.get('/parking-spots', async (req, res) => {
  try {
    const { location } = req.query;

    // Find all admins/parking spots
    const parkingSpots = await Admin.find(
      { city: new RegExp(location, 'i') }, // Case-insensitive search
      {
        parkingName: 1,
        parkingAddress: 1,
        city: 1,
        state: 1,
        parkingType: 1,
        category: 1,
        twoWheelerSpaces: 1,
        fourWheelerSpaces: 1,
        hourlyRate: 1,
        facilities: 1,
        latitude: 1,
        longitude: 1,
        username: 1
      }
    );

    res.json(parkingSpots);
  } catch (error) {
    console.error('Error fetching parking spots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Admin Profile

router.get('/profile/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin profile',
      error: error.message
    });
  }
});

// Get admin stats by username/email
router.get('/stats/:username', protect, async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username).trim();
    console.log('Fetching stats for username/email:', username);

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!admin) {
      console.log('Admin not found for:', username);
      return res.status(404).json({ message: 'Admin not found' });
    }

    console.log('Found admin:', admin.email);

    // Get stats by admin username/email
    const stats = await Stats.findOne({
      $or: [
        { adminUsername: admin.username },
        { adminUsername: admin.email }
      ]
    });

    console.log('Found stats:', stats);

    if (!stats) {
      // Return default stats if none exist
      const defaultStats = {
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
      };
      console.log('Returning default stats:', defaultStats);
      return res.json(defaultStats);
    }

    // Return actual stats
    const responseStats = {
      totalSpaces: {
        twoWheeler: admin.twoWheelerSpaces || 0,
        fourWheeler: admin.fourWheelerSpaces || 0
      },
      availableSpaces: stats.availableSpaces || {
        twoWheeler: admin.twoWheelerSpaces || 0,
        fourWheeler: admin.fourWheelerSpaces || 0
      },
      revenue: stats.revenue || 0,
      activeBookings: stats.activeBookings || []
    };

    console.log('Returning stats:', responseStats);
    res.json(responseStats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Get bookings for admin's parking area
router.get('/bookings/:adminId', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const bookings = await Booking.find({ 
      'location.adminUsername': admin.username 
    })
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'vehicle',
      select: 'makeModel licensePlate type'
    })
    .sort({ createdAt: -1 });

    // Process the bookings to ensure all required data is present
    const processedBookings = bookings.map(booking => {
      // Get vehicle details either from populated vehicle or from booking.vehicle
      const vehicleDetails = booking.vehicle || booking.vehicleDetails || {};
      
      return {
        ...booking.toObject(),
        userName: booking.user?.name || booking.userName || 'N/A',
        userEmail: booking.user?.email || booking.userEmail || 'N/A',
        // Handle vehicle details with priority to populated vehicle
        vehicleType: vehicleDetails.type || 'N/A',
        vehicleNumber: vehicleDetails.licensePlate || 'N/A',
        vehicleMakeModel: vehicleDetails.makeModel || 'N/A',
        startDateTime: booking.startDateTime || booking.from || booking.date,
        endDateTime: booking.endDateTime || booking.to || 
          (booking.date && booking.duration ? 
            new Date(new Date(booking.date).getTime() + (booking.duration * 60 * 60 * 1000)).toISOString() 
            : null),
        duration: booking.duration || 0,
        total: parseFloat(booking.total || 0),
        location: {
          name: booking.location?.name || 'N/A',
          address: booking.location?.address || 'N/A',
          adminUsername: admin.username
        }
      };
    });

    res.json(processedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get admin bookings
router.get('/admin-bookings/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;
    const bookings = await Booking.find({ adminId })
      .sort({ createdAt: -1 }) // Most recent first
      .populate('userId', 'name email'); // Get user details

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this route handler
router.post('/offline-booking', async (req, res) => {
  try {
    const {
      vehicleType,
      duration,
      date,
      startDateTime,
      endDateTime,
      adminId,
      adminEmail,
      parkingName,
      parkingAddress,
      spotRate,
      total,
      isOffline,
      status,
      vehicleDetails
    } = req.body;

    // Find the admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Create new booking with all required fields
    const booking = new Booking({
      date: new Date(date),
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      duration: parseInt(duration),
      admin: adminId,
      user: adminId,
      vehicle: adminId,
      vehicleDetails: {
        category: vehicleType,
        makeModel: 'Offline Vehicle',
        licensePlate: 'OFFLINE'
      },
      location: {
        name: parkingName,
        address: parkingAddress,
        adminEmail,
        adminUsername: admin.username
      },
      spotRate: admin.hourlyRate,
      total: admin.hourlyRate * parseInt(duration),
      isOffline: true,
      status: 'Active',
      userName: 'Offline Customer'
    });

    const savedBooking = await booking.save();
    console.log('Saved booking:', savedBooking);

    // Update stats with proper activeBooking data
    const stats = await Stats.findOne({ admin: adminId });
    if (stats) {
      stats.activeBookings.push({
        bookingId: savedBooking._id.toString(),
        vehicleId: savedBooking.vehicle,
        userId: savedBooking.user,
        vehicleType: vehicleType,
        amount: savedBooking.total,
        startTime: new Date(startDateTime),
        endTime: new Date(endDateTime),
        duration: parseInt(duration)
      });

      stats.revenue += savedBooking.total;
      const spaceType = vehicleType === 'two-wheeler' ? 'twoWheeler' : 'fourWheeler';
      stats.availableSpaces[spaceType] = Math.max(0, stats.availableSpaces[spaceType] - 1);

      await stats.save();
    }

    // Create response object with properly formatted dates
    const responseData = {
      ...savedBooking.toObject(),
      _id: savedBooking._id.toString(),
      bookingId: savedBooking._id.toString(),
      date: savedBooking.date?.toISOString(),
      startDateTime: savedBooking.startDateTime?.toISOString(),
      endDateTime: savedBooking.endDateTime?.toISOString(),
      total: admin.hourlyRate * parseInt(duration)
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error creating offline booking:', error);
    res.status(500).json({ message: error.message || 'Failed to create booking' });
  }
});

// Add this route to get admin data
router.get('/:adminId', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Error fetching admin data' });
  }
});

// Update the cleanup route
router.post('/cleanup-stats/:adminId', async (req, res) => {
  try {
    // First, do a complete cleanup
    const cleanedStats = await Stats.cleanupAndInitialize(req.params.adminId);
    if (!cleanedStats) {
      return res.status(404).json({ message: 'Stats not found' });
    }

    // Get all active bookings for this admin
    const admin = await Admin.findById(req.params.adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Get all active bookings
    const activeBookings = await Booking.find({
      admin: admin._id,
      status: 'Active'
    });

    // Re-add all valid active bookings
    for (const booking of activeBookings) {
      cleanedStats.activeBookings.push({
        bookingId: booking._id.toString(),
        vehicleId: booking.vehicle,
        userId: booking.user,
        vehicleType: booking.vehicleDetails?.category || 'four-wheeler',
        amount: booking.total,
        startTime: booking.startDateTime,
        endTime: booking.endDateTime,
        duration: booking.duration,
        isOffline: booking.isOffline || false
      });

      // Update revenue
      cleanedStats.revenue += booking.total;
    }

    await cleanedStats.save();
    res.json({ message: 'Stats cleaned up and reinitialized successfully' });
  } catch (error) {
    console.error('Error cleaning up stats:', error);
    res.status(500).json({ message: 'Error cleaning up stats: ' + error.message });
  }
});

// Update the updateStats route
router.post('/updateStats/:adminUsername', async (req, res) => {
  try {
    const { adminUsername } = req.params;
    const bookingData = req.body;

    console.log('Updating stats for admin:', adminUsername);

    const stats = await Stats.updateOnBooking(adminUsername, bookingData);
    res.json(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ 
      message: 'Error updating stats: ' + error.message,
      details: error.errors || error,
      adminUsername: req.params.adminUsername // Include this for debugging
    });
  }
});

module.exports = router;
