// frontend/src/api/axiosInstance.js
import axios from "axios"

// Store token in memory as fallback
let authToken = null;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Store token if received in response
    if (response.data?.token) {
      authToken = response.data.token;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      authToken = null; // Clear invalid token
      
      const currentPath = window.location.pathname
      const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register')
      
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