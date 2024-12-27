import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" gutterBottom>
        Oops! Something went wrong
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
          ? error.message
          : 'An unexpected error occurred'}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.href = '/golden-summit/'}
      >
        Go to Home
      </Button>
    </Box>
  );
} 