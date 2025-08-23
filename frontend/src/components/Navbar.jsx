import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-white" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#8e24aa] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span
                className={`text-xl font-bold text-[#8e24aa]`}
              >
                LMS
              </span>
            </Link>
          </div>

          {/* Menu Items */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-[#7B1FA2] hover:text-purple-800"
                      : "text-white hover:text-purple-200"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/leads"
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-[#7B1FA2] hover:text-purple-800"
                      : "text-white hover:text-purple-200"
                  }`}
                >
                  Leads
                </Link>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      isScrolled ? "text-[#7B1FA2]" : "text-white/90"
                    }`}
                  >
                    Welcome, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isLoginPage
                      ? "bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
                      : "border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isRegisterPage
                      ? "bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
                      : "border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
