const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },

  // Credentials
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
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
    required: true,
    trim: true
  },
  parkingType: {
    type: String,
    required: true,
    enum: ['commercial', 'residential', 'event']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Operators',
      'Monthly/Long-term Partners',
      'Airport/Railway/Bus Stand Operators',
      'Event and Venue Partnerships',
      'Municipalities',
      'Property Managers',
      'Spot Owners (Personal Parking Renters)'
    ]
  },
  parkingAddress: {
    type: String,
    required: true,
    trim: true
  },
  totalSpaces: {
    type: Number,
    required: true,
    min: 0
  },
  twoWheelerSpaces: {
    type: Number,
    required: true,
    min: 0
  },
  fourWheelerSpaces: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },

  // Security and Access
  securityMeasures: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one security measure is required'
    }
  },
  accessHours: {
    type: String,
    required: true,
    trim: true
  },
  emergencyContact: {
    type: String,
    required: true,
    trim: true
  },

  // Verification Details
  idType: {
    type: String,
    required: true,
    enum: ['aadhar', 'pan', 'driving-license', 'passport']
  },
  idNumber: {
    type: String,
    required: true,
    trim: true
  },
  businessType: {
    type: String,
    required: true,
    enum: ['individual', 'company', 'partnership']
  },
  verificationConsent: {
    type: Boolean,
    required: true,
    default: false
  },
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false
  },

  // System Fields
  isApproved: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12); 
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Add this to ensure hourlyRate is always included in the response
adminSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.hourlyRate = ret.hourlyRate || 0;
    return ret;
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
