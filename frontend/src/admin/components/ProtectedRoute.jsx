import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../../core/components/ui/LoadingSpinner';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage message="Authentification..." />;
  if (!user) return <Navigate to="/" replace />;
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
