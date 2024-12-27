import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingTransitionProps {
  loading: boolean;
  message?: string;
  children?: React.ReactNode;
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({
  loading,
  message,
  children
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        {message && (
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return <>{children}</>;
}; 