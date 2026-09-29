import axios from 'axios';

// Production: VITE_API_URL points to the deployed backend (e.g. https://nexoro-api.vercel.app/api)
// Development: Falls back to '/api' which Vite proxy forwards to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexoro_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired/invalid on protected route
      const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('nexoro_token');
        localStorage.removeItem('nexoro_user');
      }
    }
    return Promise.reject(error);
  }
);
