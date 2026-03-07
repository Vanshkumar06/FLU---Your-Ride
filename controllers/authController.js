const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register - naya user banana
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        // Check karo ki email pehle se exist toh nahi karti
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Password ko hash kar rahe hain - security ke liye
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user create kar rahe hain
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber
        });

        // JWT token generate kar rahe hain - login session ke liye
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login - existing user ka login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // User ko email se dhundh rahe hain
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Password match kar rahe hain
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // JWT token generate kar rahe hain
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Firebase se aane wale user ko handle kar rahe hain
const firebaseAuth = async (req, res) => {
    try {
        const { name, email, profilePicture } = req.body;

        // Pehle check karo user exist karta hai ya nahi
        let user = await User.findOne({ email });

        // Agar nahi karta toh naya user create karo
        if (!user) {
            user = await User.create({
                name,
                email,
                profilePicture,
                password: null
            });
        }

        // JWT token generate kar rahe hain
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Firebase authentication successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Firebase data sync karne ke liye
const firebaseSync = async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const firebaseUid = req.user.id; // Yeh middleware se aayega
  
      let user = await User.findOne({ firebaseUid });
  
      if (!user) {
        // Email se bhi check karo
        user = await User.findOne({ email });
        if (user) {
          user.firebaseUid = firebaseUid;
          await user.save();
        } else {
          user = await User.create({
            firebaseUid,
            name,
            email,
            phoneNumber: phone || '',
            walletBalance: 0
          });
        }
      }
  
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

module.exports = { registerUser, loginUser, firebaseAuth, firebaseSync };