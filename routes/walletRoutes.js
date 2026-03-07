const express = require('express');
const router = express.Router();
const {
    getWalletBalance,
    getTransactionHistory,
    addCashback,
    redeemWallet
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

// Wallet balance dekhne ka route - sirf logged in user kar sakta hai
router.get('/balance', protect, getWalletBalance);

// Transaction history dekhne ka route - sirf logged in user kar sakta hai
router.get('/transactions', protect, getTransactionHistory);

// Cashback add karne ka route - ride complete hone par call hoga
router.post('/cashback', protect, addCashback);

// Wallet redeem karne ka route - Razorpay se payout hoga
router.post('/redeem', protect, redeemWallet);

// GET /api/wallet  → user ka walletBalance return karo
// POST /api/wallet/withdraw → deduct balance, Razorpay payout trigger
router.get('/wallet', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ walletBalance: user.walletBalance || 0 });
});

module.exports = router;