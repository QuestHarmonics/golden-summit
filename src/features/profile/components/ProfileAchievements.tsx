import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Tooltip
} from '@mui/material';
import {
  Info as InfoIcon,
  Star as StarIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { Achievement } from '../types/Profile';

interface ProfileAchievementsProps {
  achievements: Achievement[];
}

export const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({ achievements }) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const calculateTotalProgress = () => {
    const total = achievements.length;
    const completed = achievements.filter(a => a.progress >= a.maxProgress).length;
    return (completed / total) * 100;
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const progress = (achievement.progress / achievement.maxProgress) * 100;
    const isCompleted = achievement.progress >= achievement.maxProgress;

    return (
      <Card
        elevation={2}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          opacity: isCompleted ? 1 : 0.7,
          transition: 'transform 0.2s, opacity 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            opacity: 1
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}
          >
            {isCompleted ? (
              <StarIcon sx={{ color: 'gold', mr: 1 }} />
            ) : (
              <LockIcon sx={{ color: 'text.secondary', mr: 1 }} />
            )}
            <Typography variant="h6" component="div">
              {achievement.title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {achievement.description}
          </Typography>

          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: isCompleted ? 'success.main' : 'primary.main'
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {achievement.progress}/{achievement.maxProgress}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardActions>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {achievement.rewards.xp && (
              <Chip
                size="small"
                label={`${achievement.rewards.xp} XP`}
                color="primary"
                variant="outlined"
              />
            )}
            {achievement.rewards.gold && (
              <Chip
                size="small"
                label={`${achievement.rewards.gold} Gold`}
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => setSelectedAchievement(achievement)}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Achievement Progress
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={calculateTotalProgress()}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {calculateTotalProgress().toFixed(1)}%
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {achievements.filter(a => a.progress >= a.maxProgress).length} of{' '}
          {achievements.length} achievements completed
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {achievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <AchievementCard achievement={achievement} />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAchievement && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {selectedAchievement.progress >= selectedAchievement.maxProgress ? (
                  <StarIcon sx={{ color: 'gold', mr: 1 }} />
                ) : (
                  <LockIcon sx={{ color: 'text.secondary', mr: 1 }} />
                )}
                {selectedAchievement.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedAchievement.description}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {selectedAchievement.progress}/{selectedAchievement.maxProgress}
                </Typography>
              </Box>
              <Typography variant="subtitle2" gutterBottom>
                Rewards
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedAchievement.rewards.xp && (
                  <Chip
                    label={`${selectedAchievement.rewards.xp} XP`}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {selectedAchievement.rewards.gold && (
                  <Chip
                    label={`${selectedAchievement.rewards.gold} Gold`}
                    color="warning"
                    variant="outlined"
                  />
                )}
                {selectedAchievement.rewards.items?.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Box>
              {selectedAchievement.unlockedAt && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Unlocked on:{' '}
                  {selectedAchievement.unlockedAt.toDate().toLocaleDateString()}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedAchievement(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}; 