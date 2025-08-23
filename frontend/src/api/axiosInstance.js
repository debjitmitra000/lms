import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register')
      
      if (!isAuthPage && !window.isRedirecting) {
        window.isRedirecting = true
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance