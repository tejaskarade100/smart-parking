const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  makeModel: {
    type: String,
    required: [true, 'Please provide make and model'],
    trim: true,
    minlength: [2, 'Make and model must be at least 2 characters long'],
    maxlength: [50, 'Make and model cannot exceed 50 characters']
  },
  licensePlate: {
    type: String,
    required: [true, 'Please provide license plate number'],
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [2, 'License plate must be at least 2 characters long'],
    maxlength: [15, 'License plate cannot exceed 15 characters']
  },
  state: {
    type: String,
    required: [true, 'Please provide state'],
    trim: true,
    uppercase: true,
    minlength: [2, 'State must be at least 2 characters long'],
    maxlength: [2, 'State must be exactly 2 characters']
  }
}, {
  timestamps: true
});

// Pre-save middleware to clean data
vehicleSchema.pre('save', function(next) {
  this.makeModel = this.makeModel.trim();
  this.licensePlate = this.licensePlate.trim().toUpperCase();
  this.state = this.state.trim().toUpperCase();
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
