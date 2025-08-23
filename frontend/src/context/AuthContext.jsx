"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { authApi } from "../api/authApi"

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "LOGOUT":
      return { ...initialState, loading: false }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authApi.getCurrentUser()
      dispatch({ type: "SET_USER", payload: response.user })
    } catch (error) {
      dispatch({ type: "SET_USER", payload: null })
    }
  }

  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authApi.login(credentials)
      dispatch({ type: "SET_USER", payload: response.user })
      return response
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Login failed" })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authApi.register(userData)
      dispatch({ type: "SET_USER", payload: response.user })
      return response
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Registration failed" })
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      dispatch({ type: "LOGOUT" })
    } catch (error) {
      dispatch({ type: "LOGOUT" })
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
