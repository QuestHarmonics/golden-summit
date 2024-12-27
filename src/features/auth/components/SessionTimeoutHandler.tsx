import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useAuthStore } from '../store/authStore';

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes before timeout

export const SessionTimeoutHandler: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateLastActivity, checkSessionTimeout } = useAuthStore();
  const [showWarning, setShowWarning] = React.useState(false);

  const handleUserActivity = useCallback(() => {
    if (user) {
      updateLastActivity();
    }
  }, [user, updateLastActivity]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, navigate]);

  const checkTimeout = useCallback(() => {
    if (user && checkSessionTimeout()) {
      handleLogout();
    } else if (user) {
      const lastActivity = user.lastActivity || Date.now();
      const timeUntilTimeout = (lastActivity + 30 * 60 * 1000) - Date.now();
      
      if (timeUntilTimeout <= WARNING_BEFORE_TIMEOUT) {
        setShowWarning(true);
      }
    }
  }, [user, checkSessionTimeout, handleLogout]);

  useEffect(() => {
    // Add activity event listeners
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Set up interval to check for timeout
    const intervalId = setInterval(checkTimeout, 60 * 1000); // Check every minute

    return () => {
      // Clean up event listeners
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(intervalId);
    };
  }, [handleUserActivity, checkTimeout]);

  const handleExtendSession = () => {
    updateLastActivity();
    setShowWarning(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog
      open={showWarning}
      onClose={handleExtendSession}
    >
      <DialogTitle>
        Session Timeout Warning
      </DialogTitle>
      <DialogContent>
        <Typography>
          Your session is about to expire due to inactivity. Would you like to stay signed in?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} color="error">
          Sign Out
        </Button>
        <Button onClick={handleExtendSession} variant="contained" autoFocus>
          Stay Signed In
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 