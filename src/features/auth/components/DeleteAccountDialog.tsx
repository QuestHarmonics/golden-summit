import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { LoadingTransition } from '../../../components/ui/LoadingTransition';

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onClose
}) => {
  const navigate = useNavigate();
  const { deleteAccount, isLoading, error } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      return;
    }

    try {
      await deleteAccount(password);
      onClose();
      navigate('/login');
    } catch (error) {
      console.error('Account deletion failed:', error);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmText('');
    setShowConfirm(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <LoadingTransition loading={isLoading} message="Deleting account...">
        <DialogTitle color="error">
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              This action cannot be undone. All your data will be permanently deleted.
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {password && (
              <Box>
                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                  To confirm deletion, type "DELETE" below:
                </Typography>
                <TextField
                  fullWidth
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={!password || confirmText !== 'DELETE' || isLoading}
          >
            Delete Account
          </Button>
        </DialogActions>
      </LoadingTransition>
    </Dialog>
  );
}; 