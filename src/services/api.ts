import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ecommerce.stokai.live'
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5030'
// Create axios instance with default configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or Redux store
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/user/login',
  SIGN_UP: '/user/sign_up',
  SIGN_IN: '/user/login',
  LOGOUT: '/user/logout',
  VERIFY_OTP: '/user/verify_otp',
  
  // User endpoints
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile_update',
  
  // Cart endpoints
  CART_LIST: '/user/cart/list',
  ADD_TO_CART: '/user/cart/addToCart',
  UPDATE_CART: '/user/cart/updateToCart',
  
  // Coupon endpoints
  VALIDATE_COUPON: '/user/coupon/check_valid_coupon',
};

export default apiClient;
