const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');
const { registerUser, loginUser, firebaseAuth, firebaseSync } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Firebase token sirf verify karo — user dhundho mat (pehli baar login ke liye)
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { id: decoded.uid, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Firebase sync — verifyFirebaseToken use karo, protect nahi
router.post('/firebase-sync', verifyFirebaseToken, firebaseSync);

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Firebase auth
router.post('/firebase', firebaseAuth);

module.exports = router;