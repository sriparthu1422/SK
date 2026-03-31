const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @desc  Register user
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('User already exists'); }
  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    token: generateToken(user._id),
  });
});

// @desc  Login user
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); throw new Error('Invalid email or password');
  }
});

// @desc  Get current user
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({
    _id: updated._id, name: updated.name, email: updated.email, role: updated.role,
    token: generateToken(updated._id),
  });
});

// @desc  Forgot password
// @route POST /api/auth/forgotpassword
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) { res.status(404); throw new Error('There is no user with that email'); }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url (pointing to frontend application)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500); throw new Error('Email could not be sent');
  }
});

// @desc  Reset password
// @route PUT /api/auth/resetpassword/:resettoken
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) { res.status(400); throw new Error('Invalid token'); }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    token: generateToken(user._id)
  });
});

module.exports = { register, login, getMe, updateProfile, forgotPassword, resetPassword };
