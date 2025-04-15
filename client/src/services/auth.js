import api from './api';

const authService = {
  // Register a new user
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  
  // Logout user
  logout: async () => {
    localStorage.removeItem('token');
    return { success: true };
  },
  
  // Get current user
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    return api.put('/auth/profile', profileData);
  }
};

export default authService;