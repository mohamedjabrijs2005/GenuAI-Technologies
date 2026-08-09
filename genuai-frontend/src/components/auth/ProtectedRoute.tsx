import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactElement;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="GenuAI Technologies" className="w-16 h-16 object-contain animate-pulse" />
          <p className="text-on-surface-variant text-sm font-medium">Verifying authenticated session...</p>
        </div>
      </div>
    );
  }

  // 1. If not authenticated, redirect to /auth preserving destination
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 2. If route has role authorization restrictions, verify user's real database role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role;
    if (!allowedRoles.includes(userRole)) {
      console.warn(`[Auth Guard] Unauthorized access attempt for role '${userRole}' to '${location.pathname}'`);
      if (userRole === 'admin') return <Navigate to="/admin" replace />;
      if (userRole === 'company') return <Navigate to="/company" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};
