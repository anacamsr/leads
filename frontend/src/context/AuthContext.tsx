'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_KEY } from '@/config/api'; 

interface AuthContextType {
  isAuthenticated: boolean;
  login: (key: string) => boolean; 
  logout: () => void;
  authToken: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY_NAME = 'admin_auth_token'; 

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_KEY_NAME);
    
    if (storedToken === API_KEY) {
      setAuthToken(storedToken);
      setIsAuthenticated(true);
    } else {
        localStorage.removeItem(AUTH_KEY_NAME);
        setAuthToken(null);
        setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const login = (key: string): boolean => { 
    if (key && key === API_KEY) {
      localStorage.setItem(AUTH_KEY_NAME, key);
      setAuthToken(key);
      setIsAuthenticated(true);
      return true;
    } else {
      console.error("Chave de autenticação inválida.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY_NAME);
    setAuthToken(null);
    setIsAuthenticated(false);
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, authToken, loading }}>
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
