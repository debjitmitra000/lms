// frontend/src/api/axiosInstance.js
import axios from "axios"

// Store token in memory as fallback only
let authToken = null;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - only add header if we have token AND cookies might be failing
axiosInstance.interceptors.request.use((config) => {
  // Only add Authorization header as backup, let cookies work first
  if (authToken && config.headers && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Store token from login/register responses
    if (response.data?.token) {
      authToken = response.data.token;
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register')
      
      // If we're getting 401 on /auth/me and have a token, try one more time with header
      if (!isAuthPage && authToken && error.config && !error.config._retry) {
        error.config._retry = true;
        error.config.headers.Authorization = `Bearer ${authToken}`;
        return axiosInstance.request(error.config);
      }
      
      // Clear token and redirect
      authToken = null;
      
      if (!isAuthPage && !window.isRedirecting) {
        window.isRedirecting = true
        setTimeout(() => {
          window.location.href = "/login"
          window.isRedirecting = false
        }, 100)
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance