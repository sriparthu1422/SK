require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const sampleProducts = [
  {
    name: 'Kanjivaram Pure Silk Saree',
    description: 'A timeless masterpiece woven in pure Kanjivaram silk with intricate zari work. Perfect for weddings and grand occasions. Features traditional temple border with gold zari motifs.',
    price: 12500,
    originalPrice: 15000,
    discount: 17,
    category: 'Silk Sarees',
    fabric: 'Pure Silk',
    colors: ['Deep Red', 'Maroon', 'Gold'],
    images: [
      '/images/category-bridal.png',
      '/images/category-bridal.png',
    ],
    stock: 8,
    isFeatured: true, isBestSeller: true, isNewArrival: false,
    tags: ['silk', 'wedding', 'traditional', 'zari'],
  },
  {
    name: 'Banarasi Georgette Saree',
    description: 'Luxurious Banarasi georgette with delicate floral motifs and intricate brocade border. A must-have for festive occasions.',
    price: 8500,
    originalPrice: 10000,
    discount: 15,
    category: 'Silk Sarees',
    fabric: 'Georgette',
    colors: ['Royal Blue', 'Silver', 'Pink'],
    images: [
      '/images/category-designer.png',
      '/images/category-designer.png',
    ],
    stock: 12,
    isFeatured: true, isBestSeller: false, isNewArrival: true,
    tags: ['banarasi', 'festive', 'georgette'],
  },
  {
    name: 'Chanderi Silk Cotton Saree',
    description: 'Lightweight and breathable Chanderi saree with traditional hand-block prints. Ideal for summer festivals and daytime events.',
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    category: 'Cotton Sarees',
    fabric: 'Silk Cotton',
    colors: ['Ivory', 'Green', 'Orange'],
    images: [
      '/images/category-bridal.png',
      '/images/category-silk.png',
    ],
    stock: 20,
    isFeatured: false, isBestSeller: true, isNewArrival: true,
    tags: ['chanderi', 'summer', 'lightweight'],
  },
  {
    name: 'Bridal Silk Lehenga Saree',
    description: 'Exquisitely crafted bridal saree with heavy embroidery and stone work. This piece radiates regal elegance for your special day.',
    price: 22000,
    originalPrice: 28000,
    discount: 21,
    category: 'Bridal Sarees',
    fabric: 'Pure Silk',
    colors: ['Bridal Red', 'Gold', 'Pink'],
    images: [
      '/images/category-bridal.png',
      '/images/category-silk.png',
    ],
    stock: 5,
    isFeatured: true, isBestSeller: false, isNewArrival: false,
    tags: ['bridal', 'wedding', 'embroidery', 'heavy'],
  },
  {
    name: 'Cotton Jamdani Daily Wear',
    description: 'Soft and comfortable cotton Jamdani saree with subtle woven patterns. Perfect for office wear and casual outings.',
    price: 1800,
    originalPrice: 2200,
    discount: 18,
    category: 'Cotton Sarees',
    fabric: 'Cotton',
    colors: ['White', 'Blue', 'Yellow'],
    images: [
      '/images/category-cotton.png',
      '/images/category-cotton.png',
    ],
    stock: 30,
    isFeatured: false, isBestSeller: true, isNewArrival: true,
    tags: ['cotton', 'daily', 'office', 'casual'],
  },
  {
    name: 'Designer Embroidered Saree',
    description: 'Contemporary designer saree featuring modern embroidery and sequin work. A fusion of tradition and modern fashion trends.',
    price: 6500,
    originalPrice: 8000,
    discount: 19,
    category: 'Designer Sarees',
    fabric: 'Net',
    colors: ['Black', 'Gold', 'Silver'],
    images: [
      '/images/category-cotton.png',
      '/images/category-bridal.png',
    ],
    stock: 15,
    isFeatured: true, isBestSeller: false, isNewArrival: true,
    tags: ['designer', 'embroidered', 'sequin', 'party'],
  },
  {
    name: 'Pure Silk Mysore Saree',
    description: 'Classic Mysore silk saree known for its lustrous finish and lightweight drape. Traditional crepe texture with zari border.',
    price: 7800,
    originalPrice: 9500,
    discount: 18,
    category: 'Silk Sarees',
    fabric: 'Mysore Silk',
    colors: ['Purple', 'Green', 'Orange'],
    images: [
      '/images/category-cotton.png',
      '/images/category-silk.png',
    ],
    stock: 10,
    isFeatured: false, isBestSeller: true, isNewArrival: false,
    tags: ['mysore', 'silk', 'classic', 'zari'],
  },
  {
    name: 'Pochampally Ikat Silk Saree',
    description: 'Authentic handwoven Pochampally Ikat saree from Telangana. Geometric tie-dye patterns created by traditional ikat weaving.',
    price: 4500,
    originalPrice: 5500,
    discount: 18,
    category: 'Silk Sarees',
    fabric: 'Ikat Silk',
    colors: ['Turquoise', 'Orange', 'Red'],
    images: [
      '/images/category-silk.png',
      '/images/category-bridal.png',
    ],
    stock: 18,
    isFeatured: false, isBestSeller: false, isNewArrival: true,
    tags: ['pochampally', 'ikat', 'handwoven', 'geometric'],
  },
  {
    name: 'Linen Handloom Saree',
    description: 'Eco-friendly handloom linen saree with natural texture and minimalist design. Breathable fabric perfect for summer.',
    price: 2500,
    originalPrice: 3000,
    discount: 17,
    category: 'Cotton Sarees',
    fabric: 'Linen',
    colors: ['Beige', 'Grey', 'White'],
    images: [
      '/images/category-silk.png',
      '/images/category-bridal.png',
    ],
    stock: 25,
    isFeatured: false, isBestSeller: false, isNewArrival: true,
    tags: ['linen', 'handloom', 'eco-friendly', 'minimal'],
  },
  {
    name: 'Raw Silk Patola Saree',
    description: 'Double ikat Patola saree from Gujarat — one of the most precious silk weaves in India. Collector\'s piece with intricate geometric patterns.',
    price: 35000,
    originalPrice: 42000,
    discount: 17,
    category: 'Silk Sarees',
    fabric: 'Raw Silk',
    colors: ['Red', 'Green', 'Gold'],
    images: [
      '/images/category-silk.png',
      '/images/category-bridal.png',
    ],
    stock: 3,
    isFeatured: true, isBestSeller: false, isNewArrival: false,
    tags: ['patola', 'gujarat', 'premium', 'collector'],
  },
  {
    name: 'Soft Silk Party Wear Saree',
    description: 'Elegant soft silk saree with embellished border for parties and functions. Features subtle shimmer and easy drape.',
    price: 4800,
    originalPrice: 6000,
    discount: 20,
    category: 'Designer Sarees',
    fabric: 'Soft Silk',
    colors: ['Wine', 'Navy', 'Pink'],
    images: [
      '/images/category-traditional.png',
      '/images/category-bridal.png',
    ],
    stock: 22,
    isFeatured: false, isBestSeller: true, isNewArrival: true,
    tags: ['party', 'soft-silk', 'embellished'],
  },
  {
    name: 'Organza Floral Saree',
    description: 'Sheer organza saree with delicate floral prints and embroidered border. Contemporary fusion look for the modern woman.',
    price: 3800,
    originalPrice: 4500,
    discount: 16,
    category: 'Designer Sarees',
    fabric: 'Organza',
    colors: ['Lavender', 'Peach', 'Mint'],
    images: [
      '/images/category-traditional.png',
      '/images/category-cotton.png',
    ],
    stock: 16,
    isFeatured: false, isBestSeller: false, isNewArrival: true,
    tags: ['organza', 'floral', 'modern', 'sheer'],
  },
  {
    name: 'Festive Special Traditional Saree',
    description: 'A beautiful traditional saree perfect for festive celebrations and cultural events.',
    price: 5500,
    originalPrice: 6500,
    discount: 15,
    category: 'Traditional Wear',
    fabric: 'Silk Blend',
    colors: ['Yellow', 'Red'],
    images: [
      '/images/category-traditional.png',
      '/images/hero-banner.png',
    ],
    stock: 12,
    isFeatured: true, isBestSeller: false, isNewArrival: true,
    tags: ['traditional', 'festive', 'ethereal'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    await User.deleteMany({});

    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} products seeded`);

    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@srikanakadhara.com',
      password: 'Admin@1234',
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@srikanakadhara.com / Admin@1234');

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test@1234',
      role: 'user',
    });
    console.log('✅ Test user created: test@example.com / Test@1234');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
