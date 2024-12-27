const express = require('express');
const router = express.Router();

const Admin = require('../models/Admin');

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

    console.log('Received registration request:', req.body);



    // Convert string numbers to actual numbers

    const formData = {

      ...req.body,

      totalSpaces: Number(req.body.totalSpaces),

      twoWheelerSpaces: Number(req.body.twoWheelerSpaces),

      fourWheelerSpaces: Number(req.body.fourWheelerSpaces),

      hourlyRate: Number(req.body.hourlyRate)

    };



    // Validate email format

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {

      return res.status(400).json({

        success: false,

        message: 'Please enter a valid email address'

      });

    }



    // Check if email already exists

    const existingEmail = await Admin.findOne({ email: formData.email.toLowerCase() });

    if (existingEmail) {

      return res.status(400).json({

        success: false,

        message: 'Email already registered'

      });

    }



    // Check if username already exists

    const existingUsername = await Admin.findOne({ username: formData.username });

    if (existingUsername) {

      return res.status(400).json({

        success: false,

        message: 'Username already taken'

      });

    }



    // Create new admin with all fields

    const admin = new Admin({

      // Personal Information

      fullName: formData.fullName,

      phone: formData.phone,

      address: formData.address,

      city: formData.city,

      state: formData.state,

      zipCode: formData.zipCode,



      // Credentials

      email: formData.email.toLowerCase(),

      username: formData.username,

      password: formData.password,



      // Parking Details

      parkingName: formData.parkingName,

      parkingType: formData.parkingType,

      category: formData.category,

      parkingAddress: formData.parkingAddress,

      totalSpaces: formData.totalSpaces,

      twoWheelerSpaces: formData.twoWheelerSpaces,

      fourWheelerSpaces: formData.fourWheelerSpaces,

      hourlyRate: formData.hourlyRate,



      // Security and Access

      securityMeasures: formData.securityMeasures,

      accessHours: formData.accessHours,

      emergencyContact: formData.emergencyContact,



      // Verification Details

      idType: formData.idType,

      idNumber: formData.idNumber,

      businessType: formData.businessType,

      verificationConsent: formData.verificationConsent,

      termsAccepted: formData.termsAccepted

    });



    await admin.save();



    // Generate JWT token

    const token = jwt.sign(

      { id: admin._id, role: 'admin' },

      process.env.JWT_SECRET || 'your-fallback-secret',

      { expiresIn: '24h' }

    );



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

      message: error.message || 'Registration failed. Please try again.'

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

