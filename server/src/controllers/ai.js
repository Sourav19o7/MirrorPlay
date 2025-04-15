const asyncHandler = require('express-async-handler');
const aiService = require('../services/ai');
const vectorService = require('../services/vector');

// @desc    Generate shadow self
// @route   POST /api/ai/shadow
// @access  Private
exports.generateShadow = asyncHandler(async (req, res) => {
  const { context, personality, topics } = req.body;
  
  const shadow = await aiService.generateShadowSelf(
    context,
    personality,
    topics
  );
  
  res.status(200).json({
    success: true,
    data: shadow
  });
});

// @desc    Generate projected other
// @route   POST /api/ai/projected
// @access  Private
exports.generateProjected = asyncHandler(async (req, res) => {
  const { relationship, characteristics, context, topics } = req.body;
  
  const projected = await aiService.generateProjectedOther(
    relationship,
    characteristics,
    context,
    topics
  );
  
  res.status(200).json({
    success: true,
    data: projected
  });
});

// @desc    Analyze emotions
// @route   POST /api/ai/emotions
// @access  Private
exports.analyzeEmotions = asyncHandler(async (req, res) => {
  const { message } = req.body;
  
  const analysis = await aiService.analyzeEmotions(message);
  
  res.status(200).json({
    success: true,
    data: analysis
  });
});

// @desc    Get coaching suggestions
// @route   POST /api/ai/suggestions
// @access  Private
exports.getSuggestions = asyncHandler(async (req, res) => {
  const { message, context, sessionMode } = req.body;
  
  const suggestions = await aiService.getCoachingSuggestions(
    message,
    context,
    sessionMode
  );
  
  res.status(200).json({
    success: true,
    data: suggestions
  });
});

// @desc    Find similar messages
// @route   POST /api/ai/similar
// @access  Private
exports.findSimilar = asyncHandler(async (req, res) => {
  const { text, limit } = req.body;
  
  const similar = await vectorService.findSimilarMessages(
    text,
    limit || 5
  );
  
  res.status(200).json({
    success: true,
    data: similar
  });
});

// @desc    Find communication patterns
// @route   GET /api/ai/patterns/:sessionId
// @access  Private
exports.findPatterns = asyncHandler(async (req, res) => {
  const patterns = await vectorService.findPatterns(req.params.sessionId);
  
  res.status(200).json({
    success: true,
    data: patterns
  });
});