import React, { useState } from 'react';
import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { HistoricalAction, HistoricalActionType } from '../types/HistoricalActions';
import { HistoricalNode } from '../../family/types/FamilyTree';

interface Props {
  node: HistoricalNode;
  actions: HistoricalAction[];
}

interface PhotoData {
  url: string;
  caption: string;
  date?: Date;
  addedBy?: string;
}

export const PhotoGallery: React.FC<Props> = ({ node, actions }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get photos from both historical actions and node's historical photos
  const photos: PhotoData[] = [
    // Photos from historical actions
    ...actions
      .filter(action => action.type === HistoricalActionType.ADD_PHOTO && action.data.photoId)
      .map(action => ({
        url: action.data.photoId || '',
        caption: action.data.verificationDetails?.field === 'caption' 
          ? action.data.verificationDetails.newValue 
          : '',
        date: action.timestamp?.toDate(),
        addedBy: action.userId
      })),
    // Photos from node's historical photos
    ...(node.historicalPhotos || []).map(photo => ({
      url: photo.url,
      caption: photo.caption,
      date: photo.date?.toDate(),
      addedBy: photo.addedBy
    }))
  ].sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

  if (photos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No photos have been added yet. Click the "Add Photo" button above to add the first photo.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <ImageList cols={isMobile ? 2 : 3} gap={8}>
        {photos.map((photo, index) => (
          <ImageListItem
            key={`${photo.url}_${index}`}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                '& .MuiImageListItemBar-root': {
                  opacity: 1
                }
              }
            }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <ImageListItemBar
              title={photo.caption}
              subtitle={photo.date?.toLocaleDateString()}
              sx={{
                opacity: 0,
                transition: 'opacity 0.2s',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
              }}
              actionIcon={
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label="view photo"
                >
                  <ZoomInIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Photo Dialog */}
      <Dialog
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedPhoto(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'background.default'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedPhoto && (
            <>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                style={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">{selectedPhoto.caption}</Typography>
                <Box sx={{ mt: 1 }}>
                  {selectedPhoto.date && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedPhoto.date.toLocaleDateString()}
                    </Typography>
                  )}
                  {selectedPhoto.addedBy && (
                    <Typography variant="body2" color="text.secondary">
                      Added by: {selectedPhoto.addedBy}
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}; 