"use client"

import { createContext, useContext, useReducer } from "react"
import { leadApi } from "../api/leadApi"

const LeadContext = createContext()

const initialState = {
  leads: [],
  currentLead: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
}

const leadReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_LEADS":
      return {
        ...state,
        leads: action.payload.data,
        pagination: {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        },
        loading: false,
        error: null,
      }
    case "SET_CURRENT_LEAD":
      return { ...state, currentLead: action.payload, loading: false }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_FILTERS":
      return { ...state, filters: action.payload }
    case "ADD_LEAD":
      return { ...state, leads: [action.payload, ...state.leads] }
    case "UPDATE_LEAD":
      return {
        ...state,
        leads: state.leads.map((lead) => (lead._id === action.payload._id ? action.payload : lead)),
        currentLead: action.payload,
      }
    case "DELETE_LEAD":
      return {
        ...state,
        leads: state.leads.filter((lead) => lead._id !== action.payload),
      }
    default:
      return state
  }
}

export const LeadProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leadReducer, initialState)

  const fetchLeads = async (params = {}) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await leadApi.getLeads(params)
      dispatch({ type: "SET_LEADS", payload: response })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Failed to fetch leads" })
    }
  }

  const fetchLead = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await leadApi.getLead(id)
      dispatch({ type: "SET_CURRENT_LEAD", payload: response.data })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Failed to fetch lead" })
    }
  }

  const createLead = async (leadData) => {
    try {
      const response = await leadApi.createLead(leadData)
      dispatch({ type: "ADD_LEAD", payload: response.data })
      return response
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Failed to create lead" })
      throw error
    }
  }

  const updateLead = async (id, leadData) => {
    try {
      const response = await leadApi.updateLead(id, leadData)
      dispatch({ type: "UPDATE_LEAD", payload: response.data })
      return response
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Failed to update lead" })
      throw error
    }
  }

  const deleteLead = async (id) => {
    try {
      await leadApi.deleteLead(id)
      dispatch({ type: "DELETE_LEAD", payload: id })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Failed to delete lead" })
      throw error
    }
  }

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters })
  }

  const value = {
    ...state,
    fetchLeads,
    fetchLead,
    createLead,
    updateLead,
    deleteLead,
    setFilters,
  }

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>
}

export const useLeads = () => {
  const context = useContext(LeadContext)
  if (!context) {
    throw new Error("useLeads must be used within a LeadProvider")
  }
  return context
}
