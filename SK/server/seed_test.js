require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');
    
    await Product.deleteMany({});
    console.log('Products cleared');
    await User.deleteMany({});
    console.log('Users cleared');

    const admin = new User({ name: 'Admin', email: 'admin@srikanakadhara.com', password: 'Admin@1234', role: 'admin' });
    await admin.save();
    console.log('Admin created:', admin.email);

    const testUser = new User({ name: 'Test User', email: 'test@example.com', password: 'Test@1234', role: 'user' });
    await testUser.save();
    console.log('Test user created:', testUser.email);

    // Add one sample product
    await Product.create({
      name: 'Kanjivaram Pure Silk Saree',
      description: 'A timeless masterpiece woven in pure Kanjivaram silk.',
      price: 12500, originalPrice: 15000, discount: 17,
      category: 'Silk Sarees', fabric: 'Pure Silk', colors: ['Deep Red', 'Gold'],
      images: ['/images/category-designer.png'],
      stock: 8, isFeatured: true, isBestSeller: true, isNewArrival: false,
    });
    console.log('Sample product created');
    
    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

run();
