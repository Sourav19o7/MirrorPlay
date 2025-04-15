const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  mode: {
    type: String,
    enum: ['self-dialogue', 'projected-conflict', 'live-session'],
    required: [true, 'Please specify the session mode']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    email: String,
    status: {
      type: String,
      enum: ['invited', 'pending', 'joined', 'declined'],
      default: 'invited'
    },
    joinedAt: Date
  }],
  status: {
    type: String,
    enum: ['created', 'active', 'paused', 'completed', 'cancelled'],
    default: 'created'
  },
  chatRoomId: {
    type: String
  },
  topics: [String],
  duration: {
    type: Number,  // Duration in minutes
    default: 30
  },
  otherPersonDetails: {
    // For projected-conflict mode
    relationship: String,
    characteristics: [String]
  },
  shadowDetails: {
    // For self-dialogue mode
    personality: [String],
    context: String
  },
  insights: {
    clarityScore: Number,
    connectionMoments: [
      {
        timestamp: Date,
        description: String
      }
    ],
    patterns: [String],
    growthOpportunities: [String]
  },
  startedAt: Date,
  endedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
SessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Session', SessionSchema);