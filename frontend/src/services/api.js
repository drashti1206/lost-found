import axios from 'axios';
import { toast } from 'react-hot-toast';

// Get port from environment or use fallback ports
const API_PORT = process.env.VITE_API_PORT || 5000;
const BASE_URL = `http://localhost:${API_PORT}`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000
});

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register'
  },
  items: {
    list: '/items',
    create: '/items',
    search: (query) => `/items/search?q=${query}`,
    byUser: (userId) => `/users/${userId}/items`,
    single: (id) => `/items/${id}`,
    stats: '/items/stats'
  },
  categories: {
    list: '/categories'
  },
  notifications: {
    list: '/notifications',
    unread: (userId) => `/notifications?userId=${userId}&read=false`
  },
  matches: {
    list: '/matches',
    create: '/matches',
    byItem: (itemId) => `/matches?itemId=${itemId}`
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.data);
      toast.error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request);
      toast.error('Network error - please check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      toast.error('An unexpected error occurred');
    }
    return Promise.reject(error);
  }
);

// Service exports
export const itemService = {
  getAll: () => api.get(endpoints.items.list),
  getById: (id) => api.get(endpoints.items.single(id)),
  create: (data) => api.post(endpoints.items.create, data),
  update: (id, data) => api.put(endpoints.items.single(id), data),
  delete: (id) => api.delete(endpoints.items.single(id)),
  search: (query) => api.get(endpoints.items.search(query)),
  getByUser: (userId) => api.get(endpoints.items.byUser(userId)),
  getStats: () => api.get(endpoints.items.stats)
};

export const categoryService = {
  getAll: () => api.get(endpoints.categories.list)
};

export const notificationService = {
  getAll: () => api.get(endpoints.notifications.list),
  getUnread: (userId) => api.get(endpoints.notifications.unread(userId))
};

export const matchService = {
  getAll: () => api.get(endpoints.matches.list),
  create: (data) => api.post(endpoints.matches.create, data),
  getByItem: (itemId) => api.get(endpoints.matches.byItem(itemId))
};

export default api; 