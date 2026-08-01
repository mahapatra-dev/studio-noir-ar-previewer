const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  res.json(user.wishlist);
});

router.post('/:productId', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.wishlist.includes(req.params.productId)) {
    user.wishlist.push(req.params.productId);
    await user.save();
  }
  res.json(user.wishlist);
});

router.delete('/:productId', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  res.json(user.wishlist);
});

module.exports = router;
