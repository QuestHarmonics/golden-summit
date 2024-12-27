import React from 'react';
import { Box, Paper, Typography, LinearProgress, IconButton, Tooltip } from '@mui/material';
import { useGameStore } from '../../store/gameStore';
import { useLifeCycleStore } from '../../store/lifeCycleStore';
import { 
  CollectionsBookmark, 
  Speed as MultiplierIcon,
  TrendingUp as PassiveIcon
} from '@mui/icons-material';
import { Quest } from '../../features/quests/types/Quest';

interface GameState {
  currentXP: number;
  level: number;
  multiplier: number;
  activeQuests: Quest[];
}

export const UnifiedXPDisplay: React.FC = () => {
  const { 
    currentXP = 0, 
    level = 1, 
    multiplier = 1,
    activeQuests = []
  } = useGameStore() as unknown as GameState;

  const { 
    passiveAccumulator = {
      unlocked: false,
      stored: 0,
      capacity: 100,
      rate: 1,
      multiplier: 1
    },
    collectPassiveXP
  } = useLifeCycleStore();

  // Calculate XP progress with safe defaults
  const xpForNextLevel = Math.floor(100 * Math.pow(1.5, level));
  const currentLevelXP = Math.max(0, currentXP % xpForNextLevel);
  const progress = Math.min(100, Math.max(0, (currentLevelXP / xpForNextLevel) * 100));

  // Calculate passive XP rate with safe defaults
  const basePassiveRate = 0.1; // XP per second
  const totalPassiveRate = basePassiveRate * (multiplier || 1);
  const hourlyRate = totalPassiveRate * 3600;

  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        p: 2,
        width: 300,
        bgcolor: 'background.paper',
        borderRadius: 2,
        zIndex: 1000
      }}
    >
      {/* Level and XP Progress */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Level {level}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{ 
              flexGrow: 1, 
              mr: 1,
              height: 8,
              borderRadius: 4
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {Math.floor(currentLevelXP)}/{xpForNextLevel}
          </Typography>
        </Box>
      </Box>

      {/* Active Multipliers */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MultiplierIcon color="secondary" />
          <Typography variant="body2">
            XP Multiplier: x{(multiplier || 1).toFixed(1)}
          </Typography>
        </Box>
      </Box>

      {/* Passive XP */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PassiveIcon color="success" />
          <Typography variant="body2">
            Passive XP: +{hourlyRate.toFixed(1)}/hr
          </Typography>
        </Box>
        {passiveAccumulator.unlocked && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, Math.max(0, (passiveAccumulator.stored / passiveAccumulator.capacity) * 100))}
              color="success"
              sx={{ mb: 0.5, height: 6, borderRadius: 3 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {Math.floor(passiveAccumulator.stored)}/{passiveAccumulator.capacity} XP
              </Typography>
              {passiveAccumulator.stored > 0 && (
                <Tooltip title="Collect Passive XP">
                  <IconButton 
                    size="small" 
                    color="success"
                    onClick={() => collectPassiveXP()}
                  >
                    <CollectionsBookmark />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Active Quests */}
      {activeQuests?.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CollectionsBookmark color="primary" />
            <Typography variant="body2">
              Active Quests: {activeQuests.length}
            </Typography>
          </Box>
          {activeQuests.map((quest: Quest) => (
            <Typography 
              key={quest.id} 
              variant="caption" 
              display="block"
              color="text.secondary"
              sx={{ ml: 4 }}
            >
              • {quest.title || 'Unnamed Quest'}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
}; 