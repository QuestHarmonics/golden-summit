import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Typography, Paper, TextField, Chip, CircularProgress, Slider, Rating, SpeedDial, SpeedDialAction, SpeedDialIcon, LinearProgress } from '@mui/material';
import { PlayArrow, Pause, Stop, Flag, EmojiEvents, Note, Timer, AddPhotoAlternate, Link, AttachFile, Whatshot, Psychology, TrendingUp, EmojiEmotions, CheckCircle } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../store/gameStore';
import { TrackingSession } from '../types/TrackingTypes';
import confetti from 'canvas-confetti';

interface QuestTimerProps {
  questId?: string;
  skillId: string;
  preset?: {
    duration?: number;
    milestones?: Array<{ atMinute: number; description: string; xpBonus: number }>;
    challenges?: Array<{ id: string; name: string; progress: number; completed: boolean }>;
    rewards?: {
      baseXPPerMinute?: number;
      items?: Array<{ id: string; name: string; type: string; rarity: string; quantity: number; chance: number; conditions?: { minDuration?: number; minIntensity?: number } }>;
    };
  };
}

export const QuestTimer: React.FC<QuestTimerProps> = ({ questId, skillId, preset }) => {
  const [session, setSession] = useState<TrackingSession>({
    id: crypto.randomUUID(),
    questId,
    skillId,
    startTime: '',
    duration: 0,
    status: 'active',
    notes: [],
    laps: [],
    metrics: {},
    rewards: {
      baseXP: 0,
      bonusXP: 0,
      streakBonus: 0,
      focusBonus: 0,
      milestoneBonus: 0,
      challengeBonus: 0,
      consistencyBonus: 0,
      qualityBonus: 0,
      discoveryBonus: 0,
      totalXP: 0,
      coins: 0
    }
  });

  const [elapsed, setElapsed] = useState(0);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(3);
  const [showSpeedDial, setShowSpeedDial] = useState(false);
  const [challenges, setChallenges] = useState<Array<{
    id: string;
    progress: number;
    completed: boolean;
  }>>([]);
  const [attachments, setAttachments] = useState<Array<{
    type: 'image' | 'link' | 'file';
    url: string;
    description?: string;
  }>>([]);

  const updateUserData = useGameStore(state => state.updateUserData);
  const currentUser = useGameStore(state => state.currentUser);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (session.status === 'active') {
      interval = setInterval(() => {
        setElapsed(prev => {
          const newElapsed = prev + 1;
          // Check milestones
          preset?.milestones?.forEach(milestone => {
            if (Math.floor(newElapsed / 60) === milestone.atMinute) {
              triggerMilestone(milestone);
            }
          });
          return newElapsed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session.status]);

  const triggerMilestone = useCallback((milestone: { description: string; xpBonus: number }) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSession(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        milestones: [
          ...(prev.metrics.milestones || []),
          {
            timestamp: new Date().toISOString(),
            description: milestone.description,
            xpBonus: milestone.xpBonus,
            type: 'time' as const
          }
        ]
      },
      rewards: {
        ...prev.rewards,
        milestoneBonus: prev.rewards.milestoneBonus + milestone.xpBonus,
        totalXP: prev.rewards.totalXP + milestone.xpBonus
      }
    }));
  }, []);

  const handlePlayPause = () => {
    setSession(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'paused' : 'active',
      startTime: prev.startTime || new Date().toISOString()
    }));
  };

  const handleLap = () => {
    const lapEnd = new Date().toISOString();
    setSession(prev => ({
      ...prev,
      laps: [
        ...prev.laps,
        {
          startTime: prev.laps.length ? prev.laps[prev.laps.length - 1].endTime : prev.startTime,
          endTime: lapEnd,
          duration: elapsed - (prev.laps.length ? 
            Math.floor((new Date(prev.laps[prev.laps.length - 1].endTime).getTime() - new Date(prev.startTime).getTime()) / 1000) : 0)
        }
      ]
    }));
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    setSession(prev => ({
      ...prev,
      notes: [
        ...prev.notes,
        {
          timestamp: new Date().toISOString(),
          content: note,
          mood: currentMood as any,
          tags: note.match(/#\w+/g) || []
        }
      ]
    }));
    setNote('');
    setShowNoteInput(false);
    setCurrentMood(null);
  };

  const handleComplete = async () => {
    const endTime = new Date().toISOString();
    const finalSession = {
      ...session,
      endTime,
      duration: elapsed,
      status: 'completed' as const,
      rewards: calculateRewards(elapsed, session.notes.length, session.metrics.milestones?.length || 0)
    };
    
    if (currentUser) {
      await updateUserData(currentUser, {
        // Update user data with session results
      });
    }
  };

  const handleIntensityChange = (event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setIntensity(value);
    setSession(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        efficiency: value * 20, // Convert 1-5 to percentage
      }
    }));
  };

  const handleAttachment = (type: 'image' | 'link' | 'file') => {
    // Implement file/link handling logic
    const url = prompt(`Enter ${type} URL:`);
    if (url) {
      setAttachments(prev => [...prev, { type, url }]);
    }
  };

  const updateChallenges = useCallback(() => {
    if (!preset?.challenges) return;

    preset.challenges.forEach(challenge => {
      const existingChallenge = challenges.find(c => c.id === challenge.id);
      if (!existingChallenge) {
        setChallenges(prev => [...prev, {
          id: challenge.id,
          progress: 0,
          completed: false
        }]);
      }
    });
  }, [preset, challenges]);

  const calculateRewards = (duration: number, notesCount: number, milestonesCount: number) => {
    const baseXP = Math.floor(duration / 60) * (preset?.rewards?.baseXPPerMinute || 10);
    const bonusXP = notesCount * 5;
    const focusBonus = Math.floor(duration / 300) * 15;
    const intensityBonus = Math.floor(intensity * duration / 300) * 10;
    const milestoneBonus = session.rewards.milestoneBonus;
    const challengeBonus = challenges.filter(c => c.completed).length * 50;
    const consistencyBonus = Math.floor(duration / 600) * 20;
    const qualityBonus = Math.floor(intensity * duration / 900) * 25;
    const discoveryBonus = attachments.length * 10;

    const totalXP = baseXP + bonusXP + focusBonus + intensityBonus + milestoneBonus + 
                   challengeBonus + consistencyBonus + qualityBonus + discoveryBonus;
    const coins = Math.floor(totalXP / 10);

    // Calculate potential item drops
    const items = preset?.rewards?.items?.filter(item => {
      const chance = Math.random();
      if (chance > item.chance) return false;
      
      const conditions = item.conditions || {};
      if (conditions.minDuration && duration < conditions.minDuration) return false;
      if (conditions.minIntensity && intensity < conditions.minIntensity) return false;
      
      return true;
    }).map(item => ({
      id: item.id,
      name: `Mystery ${item.id}`,
      type: 'consumable' as const,
      rarity: 'common' as const,
      quantity: 1
    })) || [];

    return {
      baseXP,
      bonusXP,
      focusBonus,
      intensityBonus,
      milestoneBonus,
      challengeBonus,
      consistencyBonus,
      qualityBonus,
      discoveryBonus,
      totalXP,
      coins,
      items
    };
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 400, mx: 'auto' }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {/* Timer Display */}
          <Box position="relative" display="flex" alignItems="center" justifyContent="center">
            <CircularProgress
              variant="determinate"
              value={(elapsed % 60) * 1.67} // 1.67 = 100/60
              size={120}
              thickness={2}
              sx={{ position: 'absolute', color: 'primary.light' }}
            />
            <Typography variant="h3" component="div" sx={{ fontFamily: 'monospace' }}>
              {`${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}`}
            </Typography>
          </Box>

          {/* Control Buttons */}
          <Box display="flex" gap={1}>
            <IconButton onClick={handlePlayPause} color="primary" size="large">
              {session.status === 'active' ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={handleLap} color="secondary" size="large">
              <Flag />
            </IconButton>
            <IconButton onClick={() => setShowNoteInput(true)} color="info" size="large">
              <Note />
            </IconButton>
            <IconButton onClick={handleComplete} color="error" size="large">
              <Stop />
            </IconButton>
          </Box>

          {/* Note Input */}
          <AnimatePresence>
            {showNoteInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <Box display="flex" flexDirection="column" gap={1} width="100%">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add a note... (use #tags)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    multiline
                    maxRows={3}
                  />
                  <Box display="flex" gap={1}>
                    {['productive', 'focused', 'distracted', 'tired'].map(mood => (
                      <Chip
                        key={mood}
                        label={mood}
                        onClick={() => setCurrentMood(mood)}
                        color={currentMood === mood ? 'primary' : 'default'}
                        size="small"
                      />
                    ))}
                  </Box>
                  <IconButton onClick={handleAddNote} color="primary">
                    <Note />
                  </IconButton>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Laps Display */}
          <Box width="100%">
            {session.laps.map((lap, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                Lap {index + 1}: {Math.floor(lap.duration / 60)}:{(lap.duration % 60).toString().padStart(2, '0')}
              </Typography>
            ))}
          </Box>

          {/* Milestones */}
          {session.metrics.milestones && session.metrics.milestones.length > 0 && (
            <Box width="100%">
              <Typography variant="subtitle2" color="primary">
                Milestones Achieved:
              </Typography>
              {session.metrics.milestones.map((milestone, index) => (
                <Chip
                  key={index}
                  icon={<EmojiEvents />}
                  label={`${milestone.description} (+${milestone.xpBonus} XP)`}
                  color="secondary"
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          )}

          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Intensity Level
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Whatshot color="action" />
              <Slider
                value={intensity}
                onChange={handleIntensityChange}
                step={1}
                marks
                min={1}
                max={5}
                sx={{ flexGrow: 1 }}
              />
              <Typography variant="body2">
                {intensity}/5
              </Typography>
            </Box>
          </Box>

          {/* Quick Actions */}
          <SpeedDial
            ariaLabel="Session Actions"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
            onClose={() => setShowSpeedDial(false)}
            onOpen={() => setShowSpeedDial(true)}
            open={showSpeedDial}
          >
            <SpeedDialAction
              icon={<AddPhotoAlternate />}
              tooltipTitle="Add Image"
              onClick={() => handleAttachment('image')}
            />
            <SpeedDialAction
              icon={<Link />}
              tooltipTitle="Add Link"
              onClick={() => handleAttachment('link')}
            />
            <SpeedDialAction
              icon={<AttachFile />}
              tooltipTitle="Add File"
              onClick={() => handleAttachment('file')}
            />
          </SpeedDial>

          {/* Challenges Progress */}
          {preset?.challenges && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Active Challenges
              </Typography>
              {challenges.map(challenge => {
                const challengeConfig = preset.challenges?.find(c => c.id === challenge.id);
                return (
                  <Box key={challenge.id} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {challengeConfig?.name}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={challenge.progress}
                      color={challenge.completed ? 'success' : 'primary'}
                    />
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Attachments Display */}
          {attachments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Attachments
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {attachments.map((attachment, index) => (
                  <Chip
                    key={index}
                    icon={
                      attachment.type === 'image' ? <AddPhotoAlternate /> :
                      attachment.type === 'link' ? <Link /> :
                      <AttachFile />
                    }
                    label={`${attachment.type} ${index + 1}`}
                    onDelete={() => {
                      setAttachments(prev => prev.filter((_, i) => i !== index));
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </motion.div>
    </Paper>
  );
}; 