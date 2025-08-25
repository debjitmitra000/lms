import axios from "axios"

let authToken = null;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log('🔧 Axios instance configured with baseURL:', axiosInstance.defaults.baseURL);

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`📤 Making ${config.method?.toUpperCase()} request to:`, config.url);
    console.log('🔧 WithCredentials:', config.withCredentials);
    
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
      
      if (authToken) {
        console.log('🗑️ Clearing stored auth token');
        authToken = null;
      }
      
      if (!isAuthPage && !window.isRedirecting) {
        console.log('🔀 Redirecting to login...');
        window.isRedirecting = true;
        
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