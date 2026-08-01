const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadModel, uploadImage } = require('../middleware/upload');

const router = express.Router();

// Browse / search / filter products
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = '-createdAt';
    if (sort === 'price_asc') sortOption = 'price';
    if (sort === 'price_desc') sortOption = '-price';
    if (sort === 'rating') sortOption = '-averageRating';

    const products = await Product.find(query).populate('category').sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Compare - fetch multiple by ids: /api/products/compare?ids=id1,id2,id3
router.get('/compare', async (req, res) => {
  const ids = (req.query.ids || '').split(',').filter(Boolean);
  const products = await Product.find({ _id: { $in: ids } }).populate('category');
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('category');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Admin: create product
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

// Upload 3D model file (.glb/.gltf)
router.post('/:id/upload-model', protect, adminOnly, uploadModel.single('model'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const filePath = `/uploads/models/${req.file.filename}`;
  const product = await Product.findByIdAndUpdate(req.params.id, { modelFile: filePath }, { new: true });
  res.json(product);
});

// Upload product image
router.post('/:id/upload-image', protect, adminOnly, uploadImage.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const filePath = `/uploads/images/${req.file.filename}`;
  const product = await Product.findByIdAndUpdate(req.params.id, { $push: { images: filePath } }, { new: true });
  res.json(product);
});

module.exports = router;
