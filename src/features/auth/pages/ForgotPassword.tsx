import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuthStore } from '../store/authStore';

export const ForgotPassword: React.FC = () => {
  const { resetPassword, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    try {
      await resetPassword(email);
      setSuccessMessage('Password reset email sent. Please check your inbox.');
      setEmail('');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Reset Password
      </Typography>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Enter your email address and we'll send you instructions to reset your password.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <TextField
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !email}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link
          component={RouterLink}
          to="/auth/login"
          variant="body2"
          sx={{ textDecoration: 'none' }}
        >
          Back to Login
        </Link>
      </Box>
    </Box>
  );
}; 