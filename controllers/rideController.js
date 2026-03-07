const Ride = require('../models/Ride');
const User = require('../models/User');
const Booking = require('../models/Booking');

// ── Ride publish karna ──
const publishRide = async (req, res) => {
    try {
        const {
            from,
            to,
            date,
            departureTime,
            availableSeats,
            pricePerSeat,
            distanceKm,
            duration,
            amenities,
            note
        } = req.body;

        // Ride create karo — frontend ke field names match karte hain
        const ride = await Ride.create({
            driverId:       req.user.id,
            fromLocation:   from,
            toLocation:     to,
            date:           date,
            departureTime:  departureTime,
            seatsAvailable: availableSeats,
            pricePerSeat:   pricePerSeat,
            distanceKm:     distanceKm   || null,
            duration:       duration     || null,
            amenities:      amenities    || {},
            note:           note         || '',
            rideStatus:     'active'
        });

        // Driver ke ridesPublished array + ridesThisMonth increment
        await User.findByIdAndUpdate(req.user.id, {
            $push: { ridesPublished: ride._id },
            $inc:  { ridesThisMonth: 1 }
        });

        res.status(201).json({
            message: 'Ride published successfully',
            ride
        });

    } catch (error) {
        console.error('publishRide error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Rides search karna ──
const searchRides = async (req, res) => {
    try {
        // Frontend dono formats use karta hai — handle karo dono
        const from = req.query.from || req.query.fromLocation;
        const to   = req.query.to   || req.query.toLocation;
        const date = req.query.date;

        const query = {
            rideStatus:     'active',
            seatsAvailable: { $gt: 0 }
        };

        if (from) query.fromLocation = { $regex: from, $options: 'i' };
        if (to)   query.toLocation   = { $regex: to,   $options: 'i' };
        if (date) query.date         = date;

        const rides = await Ride.find(query)
            .populate('driverId', 'name profilePicture phoneNumber')
            .sort({ createdAt: -1 });

        res.status(200).json(rides);

    } catch (error) {
        console.error('searchRides error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Single ride details ──
const getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('driverId', 'name profilePicture phoneNumber')
            .populate('passengers', 'name profilePicture');

        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        res.status(200).json({ ride });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── User ki published rides ──
const getPublishedRides = async (req, res) => {
    try {
        const rides = await Ride.find({ driverId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({ message: 'Published rides fetched', rides });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── User ki booked rides ──
const getBookedRides = async (req, res) => {
    try {
        const bookings = await Booking.find({ passengerId: req.user.id })
            .populate({
                path: 'rideId',
                populate: { path: 'driverId', select: 'name profilePicture phoneNumber' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ message: 'Booked rides fetched', bookings });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Ride cancel karna ──
const cancelRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        if (ride.driverId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to cancel this ride' });
        }

        // Fine logic — 2nd+ cancellation this month
        const user = await User.findById(req.user.id);
        user.cancellationsThisMonth = (user.cancellationsThisMonth || 0) + 1;

        if (user.cancellationsThisMonth > 1) {
            // Deduct ₹100 from wallet — Platform Compensation Fund
            user.walletBalance = (user.walletBalance || 0) - 100;
            // TODO: Send email to all booked passengers (use nodemailer)
        }

        await user.save();

        ride.rideStatus = 'cancelled';
        await ride.save();

        res.status(200).json({
            message: 'Ride cancelled successfully',
            fineApplied: user.cancellationsThisMonth > 1,
            newWalletBalance: user.walletBalance
        });

    } catch (error) {
        console.error('cancelRide error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    publishRide,
    searchRides,
    getRideById,
    getPublishedRides,
    getBookedRides,
    cancelRide
};