import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme
} from '@mui/material';

export const AuthLayout: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          py: 8
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Family Quest
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Embark on a journey of family growth and adventure
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Outlet />
        </Paper>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} Family Quest. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}; 