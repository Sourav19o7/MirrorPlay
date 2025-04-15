const express = require('express');
const {
  generateShadow,
  generateProjected,
  analyzeEmotions,
  getSuggestions,
  findSimilar,
  findPatterns
} = require('../controllers/ai');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/shadow', generateShadow);
router.post('/projected', generateProjected);
router.post('/emotions', analyzeEmotions);
router.post('/suggestions', getSuggestions);
router.post('/similar', findSimilar);
router.get('/patterns/:sessionId', findPatterns);

module.exports = router;