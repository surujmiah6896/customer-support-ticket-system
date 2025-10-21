
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaSignOutAlt, FaTicketAlt } from "react-icons/fa";
import { Button } from "../../widgets/Button";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl flex flex-col items-center font-bold text-gray-800">
                <FaTicketAlt size={30} /> Customer Support System
              </span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:ml-6 md:flex md:space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Tickets
                </Link>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {user?.role}
                </span>
                <span className="text-gray-700 text-sm">
                  Welcome, <span className="font-semibold">{user?.name}</span>
                </span>
              </div>
              <div>
                <Button onClick={handleLogout}><FaSignOutAlt/> Logout</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
