const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Access Denied. No Token Provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or Expired Token.' });
  }
};

const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied. Admins Only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error Verifying Role.', error: err.message });
  }
};
const authorizeOrganizer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'organizer') {
      return res.status(403).json({ message: 'Access Denied. Organizers Only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error Verifying Role.', error: err.message });
  }
};

module.exports = { authenticateToken, authorizeAdmin ,authorizeOrganizer };
