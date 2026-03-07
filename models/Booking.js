const mongoose = require('mongoose');

// Booking ka schema define kar rahe hain - jab bhi koi user ride book karega to yahan record banega
const bookingSchema = new mongoose.Schema({

    // Kis ride ki booking hai
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true
    },

    // Kisne book ki hai ride
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Kitni seats book ki hain
    seatsBooked: {
        type: Number,
        required: true,
        min: 1
    },

    // Booking ka total amount
    totalAmount: {
        type: Number,
        required: true
    },

    // Booking ka status - pending, confirmed, cancelled
    bookingStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },

    // Payment ka status - pending, completed, failed
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);