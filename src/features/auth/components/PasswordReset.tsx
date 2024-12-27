import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Link
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { LoadingTransition } from '../../../components/ui/LoadingTransition';

interface PasswordResetForm {
  email: string;
}

const PasswordReset: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState<PasswordResetForm>({ email: '' });
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
  }, [clearError]);

  const validateForm = (): boolean => {
    if (!form.email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await resetPassword(form.email);
      setSuccess(true);
      setForm({ email: '' });
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm({ email: value });
    setEmailError(undefined);
  };

  return (
    <LoadingTransition loading={isLoading} message="Sending reset instructions...">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 2
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 400,
            width: '100%'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
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

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset instructions have been sent to your email.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
              disabled={isLoading}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              Send Reset Instructions
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
              >
                Back to Sign In
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </LoadingTransition>
  );
};

export default PasswordReset; 