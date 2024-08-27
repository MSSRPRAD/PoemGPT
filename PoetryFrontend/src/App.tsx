import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => !prev);
    document.body.classList.toggle('dark', !darkMode);
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen`}>
          <Header toggleDarkMode={toggleDarkMode} isDarkMode={darkMode} />
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home isDarkMode={darkMode} />} />
              <Route path="/login" element={<Login isDarkMode={darkMode} />} />
              <Route path="/register" element={<Register isDarkMode={darkMode} />} />
              <Route path="/dashboard" element={<UserSection isDarkMode={darkMode} />} />
              <Route path="*" element={<RequireAuth />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

const Home: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="text-center">
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
        This is the home page. Navigate to login or register.
      </p>
    </div>
  );
};

const RequireAuth: React.FC = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

const UserSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { user } = useAuth();
  console.log('Current user in UserSection:', user);

  return (
    <div className={`p-6 rounded-lg shadow-xl transition-shadow duration-300 ease-in-out ${isDarkMode ? 'shadow-gray-800' : 'shadow-gray-300'}`}>
      {user ? (
        <Dashboard isDarkMode={isDarkMode} />
      ) : (
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          Please login to generate poems.
        </p>
      )}
    </div>
  );
};

export default App;