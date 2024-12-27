import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (requireAuth && !user) {
    // Redirect to login page but save the attempted url
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // If we're on an auth page (login/register) and user is already logged in,
    // redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 