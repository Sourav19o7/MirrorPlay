const mongoose = require('mongoose');

// Message schema - This should represent a message, not a session
const MessageSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAI: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  emotions: {
    primary: {
      type: String,
      enum: [
        'neutral', 'happy', 'sad', 'angry', 'frustrated',
        'anxious', 'defensive', 'hopeful', 'confused', 'empathetic'
      ],
      default: 'neutral'
    },
    secondary: [String],
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    }
  },
  analysis: {
    isBidForConnection: Boolean,
    containsBlameLanguage: Boolean,
    communicationPatterns: [String],
    vectorId: String  // Reference to vector embedding in Pinecone
  },
  suggestions: [{
    type: {
      type: String,
      enum: ['reframe', 'reflection', 'question', 'validation', 'clarification']
    },
    content: String,
    originalText: String  // Original text if type is 'reframe'
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);