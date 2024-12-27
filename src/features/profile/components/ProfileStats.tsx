import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Box,
  Tooltip
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as StreakIcon,
  Timeline as ProgressIcon,
  Psychology as SkillIcon
} from '@mui/icons-material';
import { UserStats } from '../types/Profile';

interface ProfileStatsProps {
  stats: UserStats;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const calculateCompletionRate = () => {
    const total = stats.questsCompleted + stats.questsFailed;
    return total === 0 ? 0 : (stats.questsCompleted / total) * 100;
  };

  const StatCard = ({ title, value, icon, tooltip }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    tooltip?: string;
  }) => (
    <Tooltip title={tooltip || ''}>
      <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </Paper>
    </Tooltip>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Quests Completed"
            value={stats.questsCompleted}
            icon={<TrophyIcon color="primary" />}
            tooltip="Total number of quests successfully completed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon={<StreakIcon color="error" />}
            tooltip={`Longest streak: ${stats.longestStreak} days`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total XP Earned"
            value={stats.totalXpEarned}
            icon={<ProgressIcon color="success" />}
            tooltip="Total experience points earned from all activities"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Days"
            value={stats.activeDays}
            icon={<SkillIcon color="info" />}
            tooltip="Total number of days with activity"
          />
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quest Completion Rate
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={calculateCompletionRate()}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {calculateCompletionRate().toFixed(1)}%
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Skill Levels
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(stats.skillLevels).map(([skill, level]) => (
            <Grid item xs={12} sm={6} md={4} key={skill}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">{skill}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level {level}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(level % 10) * 10}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Family Quest Participation
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                Family Quests Participated
              </Typography>
              <Typography variant="h4">
                {stats.familyQuestsParticipated}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                Suggested Quests Approved
              </Typography>
              <Typography variant="h4">
                {stats.suggestedQuestsApproved}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}; 