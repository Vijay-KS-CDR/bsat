import axios from 'axios';

const BASE_URL = '';

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token and purge legacy headers
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Explicitly purge legacy authentication headers to ensure JWT is the sole source of truth
  if (config.headers) {
    delete config.headers['X-User-Id'];
    delete config.headers['X-Student-Login-Id'];
    delete config.headers['x-user-id'];
    delete config.headers['x-student-login-id'];
  }
  
  return config;
});

// Response interceptor to handle 401 unauthorized errors globally
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('loginId');
      localStorage.removeItem('name');
      
      // Store session expiration notification message for Login screen
      localStorage.setItem('authError', 'Session expired or unauthorized. Please log in again.');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  const response = await authApi.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await authApi.post('/api/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const userId = localStorage.getItem('userId');
  const loginId = localStorage.getItem('loginId');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  if (userId && loginId && role) {
    return { id: userId, loginId, role, name: name || loginId };
  }
  throw new Error("No user session found");
};

export default authApi;
