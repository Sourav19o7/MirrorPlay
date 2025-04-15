import api from './api';

const aiService = {
  // Generate shadow self for Self-Self dialogue
  generateShadowSelf: async (params) => {
    return api.post('/ai/shadow', params);
  },
  
  // Generate projected other for Self-Other dialogue
  generateProjectedOther: async (params) => {
    return api.post('/ai/projected', params);
  },
  
  // Analyze emotions in a message
  analyzeEmotions: async (message) => {
    return api.post('/ai/emotions', { message });
  },
  
  // Get coaching suggestions
  getCoachingSuggestions: async (message, context, sessionMode) => {
    return api.post('/ai/suggestions', { message, context, sessionMode });
  },
  
  // Generate dialogue response
  generateDialogueResponse: async (mode, message, persona, history) => {
    // This could either call the backend or use a client-side implementation
    return api.post('/ai/dialogue', { mode, message, persona, history });
  },
  
  // Find similar messages
  findSimilarMessages: async (text, limit = 5) => {
    return api.post('/ai/similar', { text, limit });
  },
  
  // Find communication patterns
  findPatterns: async (sessionId) => {
    return api.get(`/ai/patterns/${sessionId}`);
  }
};

export default aiService;