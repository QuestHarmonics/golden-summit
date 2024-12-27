import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  Close as CloseIcon,
  PhotoLibrary as PhotoIcon
} from '@mui/icons-material';
import { HistoricalAction, HistoricalActionType } from '../types/HistoricalActions';
import { HistoricalNode } from '../../family/types/FamilyTree';

interface Props {
  node: HistoricalNode;
  actions: HistoricalAction[];
}

interface StoryData {
  id: string;
  title: string;
  content: string;
  photos?: string[];
  date: Date;
  addedBy: string;
}

export const StoryList: React.FC<Props> = ({ node, actions }) => {
  const [selectedStory, setSelectedStory] = useState<StoryData | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get stories from both historical actions and node's stories
  const stories: StoryData[] = [
    // Stories from historical actions
    ...actions
      .filter(action => action.type === HistoricalActionType.ADD_STORY && action.data.storyId)
      .map(action => ({
        id: action.data.storyId || '',
        title: action.data.verificationDetails?.field === 'title'
          ? action.data.verificationDetails.newValue
          : '',
        content: action.data.verificationDetails?.field === 'content'
          ? action.data.verificationDetails.newValue
          : '',
        photos: action.data.verificationDetails?.field === 'photos'
          ? action.data.verificationDetails.newValue
          : undefined,
        date: action.timestamp.toDate(),
        addedBy: action.userId
      })),
    // Stories from node's stories
    ...(node.stories || []).map(story => ({
      id: story.id,
      title: story.title,
      content: story.content,
      photos: story.photos,
      date: story.addedAt.toDate(),
      addedBy: story.addedBy
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (stories.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No stories have been added yet. Click the "Add Story" button above to add the first story.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {stories.map(story => (
          <Grid item xs={12} sm={6} md={4} key={story.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.shadows[4]
                }
              }}
              onClick={() => setSelectedStory(story)}
            >
              {story.photos?.[0] && (
                <CardMedia
                  component="img"
                  height="140"
                  image={story.photos[0]}
                  alt={story.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {story.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {story.content}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {story.date.toLocaleDateString()}
                  </Typography>
                  {story.photos && story.photos.length > 0 && (
                    <Chip
                      icon={<PhotoIcon />}
                      label={story.photos.length}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Story Dialog */}
      <Dialog
        open={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedStory && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedStory.title}</Typography>
                <IconButton onClick={() => setSelectedStory(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedStory.content}
              </Typography>
              {selectedStory.photos && selectedStory.photos.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Photos
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedStory.photos.map((photo, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '100%',
                            cursor: 'pointer',
                            '&:hover': {
                              '& .MuiIconButton-root': {
                                opacity: 1
                              }
                            }
                          }}
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <img
                            src={photo}
                            alt={`Story photo ${index + 1}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: theme.shape.borderRadius
                            }}
                          />
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              bgcolor: 'rgba(0, 0, 0, 0.5)',
                              '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.7)'
                              }
                            }}
                          >
                            <ZoomInIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Added by: {selectedStory.addedBy}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {selectedStory.date.toLocaleDateString()}
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

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
            <img
              src={selectedPhoto}
              alt="Story photo"
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}; 