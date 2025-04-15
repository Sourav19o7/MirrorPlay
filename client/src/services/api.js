import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiration or unauthorized
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token if it's an auth issue
      localStorage.removeItem('token');
      // Could dispatch to Redux store to handle logout
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;