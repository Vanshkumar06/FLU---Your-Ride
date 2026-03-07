const mongoose = require('mongoose');

// Wallet Transaction ka schema define kar rahe hain - har cashback aur redemption ka record yahan store hoga
const walletTransactionSchema = new mongoose.Schema({

    // Kis user ka transaction hai
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Transaction ka type - cashback mila ya redeem kiya
    transactionType: {
        type: String,
        enum: ['cashback', 'redemption'],
        required: true
    },

    // Transaction ka amount
    amount: {
        type: Number,
        required: true
    },

    // Kis ride ke liye cashback mila - optional field
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        default: null
    },

    // Transaction ki description - jaise "Cashback for 10km ride"
    description: {
        type: String,
        trim: true,
        default: ''
    },

    // Transaction ka status - success ya failed
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    }

}, { timestamps: true });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);