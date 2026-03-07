const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Frontend 'from' → stored as fromLocation
    fromLocation: {
        type: String,
        required: true,
        trim: true
    },

    // Frontend 'to' → stored as toLocation
    toLocation: {
        type: String,
        required: true,
        trim: true
    },

    date: {
        type: String, // "2026-03-10" format
        required: true
    },

    departureTime: {
        type: String, // "08:30" format
        required: true
    },

    seatsAvailable: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },

    pricePerSeat: {
        type: Number,
        required: true,
        min: 10
    },

    // From distances.json — auto calculated
    distanceKm: {
        type: Number,
        default: null
    },

    // e.g. "~1h 43m"
    duration: {
        type: String,
        default: null
    },

    // AC, music, luggage, ladies
    amenities: {
        ac:      { type: Boolean, default: false },
        music:   { type: Boolean, default: false },
        luggage: { type: Boolean, default: false },
        ladies:  { type: Boolean, default: false }
    },

    // Driver ka optional note for passengers
    note: {
        type: String,
        default: ''
    },

    rideStatus: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },

    passengers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);