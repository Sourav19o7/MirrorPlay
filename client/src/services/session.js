import api from './api';

const sessionService = {
  // Get all sessions
  getSessions: async () => {
    return api.get('/sessions');
  },
  
  // Get session by ID
  getSessionById: async (id) => {
    return api.get(`/sessions/${id}`);
  },
  
  // Create a new session
  createSession: async (sessionData) => {
    return api.post('/sessions', sessionData);
  },
  
  // Update session
  updateSession: async (id, data) => {
    return api.put(`/sessions/${id}`, data);
  },
  
  // Delete session
  deleteSession: async (id) => {
    return api.delete(`/sessions/${id}`);
  },
  
  // Add message to session
  addMessage: async (sessionId, content) => {
    return api.post(`/sessions/${sessionId}/messages`, { content });
  },
  
  // Get coaching suggestions
  getCoachingSuggestions: async (sessionId, message, context) => {
    return api.post(`/sessions/${sessionId}/suggestions`, { message, context });
  },
  
  // Generate session summary
  generateSummary: async (sessionId) => {
    return api.post(`/sessions/${sessionId}/summary`);
  }
};

export default sessionService;