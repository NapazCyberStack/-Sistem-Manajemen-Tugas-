import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  // Show a blank loading screen while fetching current session
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If user is already logged in, redirect them to the dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-gradient-dark py-5 px-3">
      <div className="w-100" style={{ maxWidth: '480px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
