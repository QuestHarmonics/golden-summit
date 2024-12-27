import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

interface Preset {
  id: string;
  name: string;
  description: string;
  duration: number;
  xpReward: number;
  intensity: number;
}

interface TrackingPresetsProps {
  onSelectPreset: (preset: Preset) => void;
}

const TrackingPresets: React.FC<TrackingPresetsProps> = ({ onSelectPreset }) => {
  const presets: Preset[] = [
    {
      id: 'quick',
      name: 'Quick Task',
      description: 'A short focused session',
      duration: 15,
      xpReward: 50,
      intensity: 1
    },
    {
      id: 'standard',
      name: 'Standard Task',
      description: 'A regular work session',
      duration: 30,
      xpReward: 100,
      intensity: 2
    }
  ];

  return (
    <Box>
      <Grid container spacing={2}>
        {presets.map((preset) => (
          <Grid item xs={12} sm={6} md={4} key={preset.id}>
            <Card onClick={() => onSelectPreset(preset)} sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6">{preset.name}</Typography>
                <Typography color="textSecondary">{preset.description}</Typography>
                <Typography>Duration: {preset.duration}min</Typography>
                <Typography>XP Reward: {preset.xpReward}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrackingPresets; 