import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
  EmojiEvents as AchievementsIcon,
  Timeline as StatsIcon
} from '@mui/icons-material';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../../auth/store/authStore';
import { ProfileStats } from '../components/ProfileStats';
import { ProfileAchievements } from '../components/ProfileAchievements';
import { ProfileSettings } from '../components/ProfileSettings';
import { EditProfileDialog } from '../components/EditProfileDialog';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { currentProfile, loading, error, fetchProfile } = useProfileStore();
  const [tabValue, setTabValue] = useState(0);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      fetchProfile(currentUser.uid);
    }
  }, [currentUser?.uid, fetchProfile]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentProfile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Profile not found. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={currentProfile.avatarUrl}
              sx={{ width: 120, height: 120 }}
            >
              {currentProfile.displayName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {currentProfile.displayName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {currentProfile.bio || 'No bio provided'}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                Level {currentProfile.level}
              </Typography>
              <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                {currentProfile.xp} XP
              </Typography>
              <Typography variant="body2" component="span">
                {currentProfile.gold} Gold
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="profile tabs"
          centered
        >
          <Tab icon={<StatsIcon />} label="Stats" />
          <Tab icon={<AchievementsIcon />} label="Achievements" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <ProfileStats stats={currentProfile.stats} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ProfileAchievements achievements={currentProfile.achievements} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ProfileSettings
          settings={currentProfile.settings}
          preferences={currentProfile.preferences}
        />
      </TabPanel>

      <EditProfileDialog
        open={isEditDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        profile={currentProfile}
      />
    </Container>
  );
}; 