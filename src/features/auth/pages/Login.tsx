import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

export const Login: React.FC = () => {
  const { signIn, signInWithGoogle, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
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
        Welcome Back
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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
        value={formData.email}
        onChange={handleChange}
        error={!!error}
      />

      <TextField
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={!!error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Box sx={{ textAlign: 'right' }}>
        <Link
          component={RouterLink}
          to="/auth/forgot-password"
          variant="body2"
          sx={{ textDecoration: 'none' }}
        >
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !formData.email || !formData.password}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
          OR
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        Continue with Google
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/auth/register"
            variant="body2"
            sx={{ textDecoration: 'none' }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}; 