import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './index.css';

/**
 * ProtectedRoute (Auth & Role Guard)
 * Ensures user is authenticated and possesses the required role to view target page.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
        <p>Verifying access permissions...</p>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch (e.g., customer attempting to view /agent/* or agent viewing /customer/*)
  if (allowedRole && user.role !== allowedRole) {
    const fallbackPath = user.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
