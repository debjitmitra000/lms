import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { LeadProvider } from "./context/LeadContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import Dashboard from "./pages/Dashboard/Dashboard"
import LeadList from "./pages/Dashboard/LeadList"
import LeadForm from "./pages/Dashboard/LeadForm"
import LeadDetails from "./pages/Dashboard/LeadDetails"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <AuthProvider>
      <LeadProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <LeadList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads/new"
                element={
                  <ProtectedRoute>
                    <LeadForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads/edit/:id"
                element={
                  <ProtectedRoute>
                    <LeadForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads/:id"
                element={
                  <ProtectedRoute>
                    <LeadDetails />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </LeadProvider>
    </AuthProvider>
  )
}

export default App
