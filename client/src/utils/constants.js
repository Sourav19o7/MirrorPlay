// Application constants

// Session modes
export const SESSION_MODES = {
    SELF_DIALOGUE: 'self-dialogue',
    PROJECTED_CONFLICT: 'projected-conflict',
    LIVE_SESSION: 'live-session'
  };
  
  // Session statuses
  export const SESSION_STATUS = {
    CREATED: 'created',
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  };
  
  // Emotion categories
  export const EMOTIONS = {
    NEUTRAL: 'neutral',
    HAPPY: 'happy',
    SAD: 'sad',
    ANGRY: 'angry',
    FRUSTRATED: 'frustrated',
    ANXIOUS: 'anxious',
    DEFENSIVE: 'defensive',
    HOPEFUL: 'hopeful',
    CONFUSED: 'confused',
    EMPATHETIC: 'empathetic'
  };
  
  // Suggestion types
  export const SUGGESTION_TYPES = {
    REFRAME: 'reframe',
    REFLECTION: 'reflection',
    QUESTION: 'question',
    VALIDATION: 'validation',
    CLARIFICATION: 'clarification'
  };
  
  // API endpoints
  export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      PROFILE: '/auth/profile'
    },
    SESSIONS: {
      BASE: '/sessions',
      GET_BY_ID: (id) => `/sessions/${id}`,
      MESSAGES: (id) => `/sessions/${id}/messages`,
      SUGGESTIONS: (id) => `/sessions/${id}/suggestions`,
      SUMMARY: (id) => `/sessions/${id}/summary`
    },
    AI: {
      SHADOW: '/ai/shadow',
      PROJECTED: '/ai/projected',
      EMOTIONS: '/ai/emotions',
      SUGGESTIONS: '/ai/suggestions',
      SIMILAR: '/ai/similar',
      PATTERNS: (sessionId) => `/ai/patterns/${sessionId}`,
      DIALOGUE: '/ai/dialogue'
    }
  };
  
  // Local storage keys
  export const STORAGE_KEYS = {
    TOKEN: 'token',
    THEME: 'theme',
    USER: 'user'
  };
  
  // Theme configuration
  export const THEME_CONFIG = {
    DARK: 'dark',
    LIGHT: 'light'
  };