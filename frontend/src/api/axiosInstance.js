// frontend/src/api/axiosInstance.js
import axios from "axios"

// Store token in memory as fallback only
let authToken = null;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // This is crucial for cookies
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

console.log('🔧 Axios instance configured with baseURL:', axiosInstance.defaults.baseURL);

// Request interceptor - Enhanced logging and token handling
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`📤 Making ${config.method?.toUpperCase()} request to:`, config.url);
    console.log('🔧 WithCredentials:', config.withCredentials);
    
    // Only add Authorization header as backup, let cookies work first
    if (authToken && config.headers && !config.headers.Authorization) {
      console.log('🔑 Adding backup Authorization header');
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    return config;
  },
  (error) => {
    console.error('📤 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`📥 Response ${response.status} from:`, response.config.url);
    
    // Store token from login/register responses
    if (response.data?.token) {
      console.log('🔑 Storing auth token from response');
      authToken = response.data.token;
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(`❌ Response error ${error.response?.status} from:`, error.config?.url);
    console.error('Error details:', error.response?.data);
    
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register');
      
      console.log('🔒 401 Unauthorized - Current path:', currentPath, 'Is auth page:', isAuthPage);
      
      // If we're getting 401 on /auth/me and have a token, try one more time with header
      if (!isAuthPage && authToken && originalRequest && !originalRequest._retry) {
        console.log('🔄 Retrying request with Authorization header');
        originalRequest._retry = true;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${authToken}`;
        
        try {
          return await axiosInstance.request(originalRequest);
        } catch (retryError) {
          console.error('🔄 Retry failed:', retryError.response?.status);
        }
      }
      
      // Clear token and redirect if not on auth page
      if (authToken) {
        console.log('🗑️ Clearing stored auth token');
        authToken = null;
      }
      
      if (!isAuthPage && !window.isRedirecting) {
        console.log('🔀 Redirecting to login...');
        window.isRedirecting = true;
        
        // Use a more reliable redirect method
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.replace('/login');
          }
          window.isRedirecting = false;
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;