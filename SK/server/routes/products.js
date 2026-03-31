const express = require('express');
const router = express.Router();
const {
  getProducts, getFeatured, getBestSellers, getNewArrivals,
  getProductById, createProduct, updateProduct, deleteProduct, addReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/bestsellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
