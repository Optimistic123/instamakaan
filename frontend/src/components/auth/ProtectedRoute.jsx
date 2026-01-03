import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route (optional)
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect based on user role to their appropriate dashboard
    if (user?.role === 'owner') {
      return <Navigate to="/owner" replace />;
    } else if (user?.role === 'agent') {
      return <Navigate to="/agent" replace />;
    }
    // Default redirect for unauthorized roles
    return <Navigate to="/admin" replace />;
  }

  return children;
};

/**
 * RoleBasedRedirect - Redirects users to their appropriate dashboard based on role
 */
export const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect based on role
  if (user?.role === 'owner') {
    return <Navigate to="/owner" replace />;
  } else if (user?.role === 'agent') {
    return <Navigate to="/agent" replace />;
  }
  
  // Default to admin for admin users
  return <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
