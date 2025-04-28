const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'link'],
    },
    url: String,
    name: String,
    size: Number,
    mimeType: String
  }],
  reactions: [{
    emoji: String,
    count: {
      type: Number,
      default: 1
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  isSystem: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
ChatMessageSchema.index({ roomId: 1, timestamp: -1 });
ChatMessageSchema.index({ sender: 1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);