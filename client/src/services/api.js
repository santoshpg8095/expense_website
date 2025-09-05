import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://expense-website-3gmr.onrender.com/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Making request to:', config.url);
      console.log('With headers:', config.headers);
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for better error handling
api.interceptors.response.use(
  response => {
    console.log('Response received:', response.config.url, response.status);
    return response;
  },
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', error.response.config.url);
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
      console.error('Request Config:', error.config);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;