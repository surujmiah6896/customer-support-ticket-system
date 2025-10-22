import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaSignOutAlt, FaTicketAlt, FaBars, FaTimes } from "react-icons/fa";
import { Button } from "../../widgets/Button";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-indigo-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex-shrink-0 flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-xl flex flex-col sm:flex-row sm:items-center gap-2 font-bold text-gray-800">
                <FaTicketAlt className="text-indigo-600" size={24} />
                <span className="hidden sm:inline">
                  Customer Support System
                </span>
                <span className="sm:hidden">Support System</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:ml-6 md:flex md:space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Tickets
                </Link>
              </div>
            )}
          </div>

          {/* Right side - User info and actions */}
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
    
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-gray-700 text-sm">
                    Welcome, <span className="font-semibold">{user?.name}</span>
                  </span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full border border-indigo-200">
                    {user?.role}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <Button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <FaSignOutAlt size={14} />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>

              <div className="sm:hidden">
                <Button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
                  title="Logout"
                >
                  <FaSignOutAlt size={16} />
                </Button>
              </div>

              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <FaTimes className="block h-6 w-6" />
                  ) : (
                    <FaBars className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
            
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tickets
              </Link>

              {/* Mobile User Info */}
              <div className="px-3 py-2 border-t border-gray-100">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm text-gray-600">
                    Signed in as{" "}
                    <span className="font-semibold text-gray-800">
                      {user?.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full border border-indigo-200">
                      {user?.role}
                    </span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Logout Button */}
              <div className="px-3 py-2 border-t border-gray-100">
                <Button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <FaSignOutAlt size={14} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
