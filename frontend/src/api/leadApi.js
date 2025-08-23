import axiosInstance from "./axiosInstance"

export const leadApi = {
  getLeads: async (params = {}) => {
    const response = await axiosInstance.get("/leads", { params })
    return response.data
  },

  getLead: async (id) => {
    const response = await axiosInstance.get(`/leads/${id}`)
    return response.data
  },

  createLead: async (leadData) => {
    const response = await axiosInstance.post("/leads", leadData)
    return response.data
  },

  updateLead: async (id, leadData) => {
    const response = await axiosInstance.put(`/leads/${id}`, leadData)
    return response.data
  },

  deleteLead: async (id) => {
    const response = await axiosInstance.delete(`/leads/${id}`)
    return response.data
  },
}
