import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Snackbar
} from '@mui/material';
import { useAuthStore } from '../store/authStore';

export const EmailVerificationReminder: React.FC = () => {
  const { user, sendVerificationEmail, isLoading } = useAuthStore();
  const [showSuccess, setShowSuccess] = useState(false);

  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail();
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  };

  return (
    <>
      <Alert
        severity="warning"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleResendVerification}
            disabled={isLoading}
          >
            Resend Email
          </Button>
        }
        sx={{ mb: 2 }}
      >
        <AlertTitle>Email Verification Required</AlertTitle>
        Please verify your email address to access all features.
        Check your inbox for the verification link.
      </Alert>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Verification email sent successfully!
        </Alert>
      </Snackbar>
    </>
  );
}; 