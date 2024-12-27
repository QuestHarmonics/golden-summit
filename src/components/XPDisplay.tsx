import React from 'react';
import { Box, Card, Typography, LinearProgress } from '@mui/material';
import { matrixColors } from '../theme/cyberpunkTheme';
import { useProgressStore } from '../store/progressStore';

const XPDisplay: React.FC = () => {
  const { xp, level, dailyStreak, totalTime } = useProgressStore();
  const nextLevelXP = Math.pow((level) / 0.4, 2.5) * 100;
  const progress = (xp / nextLevelXP) * 100;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card
      sx={{
        p: 3,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ color: matrixColors.neonGreen }}>
          LEVEL {level}
        </Typography>
        <Typography variant="h6" sx={{ color: matrixColors.neonBlue }}>
          {Math.floor(xp)} / {Math.floor(nextLevelXP)} XP
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 20,
          borderRadius: 0,
          backgroundColor: matrixColors.darkGreen,
          '& .MuiLinearProgress-bar': {
            backgroundColor: matrixColors.neonGreen,
            boxShadow: `0 0 10px ${matrixColors.neonGreen}`,
          },
        }}
      />

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: matrixColors.neonPink,
            textShadow: `0 0 5px ${matrixColors.neonPink}`,
          }}
        >
          Daily Streak: {dailyStreak} days
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: matrixColors.neonBlue,
            textShadow: `0 0 5px ${matrixColors.neonBlue}`,
          }}
        >
          Total Time: {formatTime(totalTime)}
        </Typography>
      </Box>
    </Card>
  );
};

export default XPDisplay; 