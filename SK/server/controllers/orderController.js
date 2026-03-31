const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc  Create order
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, itemsTotal, shippingPrice, taxPrice, totalAmount, paymentMethod } = req.body;
  if (!items || items.length === 0) { res.status(400); throw new Error('No order items'); }
  const order = await Order.create({
    user: req.user._id, items, shippingAddress,
    itemsTotal, shippingPrice, taxPrice, totalAmount, paymentMethod,
  });
  res.status(201).json(order);
});

// @desc  Get order by ID
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json(order);
});

// @desc  Get my orders
// @route GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Get all orders (admin)
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.orderStatus = req.body.orderStatus || order.orderStatus;
  if (req.body.orderStatus === 'delivered') order.deliveredAt = Date.now();
  const updated = await order.save();
  res.json(updated);
});

module.exports = { createOrder, getOrderById, getMyOrders, getAllOrders, updateOrderStatus };
