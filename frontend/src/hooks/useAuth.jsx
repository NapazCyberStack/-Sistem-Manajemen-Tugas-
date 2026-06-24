import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user on mount
  useEffect(() => {
    const activeUser = authService.getCurrentUser();
    if (activeUser) {
      setUser(activeUser);
    }
    setLoading(false);
  }, []);

  // Listen for session expiration events from API service
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setError('Sesi login Anda telah berakhir. Silakan login kembali.');
    };

    window.addEventListener('auth_session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth_session_expired', handleSessionExpired);
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      setLoading(false);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Register handler
  const register = async (username, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const registeredUser = await authService.register(username, email, password, role);
      setUser(registeredUser);
      setLoading(false);
      return registeredUser;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
