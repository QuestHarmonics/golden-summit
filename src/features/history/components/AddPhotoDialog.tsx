import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  IconButton
} from '@mui/material';
import { PhotoCamera as PhotoIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { Timestamp } from 'firebase/firestore';
import { useStorage } from '../../../hooks/useStorage';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (photo: { url: string; caption: string; date?: Timestamp }) => void;
}

export const AddPhotoDialog: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { uploadFile, deleteFile } = useStorage();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Delete previous photo if exists
      if (photoUrl) {
        await deleteFile(photoUrl);
      }

      const url = await uploadFile(file, 'historical-photos');
      setPhotoUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!photoUrl) return;

    try {
      await deleteFile(photoUrl);
      setPhotoUrl(null);
    } catch (err: any) {
      setError(err.message || 'Failed to remove photo');
    }
  };

  const handleSubmit = () => {
    if (!photoUrl) {
      setError('Photo is required');
      return;
    }
    if (!caption.trim()) {
      setError('Caption is required');
      return;
    }

    onSubmit({
      url: photoUrl,
      caption: caption.trim(),
      date: date ? Timestamp.fromDate(date) : undefined
    });

    // Reset form
    setPhotoUrl(null);
    setCaption('');
    setDate(null);
    setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Historical Photo</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Photo Upload */}
        <Box sx={{ mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload"
            type="file"
            onChange={handlePhotoUpload}
            disabled={uploading}
          />
          <label htmlFor="photo-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoIcon />}
              disabled={uploading}
              fullWidth={!photoUrl}
              sx={{ mb: 1 }}
            >
              {photoUrl ? 'Change Photo' : 'Upload Photo'}
            </Button>
          </label>
          {uploading && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              Uploading...
            </Typography>
          )}
        </Box>

        {/* Photo Preview */}
        {photoUrl && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 200,
              mb: 2
            }}
          >
            <img
              src={photoUrl}
              alt="Historical photo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            <IconButton
              size="small"
              onClick={handleRemovePhoto}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'background.paper'
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}

        <TextField
          label="Caption"
          multiline
          rows={2}
          fullWidth
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{ mb: 2 }}
        />

        <DatePicker
          label="Photo Date (Optional)"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal'
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={uploading}>
          Add Photo
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 