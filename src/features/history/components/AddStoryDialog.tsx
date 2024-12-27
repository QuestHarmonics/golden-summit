import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Alert
} from '@mui/material';
import { PhotoCamera as PhotoIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useStorage } from '../../../hooks/useStorage';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (story: { title: string; content: string; photos?: string[] }) => void;
}

export const AddStoryDialog: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { uploadFile } = useStorage();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const url = await uploadFile(file, 'story-photos');
      setPhotos([...photos, url]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      photos: photos.length > 0 ? photos : undefined
    });

    // Reset form
    setTitle('');
    setContent('');
    setPhotos([]);
    setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Story</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Story"
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        
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
            >
              Add Photo
            </Button>
          </label>
          {uploading && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              Uploading...
            </Typography>
          )}
        </Box>

        {/* Photo Preview */}
        {photos.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {photos.map((url, index) => (
              <Box
                key={url}
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100
                }}
              >
                <img
                  src={url}
                  alt={`Story photo ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 4
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemovePhoto(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'background.paper'
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={uploading}>
          Add Story
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 