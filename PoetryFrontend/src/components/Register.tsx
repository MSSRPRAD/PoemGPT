import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Register: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [userData, setUserData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string>('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(userData.name, userData.email, userData.password);
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'Registration failed. Please try again.');
      } else {
        setError('Network error. Please try again later.');
      }
    }
  };

  const formClass = `max-w-md w-full p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const inputClass = `w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 shadow-sm ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-800'}`;
  const buttonClass = `w-full py-2 rounded-md transition duration-300 ease-in-out shadow-md transform hover:scale-105 ${isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className={formClass}>
        <h2 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {['name', 'email', 'password'].map((field) => (
          <div key={field} className={field === 'password' ? "mb-6" : "mb-4"}>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={userData[field as keyof typeof userData]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
              className={inputClass}
            />
          </div>
        ))}
        <button type="submit" className={buttonClass}>Register</button>
      </form>
    </div>
  );
};