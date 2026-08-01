require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  const adminPassword = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Admin', email: 'admin@studionoir.com', password: adminPassword, role: 'admin' });

  const userPassword = await bcrypt.hash('user1234', 10);
  await User.create({ name: 'Test User', email: 'user@studionoir.com', password: userPassword, role: 'user' });

  const chairCat = await Category.create({ name: 'Chairs', description: 'Seating furniture' });
  const tableCat = await Category.create({ name: 'Tables', description: 'Tables of all kinds' });

  await Product.create([
    {
      name: 'Noir Lounge Chair',
      description: 'Premium black-gold accent lounge chair.',
      price: 12999,
      category: chairCat._id,
      images: [],
      modelFile: '',
      dimensions: { width: 70, height: 90, depth: 75 },
      tags: ['chair', 'luxury'],
    },
    {
      name: 'Aurum Coffee Table',
      description: 'Gold-trimmed glass-top coffee table.',
      price: 8999,
      category: tableCat._id,
      images: [],
      modelFile: '',
      dimensions: { width: 100, height: 45, depth: 60 },
      tags: ['table', 'modern'],
    },
  ]);

  console.log('Seed complete. Admin login: admin@studionoir.com / admin123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
