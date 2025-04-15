const User = require('../models/User');
const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const { createRocketChatUser } = require('./chat');

// Register a new user
exports.registerUser = asyncHandler(async (userData) => {
  const { email, password, displayName } = userData;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ErrorResponse('User already exists', 400);
  }
  
  // Create user in database
  const user = await User.create({
    email,
    password,
    displayName,
    isVerified: false,
    verificationToken: crypto.randomBytes(20).toString('hex')
  });
  
  // Create Rocket.Chat user
  try {
    const rocketChatUserId = await createRocketChatUser(email, password, displayName);
    
    // Save Rocket.Chat ID to user record
    user.rocketChatId = rocketChatUserId;
    await user.save();
  } catch (error) {
    // If Rocket.Chat user creation fails, still proceed but log the error
    console.error('Failed to create Rocket.Chat user:', error);
  }
  
  // Create user profile
  await Profile.create({
    user: user._id
  });
  
  // Generate JWT token
  const token = user.getSignedJwtToken();
  
  return { user, token };
});

// Login user
exports.loginUser = asyncHandler(async (email, password) => {
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new ErrorResponse('Invalid credentials', 401);
  }
  
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    throw new ErrorResponse('Invalid credentials', 401);
  }
  
  // Generate JWT token
  const token = user.getSignedJwtToken();
  
  return { user, token };
});

// Get user profile
exports.getUserProfile = asyncHandler(async (userId) => {
  const profile = await Profile.findOne({ user: userId });
  
  if (!profile) {
    throw new ErrorResponse('Profile not found', 404);
  }
  
  return profile;
});

// Update user profile
exports.updateUserProfile = asyncHandler(async (userId, updates) => {
  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    updates,
    { new: true, runValidators: true }
  );
  
  if (!profile) {
    throw new ErrorResponse('Profile not found', 404);
  }
  
  return profile;
});