const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc  Create Razorpay order
// @route POST /api/payment/create-order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body; // amount in paise

  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
    // Demo mode: return mock data
    return res.json({
      id: `order_demo_${Date.now()}`,
      amount,
      currency: 'INR',
      orderId,
      demo: true,
    });
  }

  const options = {
    amount: Math.round(amount * 100), // convert to paise
    currency: 'INR',
    receipt: `receipt_order_${orderId}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);
  res.json({ ...razorpayOrder, orderId });
});

// @desc  Verify Razorpay payment
// @route POST /api/payment/verify
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // Demo mode verification
  if (razorpay_order_id.startsWith('order_demo_')) {
    const order = await Order.findById(orderId);
    if (!order) { res.status(404); throw new Error('Order not found'); }
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id || 'demo_payment';
    await order.save();
    return res.json({ success: true, message: 'Payment verified (demo mode)' });
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400); throw new Error('Invalid payment signature');
  }

  const order = await Order.findById(orderId);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  order.razorpayOrderId = razorpay_order_id;
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  await order.save();

  res.json({ success: true, message: 'Payment verified successfully' });
});

// @desc  Get Razorpay key (public)
// @route GET /api/payment/key
const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

module.exports = { createRazorpayOrder, verifyPayment, getRazorpayKey };
