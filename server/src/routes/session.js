const express = require('express');
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  addMessage,
  getCoachingSuggestions,
  generateSummary
} = require('../controllers/session');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSessions)
  .post(createSession);

router.route('/:id')
  .get(getSession)
  .put(updateSession)
  .delete(deleteSession);

router.post('/:id/messages', addMessage);
router.post('/:id/suggestions', getCoachingSuggestions);
router.post('/:id/summary', generateSummary);

module.exports = router;