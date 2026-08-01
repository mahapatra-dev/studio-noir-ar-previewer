const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

async function recalcRating(productId) {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const averageRating = numReviews ? reviews.reduce((s, r) => s + r.rating, 0) / numReviews : 0;
  await Product.findByIdAndUpdate(productId, { averageRating, numReviews });
}

router.get('/product/:productId', async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort('-createdAt');
  res.json(reviews);
});

router.post('/', protect, async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const review = await Review.create({ product, user: req.user.id, rating, comment });
    await recalcRating(product);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed' });
  }
  await review.deleteOne();
  await recalcRating(review.product);
  res.json({ message: 'Review deleted' });
});

module.exports = router;
