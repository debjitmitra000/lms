import axiosInstance from "./axiosInstance"

export const authApi = {
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials)
    return response.data
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout")
    return response.data
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get("/auth/me")
    return response.data
  },
}
