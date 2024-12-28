const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user or admin exists
    let user = null;
    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.userId);
    } else {
      user = await User.findById(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user info to request
    req.user = { 
      id: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = protect;
