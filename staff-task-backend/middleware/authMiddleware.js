// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This function checks if a user is logged in. It already exists and is correct.
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.user.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

// --- THIS IS THE MISSING FUNCTION THAT FIXES THE BUG ---
// This middleware checks if the logged-in user is a Manager or an Admin.
exports.isManager = (req, res, next) => {
    if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
        next(); // User has the correct role, proceed to the next step
    } else {
        // If the user is just 'staff' or something else, deny access.
        res.status(403).json({ msg: 'Not authorized. Manager or Admin access required.' });
    }
};

// This function checks if the user is an Admin. It already exists and is correct.
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Not authorized as an admin' });
    }
};