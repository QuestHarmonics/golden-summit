import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Button,
  Chip,
  Grid,
  Avatar,
  Dialog,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoIcon,
  Event as EventIcon,
  Verified as VerifiedIcon,
  EmojiEvents as AchievementIcon,
  History as TimelineIcon,
  Map as MapIcon,
  Book as StoryIcon
} from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';
import { HistoricalNode } from '../../family/types/FamilyTree';
import { useHistoricalActionStore } from '../store/historicalActionStore';
import { HistoricalActionType, HistoricalQuestType } from '../types/HistoricalActions';
import { useProfileStore } from '../../profile/store/profileStore';
import { AddStoryDialog } from './AddStoryDialog';
import { AddPhotoDialog } from './AddPhotoDialog';
import { AddEventDialog } from './AddEventDialog';
import { TimelineView } from './TimelineView';
import { PhotoGallery } from './PhotoGallery';
import { StoryList } from './StoryList';
import { QuestList } from './QuestList';
import { AchievementList } from './AchievementList';

interface Props {
  node: HistoricalNode;
  onEdit?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`historical-tabpanel-${index}`}
      aria-labelledby={`historical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const HistoricalNodeView: React.FC<Props> = ({ node, onEdit }) => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState<'story' | 'photo' | 'event' | null>(null);
  const [rewardAnimation, setRewardAnimation] = useState<{ xp: number; gold: number } | null>(null);

  const { actions, quests, loading, error, fetchActions, fetchQuests, recordAction } = useHistoricalActionStore();
  const { currentUser } = useProfileStore();

  useEffect(() => {
    fetchActions(node.id);
    fetchQuests(node.id);
  }, [node.id]);

  const handleAddStory = async (story: { title: string; content: string; photos?: string[] }) => {
    if (!currentUser) return;
    await recordAction(
      HistoricalActionType.ADD_STORY,
      node.id,
      currentUser.id,
      { storyId: `story_${Date.now()}`, ...story }
    );
    setOpenDialog(null);
    setRewardAnimation(HISTORICAL_ACTION_REWARDS[HistoricalActionType.ADD_STORY]);
    setTimeout(() => setRewardAnimation(null), 2000);
  };

  const handleAddPhoto = async (photo: { url: string; caption: string; date?: Timestamp }) => {
    if (!currentUser) return;
    await recordAction(
      HistoricalActionType.ADD_PHOTO,
      node.id,
      currentUser.id,
      { photoId: `photo_${Date.now()}`, ...photo }
    );
    setOpenDialog(null);
    setRewardAnimation(HISTORICAL_ACTION_REWARDS[HistoricalActionType.ADD_PHOTO]);
    setTimeout(() => setRewardAnimation(null), 2000);
  };

  const handleAddEvent = async (event: { title: string; date: Timestamp; description: string }) => {
    if (!currentUser) return;
    await recordAction(
      HistoricalActionType.ADD_LIFE_EVENT,
      node.id,
      currentUser.id,
      { eventId: `event_${Date.now()}`, ...event }
    );
    setOpenDialog(null);
    setRewardAnimation(HISTORICAL_ACTION_REWARDS[HistoricalActionType.ADD_LIFE_EVENT]);
    setTimeout(() => setRewardAnimation(null), 2000);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                src={node.profilePhoto}
                alt={`${node.firstName} ${node.lastName}`}
                sx={{ width: 80, height: 80 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4">
                {node.firstName} {node.lastName}
                {onEdit && (
                  <IconButton onClick={onEdit} size="small" sx={{ ml: 1 }}>
                    <EditIcon />
                  </IconButton>
                )}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {node.birthDate?.toDate().getFullYear()} - {node.deathDate?.toDate().getFullYear()}
              </Typography>
              {node.occupation && (
                <Chip
                  label={node.occupation}
                  size="small"
                  sx={{ mr: 1 }}
                />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<StoryIcon />}
          variant="contained"
          onClick={() => setOpenDialog('story')}
          sx={{ mr: 1 }}
        >
          Add Story
        </Button>
        <Button
          startIcon={<PhotoIcon />}
          variant="contained"
          onClick={() => setOpenDialog('photo')}
          sx={{ mr: 1 }}
        >
          Add Photo
        </Button>
        <Button
          startIcon={<EventIcon />}
          variant="contained"
          onClick={() => setOpenDialog('event')}
        >
          Add Event
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab icon={<TimelineIcon />} label="Timeline" />
          <Tab icon={<StoryIcon />} label="Stories" />
          <Tab icon={<PhotoIcon />} label="Photos" />
          <Tab icon={<AchievementIcon />} label="Achievements" />
          <Tab icon={<MapIcon />} label="Quests" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <TimelineView node={node} actions={actions} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <StoryList node={node} actions={actions} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <PhotoGallery node={node} actions={actions} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <AchievementList node={node} actions={actions} />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <QuestList node={node} quests={quests} />
      </TabPanel>

      {/* Dialogs */}
      <AddStoryDialog
        open={openDialog === 'story'}
        onClose={() => setOpenDialog(null)}
        onSubmit={handleAddStory}
      />
      <AddPhotoDialog
        open={openDialog === 'photo'}
        onClose={() => setOpenDialog(null)}
        onSubmit={handleAddPhoto}
      />
      <AddEventDialog
        open={openDialog === 'event'}
        onClose={() => setOpenDialog(null)}
        onSubmit={handleAddEvent}
      />

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Reward Animation */}
      {rewardAnimation && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            animation: 'fadeInOut 2s ease-in-out',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
              '50%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1.2)' },
              '100%': { opacity: 0, transform: 'translate(-50%, -50%) scale(1)' }
            }
          }}
        >
          <Typography variant="h4" color="primary" align="center">
            +{rewardAnimation.xp} XP
          </Typography>
          <Typography variant="h5" color="secondary" align="center">
            +{rewardAnimation.gold} Gold
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 