const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc  Get all products with filters/sort/pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, colors, sort, inStock, search, page = 1, limit = 12 } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (inStock === 'true') filter.stock = { $gt: 0 };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (colors) filter.colors = { $in: colors.split(',') };
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
  ];

  let sortObj = {};
  if (sort === 'price_asc') sortObj = { price: 1 };
  else if (sort === 'price_desc') sortObj = { price: -1 };
  else if (sort === 'name_asc') sortObj = { name: 1 };
  else if (sort === 'name_desc') sortObj = { name: -1 };
  else if (sort === 'oldest') sortObj = { createdAt: 1 };
  else sortObj = { createdAt: -1 };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortObj)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  res.json({ products, count, pages: Math.ceil(count / Number(limit)), page: Number(page) });
});

// @desc  Get featured products
// @route GET /api/products/featured
const getFeatured = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json(products);
});

// @desc  Get best sellers
// @route GET /api/products/bestsellers
const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true }).limit(8);
  res.json(products);
});

// @desc  Get new arrivals
// @route GET /api/products/new-arrivals
const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(12);
  res.json(products);
});

// @desc  Get single product
// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ message: 'Product removed' });
});

// @desc  Add review
// @route POST /api/products/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) { res.status(400); throw new Error('Product already reviewed'); }
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.updateRating();
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = { getProducts, getFeatured, getBestSellers, getNewArrivals, getProductById, createProduct, updateProduct, deleteProduct, addReview };
