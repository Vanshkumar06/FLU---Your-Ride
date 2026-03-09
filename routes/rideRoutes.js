const express = require('express');
const router = express.Router();
const {
    publishRide,
    searchRides,
    getRideById,
    getPublishedRides,
    getBookedRides,
    cancelRide,
    getDriverStatus
} = require('../controllers/rideController');

const { protect } = require('../middleware/auth');

// ── Subscription check middleware ──
const checkPublishLimit = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Reset monthly count if new month
        const now       = new Date();
        const lastReset = user.lastMonthReset ? new Date(user.lastMonthReset) : null;
        if (!lastReset || lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
            user.ridesThisMonth         = 0;
            user.cancellationsThisMonth = 0;
            user.lastMonthReset         = now;
            await user.save();
        }

        // Free tier: allow first 3 rides, block after
        if (!user.subscription && user.ridesThisMonth >= 3) {
            return res.status(402).json({
                message: 'Free ride limit reached. Please subscribe to publish more rides.',
                ridesThisMonth: user.ridesThisMonth,
                subscription: null
            });
        }

        // Subscribed: check plan limits
        if (user.subscription === 'basic' && user.ridesThisMonth >= 5) {
            return res.status(402).json({
                message: 'Basic plan limit (5 rides/month) reached. Upgrade to Standard or Unlimited.',
                ridesThisMonth: user.ridesThisMonth,
                subscription: user.subscription
            });
        }

        if (user.subscription === 'standard' && user.ridesThisMonth >= 15) {
            return res.status(402).json({
                message: 'Standard plan limit (15 rides/month) reached. Upgrade to Unlimited.',
                ridesThisMonth: user.ridesThisMonth,
                subscription: user.subscription
            });
        }

        // 'unlimited' plan — no limit
        next();

    } catch (err) {
        console.error('checkPublishLimit error:', err);
        res.status(500).json({ message: 'Server error checking publish limit' });
    }
};

// ── Driver status ──
router.get('/driver/status', protect, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        const now       = new Date();
        const lastReset = user.lastMonthReset ? new Date(user.lastMonthReset) : null;
        if (!lastReset || lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
            user.ridesThisMonth         = 0;
            user.cancellationsThisMonth = 0;
            user.lastMonthReset         = now;
            await user.save();
        }

        const limitMap = { basic: 5, standard: 15, unlimited: Infinity };

        res.json({
            ridesThisMonth:         user.ridesThisMonth         || 0,
            cancellationsThisMonth: user.cancellationsThisMonth || 0,
            subscription:           user.subscription           || null,
            subscriptionRidesLimit: user.subscription ? (limitMap[user.subscription] || 0) : 3
        });
    } catch (err) {
        console.error('driver/status error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ── Public Routes ──
router.get('/search', searchRides);

// ── Protected Routes ──
router.post('/publish',       protect, checkPublishLimit, publishRide);
router.get('/user/published', protect, getPublishedRides);
router.get('/user/booked',    protect, getBookedRides);
router.put('/cancel/:id',     protect, cancelRide);

// ── ID route SABSE NEECHE (warna /driver/status, /search etc. match ho jaate) ──
router.get('/:id', getRideById);

module.exports = router;