const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const Message = require('../models/Message');
const chatService = require('../services/chat');
const aiService = require('../services/ai');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
exports.createSession = asyncHandler(async (req, res) => {
  // Add user to request body
  req.body.creator = req.user._id;
  
  // Create session
  const session = await Session.create(req.body);
  
  // Create chat room if it's a live session
  if (req.body.mode === 'live-session') {
    try {
      const roomId = await chatService.createChatRoom(
        session.title,
        [req.user._id, ...session.participants.map(p => p.user)]
      );
      
      // Update session with chat room ID
      session.chatRoomId = roomId;
      await session.save();
    } catch (error) {
      // If chat room creation fails, still return the session
      console.error('Failed to create chat room:', error);
    }
  }
  
  res.status(201).json({
    success: true,
    data: session
  });
});

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private
exports.getSessions = asyncHandler(async (req, res) => {
  // Get sessions created by user or where user is a participant
  const sessions = await Session.find({
    $or: [
      { creator: req.user._id },
      { 'participants.user': req.user._id }
    ]
  }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: sessions.length,
    data: sessions
  });
});

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
exports.getSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }
  
  // Check if user is creator or participant
  const isAuthorized = 
    session.creator.toString() === req.user._id.toString() ||
    session.participants.some(p => p.user && p.user.toString() === req.user._id.toString());
  
  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view this session'
    });
  }
  
  // Get messages for the session
  const messages = await Message.find({ session: session._id })
    .sort({ timestamp: 1 });
  
  res.status(200).json({
    success: true,
    data: {
      session,
      messages
    }
  });
});

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSession = asyncHandler(async (req, res) => {
  let session = await Session.findById(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }
  
  // Make sure user is session creator
  if (session.creator.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this session'
    });
  }
  
  // Update session
  session = await Session.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: session
  });
});

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }
  
  // Make sure user is session creator
  if (session.creator.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this session'
    });
  }
  
  // Delete session
  await session.remove();
  
  // Delete all messages for this session
  await Message.deleteMany({ session: req.params.id });
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add message to session
// @route   POST /api/sessions/:id/messages
// @access  Private
exports.addMessage = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }
  
  // Check if user is creator or participant
  const isAuthorized = 
    session.creator.toString() === req.user._id.toString() ||
    session.participants.some(p => p.user && p.user.toString() === req.user._id.toString());
  
  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to send messages in this session'
    });
  }
  
  const { content } = req.body;
  
  // Create message
  const message = await Message.create({
    session: req.params.id,
    sender: req.user._id,
    content,
    isAI: false
  });
  
  // If it's a live session, send to Rocket.Chat
  if (session.chatRoomId) {
    try {
      await chatService.sendMessage(
        session.chatRoomId,
        content,
        req.user._id
      );
    } catch (error) {
      console.error('Failed to send message to chat:', error);
    }
  }
  
  // Analyze message emotions
  try {
    const analysis = await aiService.analyzeEmotions(content);
    
    // Update message with analysis
    message.emotions = {
      primary: analysis.primaryEmotion,
      secondary: analysis.secondaryEmotions,
      intensity: analysis.intensity
    };
    
    message.analysis = {
      isBidForConnection: analysis.isBidForConnection,
      containsBlameLanguage: analysis.containsBlame,
      vectorId: analysis.vectorId
    };
    
    await message.save();
  } catch (error) {
    console.error('Failed to analyze message:', error);
  }
  
  // For self-dialogue and projected-conflict modes, generate AI response
  if (session.mode !== 'live-session') {
    try {
      // Get recent messages for context
      const recentMessages = await Message.find({ session: req.params.id })
        .sort({ timestamp: -1 })
        .limit(10);
      
      // Flip order for chronological context
      const context = [...recentMessages].reverse();
      
      // Generate response based on mode
      let persona = {};
      
      if (session.mode === 'self-dialogue') {
        persona = {
          personality: session.shadowDetails.personality,
          context: session.shadowDetails.context
        };
      } else if (session.mode === 'projected-conflict') {
        persona = {
          relationship: session.otherPersonDetails.relationship,
          characteristics: session.otherPersonDetails.characteristics
        };
      }
      
      const aiResponse = await aiService.generateDialogueResponse(
        session.mode,
        content,
        persona,
        context.map(m => ({
          sender: m.sender.toString() === req.user._id.toString() ? 'user' : 'ai',
          content: m.content
        }))
      );
      
      // Create AI message
      const aiMessage = await Message.create({
        session: req.params.id,
        isAI: true,
        content: aiResponse
      });
      
      // Return both messages
      return res.status(201).json({
        success: true,
        data: {
          userMessage: message,
          aiResponse: aiMessage
        }
      });
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    }
  }
  
  res.status(201).json({
    success: true,
    data: message
  });
});

// @desc    Get coaching suggestions
// @route   POST /api/sessions/:id/suggestions
// @access  Private
exports.getCoachingSuggestions = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }
  
  // Check if user is creator or participant
  const isAuthorized = 
    session.creator.toString() === req.user._id.toString() ||
    session.participants.some(p => p.user && p.user.toString() === req.user._id.toString());
  
  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this session'
    });
  }
  
  const { message, context } = req.body;
  
  // Get coaching suggestions
  const suggestions = await aiService.getCoachingSuggestions(
    message,
    context,
    session.mode
  );
  
  res.status(200).json({
    success: true,
    data: suggestions
  });
});

// @desc    Generate session summary
// @route   POST /api/sessions/:id/summary
// @access  Private
exports.generateSummary = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }
  
  // Make sure user is session creator
  if (session.creator.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to generate summary for this session'
    });
  }
  
  // Get all messages for the session
  const messages = await Message.find({ session: req.params.id })
    .sort({ timestamp: 1 });
  
  // Generate summary
  const summary = await aiService.generateSessionSummary(
    messages.map(m => ({
      content: m.content,
      sender: m.isAI ? 'ai' : 'user',
      timestamp: m.timestamp
    })),
    {
      title: session.title,
      mode: session.mode,
      topics: session.topics
    }
  );
  
  // Update session with insights
  session.insights = {
    clarityScore: summary.clarityScore,
    connectionMoments: summary.keyMoments,
    patterns: summary.patterns || [],
    growthOpportunities: summary.growthOpportunities
  };
  
  await session.save();
  
  res.status(200).json({
    success: true,
    data: summary
  });
});