const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');

// Razorpay baad mein integrate karenge jab frontend ready hoga
// const Razorpay = require('razorpay');

// User ka wallet balance dekhna
const getWalletBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('walletBalance');

        res.status(200).json({
            message: 'Wallet balance fetched',
            walletBalance: user.walletBalance
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Wallet ki transaction history dekhna
const getTransactionHistory = async (req, res) => {
    try {
        const transactions = await WalletTransaction.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Transaction history fetched',
            transactions
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Ride complete hone par cashback add karna - 0.5 rupee per kilometer
const addCashback = async (req, res) => {
    try {
        const { rideId, distance } = req.body;

        // 0.5 rupee per kilometer ke hisaab se cashback calculate kar rahe hain
        const cashbackAmount = distance * 0.5;

        // User ke wallet mein cashback add kar rahe hain
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { walletBalance: cashbackAmount }
        });

        // Transaction ka record create kar rahe hain
        await WalletTransaction.create({
            userId: req.user.id,
            transactionType: 'cashback',
            amount: cashbackAmount,
            rideId: rideId,
            description: `Cashback for ${distance}km ride`,
            status: 'success'
        });

        res.status(200).json({
            message: 'Cashback added successfully',
            cashbackAmount
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Wallet balance redeem karna - Razorpay baad mein lagayenge
const redeemWallet = async (req, res) => {
    try {
        const { amount } = req.body;

        const user = await User.findById(req.user.id);

        // Check karo ki wallet mein itna balance hai ya nahi
        if (user.walletBalance < amount) {
            return res.status(400).json({ message: 'Insufficient wallet balance' });
        }

        // Wallet se amount deduct kar rahe hain
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { walletBalance: -amount }
        });

        // Transaction ka record create kar rahe hain
        await WalletTransaction.create({
            userId: req.user.id,
            transactionType: 'redemption',
            amount: amount,
            description: `Wallet redemption of Rs.${amount}`,
            status: 'success'
        });

        res.status(200).json({
            message: 'Wallet redeemed successfully'
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getWalletBalance,
    getTransactionHistory,
    addCashback,
    redeemWallet
};