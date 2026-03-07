const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    // Firebase Integration
    firebaseUid: { 
        type: String, 
        unique: true, 
        sparse: true 
    },

    password: {
        type: String,
        required: false // Firebase users ke liye optional
    },

    phoneNumber: {
        type: String,
        trim: true
    },

    profilePicture: {
        type: String,
        default: ''
    },

    // Published aur booked rides
    ridesPublished: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride'
    }],

    ridesBooked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],

    // FLU Wallet
    walletBalance: {
        type: Number,
        default: 0
    },

    // ── Subscription & publish tracking ──

    // null = free tier, 'basic' | 'standard' | 'unlimited'
    subscription: {
        type: String,
        enum: ['basic', 'standard', 'unlimited'],
        default: null
    },

    // Kitni rides is mahine publish ki hain
    ridesThisMonth: {
        type: Number,
        default: 0
    },

    // Kitni baar is mahine cancel kiya — 2nd+ pe ₹100 fine
    cancellationsThisMonth: {
        type: Number,
        default: 0
    },

    // Last time monthly counts reset hue the
    lastMonthReset: {
        type: Date,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);