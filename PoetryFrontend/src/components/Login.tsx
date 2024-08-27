import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(credentials.email, credentials.password);
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'Login failed. Please try again.');
      } else {
        setError('Network error. Please try again later.');
      }
    }
  };

  const formClass = `max-w-md w-full p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out ${error ? 'shadow-xl ring-2 ring-red-500' : 'shadow-md'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const inputClass = `w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`;
  const buttonClass = `w-full py-3 rounded-md text-lg font-semibold transition duration-300 ease-in-out shadow-md transform hover:scale-105 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`;

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <form onSubmit={handleSubmit} className={formClass}>
        <h2 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {['email', 'password'].map((field) => (
          <div key={field} className={field === 'password' ? "mb-6" : "mb-4"}>
            <input
              type={field}
              name={field}
              value={credentials[field as keyof typeof credentials]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
              className={inputClass}
            />
          </div>
        ))}
        <button type="submit" className={buttonClass}>Login</button>
      </form>
    </div>
  );
};