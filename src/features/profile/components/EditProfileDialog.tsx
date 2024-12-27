import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../../auth/store/authStore';
import { UserProfile } from '../types/Profile';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onClose,
  profile
}) => {
  const { currentUser } = useAuthStore();
  const { updateProfile, loading, error } = useProfileStore();
  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    bio: profile.bio || '',
    avatarUrl: profile.avatarUrl
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser?.uid || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingAvatar(true);
    try {
      const storage = getStorage();
      const avatarRef = ref(storage, `avatars/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(avatarRef, file);
      const downloadUrl = await getDownloadURL(avatarRef);

      setFormData(prev => ({
        ...prev,
        avatarUrl: downloadUrl
      }));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser?.uid) return;

    try {
      await updateProfile(currentUser.uid, {
        displayName: formData.displayName,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl
      });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
            mt: 2
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={formData.avatarUrl}
              sx={{ width: 100, height: 100, mb: 1 }}
            >
              {formData.displayName.charAt(0)}
            </Avatar>
            {uploadingAvatar && (
              <CircularProgress
                size={100}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1
                }}
              />
            )}
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: -8,
                  backgroundColor: 'background.paper'
                }}
                disabled={uploadingAvatar}
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Box>
        </Box>

        <TextField
          autoFocus
          margin="dense"
          name="displayName"
          label="Display Name"
          type="text"
          fullWidth
          value={formData.displayName}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          name="bio"
          label="Bio"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          helperText="Tell us a bit about yourself"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.displayName || loading || uploadingAvatar}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 