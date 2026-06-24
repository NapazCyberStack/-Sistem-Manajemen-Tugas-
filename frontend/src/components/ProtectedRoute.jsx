import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * ProtectedRoute - hanya mengizinkan user yang sudah login
 * Jika role="Admin" diberikan, hanya admin yang boleh akses
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to="/tasks" replace />;
  }

  return children;
};

export default ProtectedRoute;
