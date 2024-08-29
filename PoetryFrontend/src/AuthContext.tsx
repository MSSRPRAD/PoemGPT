import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from './types';
import { api } from './api';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Add this line
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    if (response.status === 200) {
      console.log('Fetched user data:', response.data);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.register(name, email, password);
    if (response.status === 201) {
      await login(email, password);
    }
  };

  const logout = async () => {
    const response = await api.logout();
    if (response.status === 200) {
      setUser(null);
    }
  };

  // Log user whenever it changes
  useEffect(() => {
    console.log('User state updated:', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}> {/* Include setUser here */}
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};