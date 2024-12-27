import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Slider,
  Stack,
} from '@mui/material';
import { matrixColors } from '../theme/cyberpunkTheme';
import { useProgressStore } from '../store/progressStore';
import { useSound } from '../hooks/useSound';

interface Preset {
  id: string;
  name: string;
  description: string;
  duration: number;
  xpReward: number;
  intensity: number;
}

interface QuestTimerProps {
  preset: Preset | null;
}

const QuestTimer: React.FC<QuestTimerProps> = ({ preset }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [targetTime, setTargetTime] = useState(25 * 60);
  const [intensity, setIntensity] = useState(50);
  const [task, setTask] = useState('');
  const sound = useSound();
  const { addXP, addTime } = useProgressStore();

  useEffect(() => {
    if (preset) {
      setTargetTime(preset.duration * 60);
      setIntensity(preset.intensity);
      setTask(preset.name);
      setTime(0);
      setIsRunning(false);
    }
  }, [preset]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime >= targetTime) {
            handleComplete();
            return targetTime;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, targetTime]);

  const handleComplete = () => {
    setIsRunning(false);
    const minutes = Math.floor(targetTime / 60);
    const baseXP = preset?.xpReward || minutes * 10;
    const intensityMultiplier = intensity / 50;
    const totalXP = Math.floor(baseXP * intensityMultiplier);
    
    addXP(totalXP);
    addTime(minutes);
    sound.playEffect('achievement');
  };

  const handleStart = () => {
    if (!task.trim()) return;
    setIsRunning(true);
    sound.playEffect('powerUp');
  };

  const handleStop = () => {
    setIsRunning(false);
    sound.playEffect('error');
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    sound.playEffect('error');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (time / targetTime) * 100;

  return (
    <Card sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          color: matrixColors.neonGreen,
          textAlign: 'center',
          mb: 3,
          textShadow: `0 0 10px ${matrixColors.neonGreen}`,
        }}
      >
        QUEST TIMER
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="Current Quest"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={isRunning}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: matrixColors.neonGreen,
              },
            },
            '& .MuiInputLabel-root': {
              color: matrixColors.neonGreen,
            },
          }}
        />

        <Box>
          <Typography
            sx={{
              color: matrixColors.neonBlue,
              mb: 1,
            }}
          >
            Quest Intensity: {intensity}%
          </Typography>
          <Slider
            value={intensity}
            onChange={(_, value) => setIntensity(value as number)}
            disabled={isRunning}
            sx={{
              color: matrixColors.neonBlue,
              '& .MuiSlider-thumb': {
                boxShadow: `0 0 10px ${matrixColors.neonBlue}`,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: 120,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, ${matrixColors.neonGreen}33 ${progress}%, transparent ${progress}%)`,
              transition: 'background 0.3s',
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: '3.5rem',
              color: matrixColors.neonGreen,
              textShadow: `0 0 20px ${matrixColors.neonGreen}`,
              zIndex: 1,
            }}
          >
            {formatTime(time)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          {!isRunning ? (
            <Button
              variant="contained"
              onClick={handleStart}
              disabled={!task.trim()}
              sx={{
                bgcolor: matrixColors.darkGreen,
                '&:hover': {
                  bgcolor: matrixColors.neonGreen,
                  color: 'black',
                },
              }}
            >
              START QUEST
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleStop}
              sx={{
                bgcolor: matrixColors.darkGreen,
                '&:hover': {
                  bgcolor: matrixColors.neonPink,
                  color: 'black',
                },
              }}
            >
              PAUSE QUEST
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              borderColor: matrixColors.neonGreen,
              color: matrixColors.neonGreen,
              '&:hover': {
                borderColor: matrixColors.neonBlue,
                color: matrixColors.neonBlue,
              },
            }}
          >
            RESET
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default QuestTimer; 