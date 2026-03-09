const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const User = require('../models/User');
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    console.log('TOKEN RECEIVED:', token.substring(0, 20) + '...');  // YE ADD KARO

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      console.log('Firebase UID:', decoded.uid);  // YE ADD KARO
      const user = await User.findOne({ firebaseUid: decoded.uid });
      console.log('User found:', user ? user.email : 'NOT FOUND');  // YE ADD KARO
      if (!user) return res.status(404).json({ message: 'User not found' });
      req.user = { id: user._id, email: user.email };
      next();
    } catch(firebaseErr) {
      console.log('Firebase error:', firebaseErr.message);  // YE ADD KARO
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    }
  } catch (error) {
    console.log('Auth error:', error.message);  // YE ADD KARO
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };