import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Celebration as CelebrationIcon,
  Group as GroupIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useFamilyStore } from '../../../store/familyStore';
import { FamilyQuest, FamilyTradition } from '../types/FamilyTypes';

export const FamilyDashboard: React.FC = () => {
  const { currentFamily, families } = useFamilyStore();

  if (!currentFamily || !families[currentFamily]) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">
          Please join or create a family to view dashboard
        </Typography>
      </Box>
    );
  }

  const family = families[currentFamily];
  const activeQuests = family.quests.filter(q => q.progress.status === 'active');
  const upcomingTraditions = family.traditions.filter(t => !t.lastCelebrated || isTimeForTradition(t));
  const recentAchievements = family.legacies.filter(l => l.type === 'achievement').slice(0, 3);

  const isTimeForTradition = (tradition: FamilyTradition): boolean => {
    if (!tradition.lastCelebrated) return true;

    const now = new Date();
    const last = new Date(tradition.lastCelebrated);
    const daysSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

    switch (tradition.frequency) {
      case 'daily': return daysSince >= 1;
      case 'weekly': return daysSince >= 7;
      case 'monthly': return daysSince >= 30;
      case 'yearly': return daysSince >= 365;
      default: return true;
    }
  };

  const renderQuestCard = (quest: FamilyQuest) => {
    const progress = Math.round(quest.progress.overallProgress * 100);

    return (
      <ListItem
        key={quest.id}
        secondaryAction={
          <IconButton edge="end">
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <StarIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={quest.title}
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
          }
        />
      </ListItem>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Family Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Family Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GroupIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Family Stats
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <AvatarGroup max={6}>
                {family.members.map(member => (
                  <Avatar
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Family Level
              </Typography>
              <Typography variant="h4">
                {family.stats.familyLevel}
              </Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Legacy Points
              </Typography>
              <Typography variant="h4">
                {family.stats.legacyPoints}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Active Traditions
              </Typography>
              <Typography variant="h4">
                {family.stats.activeTraditions}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Active Quests */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StarIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Active Quests
              </Typography>
              <Chip
                label={activeQuests.length}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            </Box>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {activeQuests.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No active quests"
                    secondary="Complete your current quests to unlock new ones!"
                  />
                </ListItem>
              ) : (
                activeQuests.map(renderQuestCard)
              )}
            </List>
          </Card>
        </Grid>

        {/* Upcoming Traditions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CelebrationIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Upcoming Traditions
              </Typography>
              <Chip
                label={upcomingTraditions.length}
                size="small"
                color="secondary"
                sx={{ ml: 1 }}
              />
            </Box>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {upcomingTraditions.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No upcoming traditions"
                    secondary="Create new traditions to bring your family closer!"
                  />
                </ListItem>
              ) : (
                upcomingTraditions.map(tradition => (
                  <ListItem
                    key={tradition.id}
                    secondaryAction={
                      <IconButton edge="end">
                        <ArrowForwardIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <CelebrationIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={tradition.name}
                      secondary={`${tradition.participants.length} participants`}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Card>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrophyIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Recent Achievements
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {recentAchievements.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary">
                    No achievements yet. Complete quests and celebrate traditions to earn achievements!
                  </Typography>
                </Grid>
              ) : (
                recentAchievements.map(achievement => (
                  <Grid item xs={12} sm={4} key={achievement.id}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: 'success.main', mr: 1 }}>
                          <TrophyIcon />
                        </Avatar>
                        <Typography variant="h6">
                          {achievement.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {achievement.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Impact:
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, (achievement.impact / 100) * 100)}
                          sx={{ flexGrow: 1, mx: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {achievement.impact}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 