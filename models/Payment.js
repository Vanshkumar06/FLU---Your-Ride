const mongoose = require('mongoose');

// Payment ka schema define kar rahe hain - har payment ka record yahan store hoga
const paymentSchema = new mongoose.Schema({

    // Kis booking ka payment hai
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },

    // Kisne payment ki hai
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Razorpay ka unique payment ID - verification ke liye
    razorpayPaymentId: {
        type: String,
        default: ''
    },

    // Razorpay ka order ID
    razorpayOrderId: {
        type: String,
        default: ''
    },

    // Payment method - online ya wallet
    paymentMethod: {
        type: String,
        enum: ['online', 'wallet', 'both'],
        default: 'online'
    },

    // Payment ka status - pending, completed, failed
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },

    // Payment ka total amount
    amount: {
        type: Number,
        required: true
    },

    // Wallet se kitna amount use hua agar kiya ho
    walletAmountUsed: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);