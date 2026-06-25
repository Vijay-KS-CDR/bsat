import axios from 'axios';

const BASE_URL = '';

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
      localStorage.removeItem('name');
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
  // Since the backend does not expose a /me endpoint, retrieve and return session data from local storage
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  if (userId && name && role) {
    return { id: userId, name, role };
  }
  throw new Error("No user session found");
};

export default authApi;
