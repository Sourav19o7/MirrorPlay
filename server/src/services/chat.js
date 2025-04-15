const { driver } = require('@rocket.chat/sdk');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');
const User = require('../models/User');

// Create a user in Rocket.Chat
exports.createRocketChatUser = async (email, password, name) => {
  try {
    // Create user in Rocket.Chat
    const userId = await driver.asyncCall('users.create', {
      email,
      password,
      name,
      username: email.split('@')[0] + Date.now().toString().slice(-4) // Generate unique username
    });
    
    logger.info(`Rocket.Chat user created with ID: ${userId}`);
    return userId;
  } catch (error) {
    logger.error(`Error creating Rocket.Chat user: ${error.message}`);
    throw new ErrorResponse('Failed to create chat user', 500);
  }
};

// Create a new chat room
exports.createChatRoom = async (name, members, type = 'p') => {
  try {
    // Get Rocket.Chat IDs for all members
    const users = await User.find({ _id: { $in: members } });
    const rocketChatUserIds = users.map(user => user.rocketChatId).filter(id => id);
    
    // Create room in Rocket.Chat (p = private group)
    const room = await driver.asyncCall('groups.create', {
      name: name.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now().toString().slice(-6),
      members: rocketChatUserIds
    });
    
    logger.info(`Chat room created: ${room._id}`);
    return room._id;
  } catch (error) {
    logger.error(`Error creating chat room: ${error.message}`);
    throw new ErrorResponse('Failed to create chat room', 500);
  }
};

// Send a message to a chat room
exports.sendMessage = async (roomId, text, userId = null) => {
  try {
    // If userId is provided, get the Rocket.Chat ID
    let rocketChatUserId = null;
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.rocketChatId) {
        rocketChatUserId = user.rocketChatId;
      }
    }
    
    // Send message to room
    const message = await driver.sendToRoomId(text, roomId, rocketChatUserId);
    
    logger.info(`Message sent to room ${roomId}`);
    return message;
  } catch (error) {
    logger.error(`Error sending message: ${error.message}`);
    throw new ErrorResponse('Failed to send message', 500);
  }
};

// Get messages from a chat room
exports.getMessages = async (roomId, limit = 50, oldest = null) => {
  try {
    // Get messages from Rocket.Chat
    const messages = await driver.asyncCall('groups.history', {
      roomId,
      count: limit,
      oldest
    });
    
    return messages;
  } catch (error) {
    logger.error(`Error getting messages: ${error.message}`);
    throw new ErrorResponse('Failed to get messages', 500);
  }
};