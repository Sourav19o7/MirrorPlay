const asyncHandler = require('express-async-handler');
const chatService = require('../services/chat');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new chat room
// @route   POST /api/chat/rooms
// @access  Private
exports.createRoom = asyncHandler(async (req, res) => {
  const { name, members, type = 'private', description } = req.body;
  
  // Add creator to members list if not already included
  let membersList = members || [];
  
  if (!membersList.includes(req.user._id.toString())) {
    membersList.push(req.user._id);
  }
  
  // Create the room
  const roomId = await chatService.createChatRoom(
    name, 
    membersList, 
    type
  );
  
  // Return room info
  const roomData = {
    _id: roomId,
    name,
    type,
    members: membersList,
    description: description || '',
    createdBy: req.user._id,
    createdAt: new Date()
  };
  
  res.status(201).json({
    success: true,
    data: roomData
  });
});

// @desc    Get all rooms for current user
// @route   GET /api/chat/rooms
// @access  Private
exports.getRooms = asyncHandler(async (req, res) => {
  // Get rooms from database where user is a member
  const rooms = await ChatRoom.find({ members: req.user._id })
    .sort({ updatedAt: -1 })
    .populate('members', 'displayName email')
    .lean();
  
  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms
  });
});

// @desc    Get a single room
// @route   GET /api/chat/rooms/:id
// @access  Private
exports.getRoom = asyncHandler(async (req, res) => {
  const room = await ChatRoom.findById(req.params.id)
    .populate('members', 'displayName email')
    .populate('createdBy', 'displayName email')
    .lean();
  
  if (!room) {
    return res.status(404).json({
      success: false,
      error: 'Room not found'
    });
  }
  
  // Check if user is a member of the room
  if (!room.members.some(member => member._id.toString() === req.user._id.toString())) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this room'
    });
  }
  
  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Join a room
// @route   POST /api/chat/join
// @access  Private
exports.joinRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.body;
  
  if (!roomId) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a room ID'
    });
  }
  
  const success = await chatService.joinRoom(roomId, req.user._id);
  
  if (success) {
    res.status(200).json({
      success: true,
      data: { message: 'Successfully joined room' }
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Failed to join room'
    });
  }
});

// @desc    Leave a room
// @route   POST /api/chat/leave
// @access  Private
exports.leaveRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.body;
  
  if (!roomId) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a room ID'
    });
  }
  
  const success = await chatService.leaveRoom(roomId, req.user._id);
  
  if (success) {
    res.status(200).json({
      success: true,
      data: { message: 'Successfully left room' }
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Failed to leave room'
    });
  }
});

// @desc    Send a message to a room
// @route   POST /api/chat/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res) => {
  const { roomId, content } = req.body;
  
  if (!roomId || !content) {
    return res.status(400).json({
      success: false,
      error: 'Please provide both roomId and content'
    });
  }
  
  const message = await chatService.sendMessage(roomId, content, req.user._id);
  
  res.status(201).json({
    success: true,
    data: message
  });
});

// @desc    Get messages from a room
// @route   GET /api/chat/messages/:roomId
// @access  Private
exports.getMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { limit = 50, before } = req.query;
  
  // Verify room exists and user is a member
  const room = await ChatRoom.findById(roomId);
  
  if (!room) {
    return res.status(404).json({
      success: false,
      error: 'Room not found'
    });
  }
  
  if (!room.members.includes(req.user._id)) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access messages in this room'
    });
  }
  
  const messagesData = await chatService.getMessages(roomId, parseInt(limit), before);
  
  res.status(200).json({
    success: true,
    count: messagesData.count,
    data: messagesData.messages
  });
});