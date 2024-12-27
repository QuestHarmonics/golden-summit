import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '../store/authStore';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  return <>{children}</>;
}; 