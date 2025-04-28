const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom'); // You'll need to create this model
const ChatMessage = require('../models/ChatMessage'); // You'll need to create this model

// Create a user in the chat system
exports.createChatUser = async (email, password, name) => {
  try {
    // Simply use the existing user, but ensure they have chat access
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }
    
    // Set a flag or property to indicate chat access
    user.hasChatAccess = true;
    await user.save();
    
    logger.info(`Chat user created for ${email}`);
    return user._id;
  } catch (error) {
    logger.error(`Error creating chat user: ${error.message}`);
    throw new ErrorResponse('Failed to create chat user', 500);
  }
};

// Create a new chat room
exports.createChatRoom = async (name, members, type = 'private') => {
  try {
    // Create a chat room in our own database
    const room = await ChatRoom.create({
      name: name.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now().toString().slice(-6),
      type,
      members,
      createdAt: new Date()
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
    // Verify the room exists
    const room = await ChatRoom.findById(roomId);
    
    if (!room) {
      throw new ErrorResponse('Chat room not found', 404);
    }
    
    // If userId is provided, verify they are a member of the room
    if (userId) {
      const isMember = room.members.some(memberId => memberId.toString() === userId.toString());
      
      if (!isMember) {
        throw new ErrorResponse('User is not a member of this chat room', 403);
      }
    }
    
    // Create and save the message
    const message = await ChatMessage.create({
      roomId,
      text,
      sender: userId,
      timestamp: new Date()
    });
    
    logger.info(`Message sent to room ${roomId}`);
    return message;
  } catch (error) {
    logger.error(`Error sending message: ${error.message}`);
    throw new ErrorResponse('Failed to send message', 500);
  }
};

// Get messages from a chat room
exports.getMessages = async (roomId, limit = 50, before = null) => {
  try {
    // Build query
    const query = { roomId };
    
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }
    
    // Get messages from our database
    const messages = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('sender', 'displayName email')
      .lean();
    
    return {
      messages: messages.reverse(), // Return in chronological order
      count: messages.length
    };
  } catch (error) {
    logger.error(`Error getting messages: ${error.message}`);
    throw new ErrorResponse('Failed to get messages', 500);
  }
};

// Join a user to a room
exports.joinRoom = async (roomId, userId) => {
  try {
    const room = await ChatRoom.findById(roomId);
    
    if (!room) {
      throw new ErrorResponse('Chat room not found', 404);
    }
    
    // Check if user is already a member
    if (!room.members.some(id => id.toString() === userId.toString())) {
      room.members.push(userId);
      await room.save();
    }
    
    return true;
  } catch (error) {
    logger.error(`Error joining room: ${error.message}`);
    throw new ErrorResponse('Failed to join room', 500);
  }
};

// Leave a room
exports.leaveRoom = async (roomId, userId) => {
  try {
    const room = await ChatRoom.findById(roomId);
    
    if (!room) {
      throw new ErrorResponse('Chat room not found', 404);
    }
    
    // Remove user from members
    room.members = room.members.filter(id => id.toString() !== userId.toString());
    await room.save();
    
    return true;
  } catch (error) {
    logger.error(`Error leaving room: ${error.message}`);
    throw new ErrorResponse('Failed to leave room', 500);
  }
};