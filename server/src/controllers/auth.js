const asyncHandler = require('express-async-handler');
const authService = require('../services/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { email, password, displayName } = req.body;
  
  const { user, token } = await authService.registerUser({
    email,
    password,
    displayName
  });
  
  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const { user, token } = await authService.loginUser(email, password);
  
  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedProfile = await authService.updateUserProfile(
    req.user._id,
    req.body
  );
  
  res.status(200).json({
    success: true,
    data: updatedProfile
  });
});