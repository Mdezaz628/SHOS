import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_ROUTES } from '../constants/roles';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is strictly restricted and current role isn't allowed, redirect to their role home
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    const defaultRoleRoute = ROLE_ROUTES[currentRole] || '/admin';
    return <Navigate to={defaultRoleRoute} replace />;
  }

  return children;
};
