const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

// Users management
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

router.put('/users/:id/role', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  res.json(user);
});

// Analytics for dashboard charts
router.get('/analytics', async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalReviews = await Review.countDocuments();

  const topViewed = await Product.find().sort('-views').limit(5).select('name views');
  const topRated = await Product.find().sort('-averageRating').limit(5).select('name averageRating');

  const usersByMonth = await User.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({ totalUsers, totalProducts, totalReviews, topViewed, topRated, usersByMonth });
});

module.exports = router;
