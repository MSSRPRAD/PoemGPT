import React from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaHome, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  const { logout, user } = useAuth();

  const headerClass = `bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-blue-600 to-blue-700'} p-4 shadow-xl transition duration-600`;
  const linkClass = `btn rounded-full px-4 py-2 ${isDarkMode ? 'text-gray-300' : 'text-white'} hover:shadow-xl hover:scale-125 transition`;

  const NavLink: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
    <li>
      <Link to={to} className={linkClass}>
        {icon}
        {text}
      </Link>
    </li>
  );

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-white'}`}>
          Poetry Generator
        </h1>
        <nav className="flex items-center space-x-8">
          <ul className="flex items-center space-x-6">
            <NavLink to="/" icon={<FaHome className="mr-2" />} text="Home" />
            {user ? (
              <>
                <NavLink to="/dashboard" icon={<FaUser className="mr-2" />} text="Dashboard" />
                <li>
                  <button onClick={logout} className={linkClass}>
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <NavLink to="/login" icon={<FaSignInAlt className="mr-2" />} text="Login" />
                <NavLink to="/register" icon={<FaUserPlus className="mr-2" />} text="Register" />
              </>
            )}
          </ul>
          <button
            onClick={toggleDarkMode}
            className={`ml-4 p-2 rounded-full shadow-xl transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} transform hover:scale-110`}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <FaSun className="w-5 h-5 text-yellow-500" /> : <FaMoon className="w-5 h-5 text-gray-800" />}
          </button>
        </nav>
      </div>
    </header>
  );
};