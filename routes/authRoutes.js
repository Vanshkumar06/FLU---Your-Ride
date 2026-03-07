const express = require('express');
const router = express.Router();
const { registerUser, loginUser, firebaseAuth } = require('../controllers/authController');
const { firebaseSync } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
router.post('/firebase-sync', protect, firebaseSync);

// Naya user register karne ka route
router.post('/register', registerUser);

// Existing user login karne ka route
router.post('/login', loginUser);

// Firebase se aane wale user ka route
router.post('/firebase', firebaseAuth);

module.exports = router;