import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useAuthStore } from '../store/authStore';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

interface RegisterErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  displayName?: string;
}

const steps = ['Account Details', 'Personal Information'];

const Register: React.FC = () => {
  const { register, isLoading, error } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [errors, setErrors] = useState<RegisterErrors>({});

  const validateStep = (step: number): boolean => {
    const newErrors: RegisterErrors = {};

    if (step === 0) {
      if (!form.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      if (!form.password) {
        newErrors.password = 'Password is required';
      } else if (form.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (!form.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 1) {
      if (!form.displayName) {
        newErrors.displayName = 'Display name is required';
      } else if (form.displayName.length < 2) {
        newErrors.displayName = 'Display name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    try {
      await register(form.email, form.password, form.displayName);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof RegisterErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={isLoading}
              sx={{ mb: 3 }}
            />
          </>
        );
      case 1:
        return (
          <TextField
            fullWidth
            label="Display Name"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            error={!!errors.displayName}
            helperText={errors.displayName}
            disabled={isLoading}
            sx={{ mb: 3 }}
          />
        );
      default:
        return null;
    }
  };

  return (
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
          Create Account
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Join Family Quest and start your journey
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || isLoading}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isLoading}
              >
                Next
              </Button>
            )}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Navigate to login page
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Register; 