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

  return (
    <header className={`bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-blue-600 to-blue-700'} p-4 shadow-md transition duration-300`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-white'}`}>
          Enterprise Solutions
        </h1>
        <nav className="flex items-center space-x-8">
          <ul className="flex items-center space-x-6">
            <li>
              <Link 
                to="/" 
                className={`btn rounded-full px-4 py-2 ${isDarkMode ? 'text-gray-300' : 'text-white'} hover:shadow-xl hover:scale-105 transition`}
              >
                <FaHome className="mr-2" />
                Home
              </Link>
            </li>
            {!user ? (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className={`btn rounded-full px-4 py-2 ${isDarkMode ? 'text-gray-300' : 'text-white'} hover:shadow-xl hover:scale-105 transition`}
                  >
                    <FaSignInAlt className="mr-2" />
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className={`btn rounded-full px-4 py-2 ${isDarkMode ? 'text-gray-300' : 'text-white'} hover:shadow-xl hover:scale-105 transition`}
                  >
                    <FaUserPlus className="mr-2" />
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`btn rounded-full px-4 py-2 ${isDarkMode ? 'text-gray-300' : 'text-white'} hover:shadow-xl hover:scale-105 transition`}
                  >
                    <FaUser className="mr-2" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout} 
                    className={`btn rounded-full px-4 py-2 ${isDarkMode ? 'text-gray-300' : 'text-white'} hover:shadow-xl hover:scale-105 transition`}
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </li>
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