import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar
} from '@mui/material';
import {
  Assignment as QuestIcon,
  Star as StarIcon,
  TrendingUp as LevelIcon,
  Group as FamilyIcon
} from '@mui/icons-material';
import { useProfileStore } from '../../profile/store/profileStore';
import { useFamilyStore } from '../../family/store/familyStore';
import { useQuestStore } from '../../quests/store/questStore';

const Dashboard: React.FC = () => {
  const { currentProfile } = useProfileStore();
  const { currentFamily } = useFamilyStore();
  const { activeQuests, completedQuests } = useQuestStore();

  // Calculate XP progress to next level with safe defaults
  const level = currentProfile?.level || 1;
  const xpToNextLevel = level * 1000;
  const currentXP = currentProfile?.xp || 0;
  const xpForCurrentLevel = ((currentXP || 0) % xpToNextLevel);
  const xpProgress = xpForCurrentLevel > 0 ? (xpForCurrentLevel / xpToNextLevel * 100) : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* User Progress Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={currentProfile?.avatarUrl}
              sx={{ width: 64, height: 64, mr: 2 }}
            >
              {currentProfile?.displayName?.charAt(0) || '?'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                Welcome back, {currentProfile?.displayName || 'Adventurer'}!
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LevelIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Level {level}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={xpProgress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {xpForCurrentLevel.toFixed(0)}/{xpToNextLevel} XP
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuestIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Active Quests</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {activeQuests?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completedQuests?.length || 0} quests completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total XP</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {currentXP.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentProfile?.gold?.toFixed(0) || '0'} gold earned
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FamilyIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Family Level</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {currentFamily?.level || 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentFamily?.members?.length || 0} family members
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {(activeQuests || []).slice(0, 5).map((quest: any) => (
                <ListItem key={quest.id}>
                  <ListItemIcon>
                    <QuestIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={quest.title}
                    secondary={`Assigned to: ${quest.assignedTo || 'Unassigned'}`}
                  />
                  <Chip
                    label={`${quest.xpReward || 0} XP`}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${quest.goldReward || 0} Gold`}
                    color="warning"
                    size="small"
                  />
                </ListItem>
              ))}
              {(!activeQuests || activeQuests.length === 0) && (
                <ListItem>
                  <ListItemText primary="No active quests" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 