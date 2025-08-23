import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isDashboardPage = location.pathname === "/dashboard";
  const isLeadsPage = location.pathname === "/leads";

  //generating user initials from first and last name
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0]?.toUpperCase() || "U";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled || isMobileMenuOpen ? "bg-white" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#8e24aa] rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-xl font-bold text-[#8e24aa]">LMS</span>
              </Link>
            </div>

            {/*desktop view*/}
            <div className="hidden md:flex items-center space-x-4 group/nav">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-300 text-[#8e24aa] hover:text-[#7b1fa2] relative group ${
                      isDashboardPage ? "text-[#7b1fa2]" : ""
                    }`}
                  >
                    Dashboard
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[#8e24aa] transition-all duration-300 ease-out ${
                        isDashboardPage
                          ? "w-full group-hover/nav:w-0 group-hover:w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                  <Link
                    to="/leads"
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-300 text-[#8e24aa] hover:text-[#7b1fa2] relative group ${
                      isLeadsPage ? "text-[#7b1fa2]" : ""
                    }`}
                  >
                    Leads
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[#8e24aa] transition-all duration-300 ease-out ${
                        isLeadsPage
                          ? "w-full group-hover/nav:w-0 group-hover:w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 bg-transparent rounded-full flex items-center justify-center text-xs font-bold border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]">
                        {getUserInitials()}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
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

            {/*mobile view*/}
            <div className="md:hidden flex items-center space-x-3">
              {isAuthenticated && (
                <div className="w-7 h-7 bg-transparent rounded-full flex items-center justify-center text-xs font-bold border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]">
                  {getUserInitials()}
                </div>
              )}
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-[#8e24aa] hover:text-[#7b1fa2] focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-transparent "
            onClick={closeMobileMenu}
          ></div>
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-base font-medium text-black"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/leads"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-base font-medium text-black"
                  >
                    Leads
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full block px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className={`block px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isLoginPage
                        ? "bg-[#8e24aa] text-white shadow-md hover:bg-[#7b1fa2]"
                        : "border border-[#8e24aa] text-[#8e24aa] hover:bg-[#e1bee7]"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className={`block px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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
      )}
    </>
  );
};

export default Navbar;
