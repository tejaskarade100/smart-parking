const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
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

    const { vehicleId, location, phone, total, duration } = req.body;

    // Log validation data
    console.log('Validation Data:', {
      hasVehicleId: Boolean(vehicleId),
      hasLocation: Boolean(location),
      locationName: location?.name,
      hasTotal: Boolean(total),
      totalValue: total,
      hasDuration: Boolean(duration),
      durationValue: duration
    });

    // Validate input
    if (!vehicleId) {
      return res.status(400).json({ message: 'Vehicle ID is required' });
    }
    if (!location?.name) {
      return res.status(400).json({ message: 'Location name is required' });
    }
    if (!total || isNaN(Number(total))) {
      return res.status(400).json({ message: 'Valid total amount is required' });
    }
    if (!duration || isNaN(Number(duration))) {
      return res.status(400).json({ message: 'Valid duration is required' });
    }

    // Verify vehicle exists and belongs to user
    console.log('Verifying vehicle:', vehicleId);
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      user: req.user.id
    }).lean();

    console.log('Found vehicle:', vehicle);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or does not belong to user' });
    }

    // Create booking object
    const bookingData = {
      user: req.user.id,
      vehicle: vehicleId,
      location: {
        name: location.name,
        address: location.address || '',
        coordinates: {
          lat: location.lat || null,
          lng: location.lng || null
        }
      },
      date: new Date(),
      duration: Number(duration),
      total: Number(total),
      phone: phone?.trim() || '',
      status: 'Active',
      paymentStatus: 'Paid'
    };

    console.log('Creating booking with data:', bookingData);

    // Create booking
    const booking = await Booking.create(bookingData);
    console.log('Booking created:', booking);

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle', 'makeModel licensePlate')
      .populate('user', 'email')
      .lean();

    console.log('Populated booking:', populatedBooking);

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('=== Booking Creation Error ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    if (error.code === 11000) {
      // Retry once with a new booking reference
      try {
        console.log('Retrying booking creation with new reference...');
        const booking = await Booking.create({
          ...req.body,
          user: req.user.id,
          bookingReference: `BK${Date.now()}${Math.floor(Math.random() * 10000)}`
        });
        
        const populatedBooking = await Booking.findById(booking._id)
          .populate('vehicle', 'makeModel licensePlate')
          .populate('user', 'email')
          .lean();

        return res.status(201).json(populatedBooking);
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return res.status(500).json({ message: 'Failed to create booking' });
      }
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.log('Validation error messages:', messages);
      return res.status(400).json({ message: messages.join(', ') });
    }

    if (error.name === 'CastError') {
      console.log('Cast error details:', error);
      return res.status(400).json({ message: 'Invalid data format' });
    }

    res.status(500).json({ message: 'Failed to create booking' });
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
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('vehicle', 'makeModel licensePlate');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
});

module.exports = router;
