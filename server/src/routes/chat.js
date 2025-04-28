const express = require('express');
const {
  createRoom,
  getRooms,
  getRoom,
  joinRoom,
  leaveRoom,
  sendMessage,
  getMessages
} = require('../controllers/chat');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Room routes
router.route('/rooms')
  .get(getRooms)
  .post(createRoom);

router.route('/rooms/:id')
  .get(getRoom);

router.post('/join', joinRoom);
router.post('/leave', leaveRoom);

// Message routes
router.route('/messages')
  .post(sendMessage);

router.route('/messages/:roomId')
  .get(getMessages);

module.exports = router;