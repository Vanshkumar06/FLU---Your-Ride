const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Pehle Firebase token try karo, phir JWT
        try {
            const decoded = await admin.auth().verifyIdToken(token);
            req.user = { id: decoded.uid, email: decoded.email };
            next();
        } catch {
            // Firebase fail hua toh purana JWT try karo
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        }

    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };