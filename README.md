# FLU - Your Ride! 

## Project Structure
```
FLU/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── rideController.js
│   └── walletController.js
├── models/
│   ├── User.js
│   ├── Ride.js
│   ├── Booking.js
│   ├── Payment.js
│   └── WalletTransaction.js
├── public/
│   ├── images/
│   ├── styles/
│   └── js/
├── routes/
│   ├── authRoutes.js
│   ├── rideRoutes.js
│   └── walletRoutes.js
├── views/
│   └── partials/
├── .env
├── app.js
└── package.json
```

## Tech Stack
- **Frontend:** EJS, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** Firebase
- **Payment:** Razorpay

## Color Theme
- Primary: Mustard Yellow `#F2C464`
- Secondary: White `#FFFFFF`
- Accent Green: `#34C759`
- Accent Blue: `#3498DB`
- Text: Black `#000000`

## Pages
1. Home Page
2. Book Ride Page
3. View Rides / History Page
4. FLU Wallet Page