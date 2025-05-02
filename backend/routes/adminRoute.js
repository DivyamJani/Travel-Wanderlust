const express = require('express');
const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get dashboard stats
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalHotelOwners = await User.countDocuments({ role: 'hotelOwner' });
    const totalPackages = await Package.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
      totalUsers,
      totalHotelOwners,
      totalPackages,
      totalBookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/all-bookings', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('packageId', 'title destination price')
      .populate({
        path: 'packageId',
        populate: { path: 'createdBy', select: 'name email hotelName hotelLocation' },
      })
      .populate('userId', 'name email');
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;