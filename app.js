const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const walletRoutes = require('./routes/walletRoutes');

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/wallet', walletRoutes);

//Ride History
app.get('/history', (req, res) => res.render('history'));

// View Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Auth Views
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Ride Views
app.get('/rides/search', (req, res) => {
    res.render('rides/search');
});

app.get('/rides/publish', (req, res) => {
    res.render('rides/publish');
});

// Wallet View
app.get('/wallet', (req, res) => {
    res.render('wallet');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`FLU Server running on port ${PORT}`);
});