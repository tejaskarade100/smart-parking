const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Stats = require('../models/Stats');
const Admin = require('../models/Admin'); // Added Admin model
const protect = require('../middleware/auth');

// Middleware to protect routes
// const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id: decoded.userId };
//     next();
//   } catch (error) {
//     console.error('Auth error:', error);
//     res.status(401).json({ message: 'Not authorized' });
//   }
// };

// Get user's vehicles
router.get('/vehicles', protect, async (req, res) => {
  try {
    console.log('Fetching vehicles for user:', req.user.id);
    const vehicles = await Vehicle.find({ user: req.user.id });
    console.log('Found vehicles:', vehicles);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Failed to fetch vehicles' });
  }
});

// Add a vehicle
router.post('/vehicles', protect, async (req, res) => {
  try {
    console.log('Adding vehicle for user:', req.user.id);
    console.log('Vehicle data:', req.body);

    const { makeModel, licensePlate, state } = req.body;

    // Validate input
    if (!makeModel?.trim() || !licensePlate?.trim() || !state?.trim()) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if vehicle exists
    const existingVehicle = await Vehicle.findOne({ 
      licensePlate: licensePlate.trim().toUpperCase() 
    });
    
    if (existingVehicle) {
      return res.status(400).json({ 
        message: 'A vehicle with this license plate is already registered' 
      });
    }

    // Create vehicle with standardized data
    const vehicle = await Vehicle.create({
      user: req.user.id,
      makeModel: makeModel.trim(),
      licensePlate: licensePlate.trim().toUpperCase(),
      state: state.trim().toUpperCase()
    });

    console.log('Vehicle created:', vehicle);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error adding vehicle:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A vehicle with this license plate is already registered' 
      });
    }
    res.status(500).json({ message: 'Failed to add vehicle' });
  }
});

// Delete a vehicle
router.delete('/vehicles/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Failed to delete vehicle' });
  }
});

// Create a booking
router.post('/bookings', protect, async (req, res) => {
  try {
    console.log('=== Creating New Booking ===');
    console.log('User:', req.user);
    console.log('Request body:', req.body);

    const { vehicleId, location, phone, total, duration, startDateTime, endDateTime, adminId } = req.body;

    // Get admin username from location data
    const adminUsername = location.adminUsername?.replace(/^@/, '').trim();
    if (!adminUsername) {
      throw new Error('Admin username is required');
    }

    console.log('Looking up admin with username/email:', adminUsername);

    // Find admin to confirm they exist
    const admin = await Admin.findOne({
      $or: [
        { username: adminUsername },
        { email: adminUsername }
      ]
    });

    if (!admin) {
      throw new Error(`Admin not found with username/email: ${adminUsername}`);
    }

    // Create booking object
    const bookingData = {
      user: req.user.id,
      vehicle: vehicleId,
      admin: admin._id, // Use found admin's ID
      vehicleType: req.body.vehicleType || 'four-wheeler', // Default to four-wheeler if not specified
      location: {
        name: location.name,
        address: location.address || '',
        adminUsername: admin.username || admin.email, // Use found admin's username/email
        coordinates: {
          lat: location.coordinates?.lat || null,
          lng: location.coordinates?.lng || null
        },
        spotRate: location.spotRate
      },
      date: new Date(),
      startTime: new Date(startDateTime),
      endTime: new Date(endDateTime),
      duration: duration,
      total: total,
      phone: phone?.trim() || '',
      status: 'Active',
      paymentStatus: 'Paid'
    };

    // Create booking
    const booking = await Booking.create(bookingData);
    console.log('Booking created:', booking);

    // Update admin stats using found admin's username/email
    await Stats.updateOnBooking(admin.username || admin.email, {
      bookingId: booking._id,
      vehicleId: booking.vehicle,
      userId: booking.user,
      vehicleType: bookingData.vehicleType,
      amount: bookingData.total,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      duration: bookingData.duration,
      phone: bookingData.phone,
      location: {
        name: location.name,
        address: location.address || '',
        coordinates: {
          lat: location.coordinates?.lat || null,
          lng: location.coordinates?.lng || null
        },
        spotRate: location.spotRate
      }
    });

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle', 'makeModel licensePlate')
      .populate('admin', 'username email')
      .lean();

    console.log('Populated booking:', populatedBooking);

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('=== Booking Creation Error ===');
    console.error('Error details:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === 'CastError') {
      console.log('Cast error details:', error);
      return res.status(400).json({ message: 'Invalid data format' });
    }
    res.status(500).json({ message: error.message || 'Failed to create booking' });
  }
});

// Get user's bookings
router.get('/bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('vehicle', 'makeModel licensePlate')
      .sort({ createdAt: -1 }); // Most recent first

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Get a specific booking
router.get('/bookings/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle', 'makeModel licensePlate')
      .populate('admin', 'username email')
      .lean();

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If admin username is not in location, add it from populated admin
    if (booking.admin && booking.admin.username && !booking.location.adminUsername) {
      booking.location.adminUsername = booking.admin.username;
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
});

module.exports = router;
