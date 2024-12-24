const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },

  // Credentials
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },

  // Parking Details
  parkingName: {
    type: String,
    required: true
  },
  parkingType: {
    type: String,
    required: true,
    enum: ['commercial', 'residential', 'event']
  },
  parkingAddress: {
    type: String,
    required: true
  },
  totalSpaces: {
    type: Number,
    required: true
  },
  twoWheelerSpaces: {
    type: Number,
    required: true
  },
  fourWheelerSpaces: {
    type: Number,
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  purposeOfAccess: {
    type: String,
    required: true
  },
  additionalComments: String,

  // Security and Access
  securityMeasures: [{
    type: String,
    enum: ['cctv', 'guards', 'access-control', 'lighting', 'emergency-response']
  }],
  accessHours: {
    type: String,
    required: true
  },
  openTime: String,
  closeTime: String,
  emergencyContact: {
    type: String,
    required: true
  },
  termsAccepted: {
    type: Boolean,
    required: true
  },

  // Verification Details
  idType: {
    type: String,
    required: true,
    enum: ['aadhar', 'pan', 'driving', 'passport']
  },
  idNumber: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true,
    enum: ['individual', 'partnership', 'company', 'other']
  },
  gstNumber: String,
  registrationNumber: String,
  verificationConsent: {
    type: Boolean,
    required: true
  },

  // Status and Timestamps
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
