const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Admin Registration
router.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { email: req.body.username }, // Using username as email
        { username: req.body.username }
      ]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email or username already exists'
      });
    }

    // Create new admin with email set to username
    const adminData = {
      ...req.body,
      email: req.body.username, // Set email to username since we're using email as username
      phoneNumber: req.body.phone // Map phone to phoneNumber
    };

    const admin = new Admin(adminData);
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET || 'your-fallback-secret',
      { expiresIn: '24h' }
    );

    console.log('Admin registered successfully:', admin._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      adminId: admin._id
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration: ' + error.message,
      error: error.message
    });
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

module.exports = router;
