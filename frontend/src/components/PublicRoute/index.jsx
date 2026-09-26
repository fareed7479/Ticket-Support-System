import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './index.css';

/**
 * PublicRoute (Guest Guard)
 * Prevents authenticated users from accessing public pages (like /login or /register).
 * Redirects logged-in users directly to their appropriate role dashboard.
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
        <p>Checking authentication state...</p>
      </div>
    );
  }

  if (user) {
    // Already authenticated: redirect to respective dashboard
    const redirectPath = user.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
