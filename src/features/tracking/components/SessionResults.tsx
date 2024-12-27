import React, { useEffect } from 'react';
import { Box, Paper, Typography, Divider, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { TrackingSession } from '../types/TrackingTypes';
import { EmojiEvents, Timer, Note, Whatshot, Star } from '@mui/icons-material';
import confetti from 'canvas-confetti';

interface SessionResultsProps {
  session: TrackingSession;
  onClose: () => void;
}

export const SessionResults: React.FC<SessionResultsProps> = ({ session, onClose }) => {
  useEffect(() => {
    // Celebration animation
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ['#ff0000', '#00ff00', '#0000ff'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            maxWidth: 500, 
            mx: 'auto',
            background: 'linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%)'
          }}
        >
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Header */}
            <Typography variant="h4" align="center" color="primary" gutterBottom>
              Session Complete! 🎉
            </Typography>

            {/* Time Stats */}
            <Box>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Timer color="primary" />
                  <Typography variant="h6">
                    Duration: {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                  </Typography>
                </Box>
              </motion.div>
            </Box>

            <Divider />

            {/* XP Breakdown */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Experience Gained
              </Typography>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Base XP:</Typography>
                    <Typography>+{session.rewards.baseXP} XP</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Focus Bonus:</Typography>
                    <Typography>+{session.rewards.focusBonus} XP</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Notes Bonus:</Typography>
                    <Typography>+{session.rewards.bonusXP} XP</Typography>
                  </Box>
                  {session.rewards.streakBonus > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Streak Bonus:</Typography>
                      <Typography>+{session.rewards.streakBonus} XP</Typography>
                    </Box>
                  )}
                  {session.rewards.milestoneBonus > 0 && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Milestone Bonus:</Typography>
                      <Typography>+{session.rewards.milestoneBonus} XP</Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            </Box>

            <Divider />

            {/* Total Rewards */}
            <Box>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
              >
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  gap={3}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    background: 'linear-gradient(145deg, #f0f7ff 0%, #e3f2fd 100%)'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Star sx={{ color: '#FFD700' }} />
                    <Typography variant="h5">
                      +{session.rewards.totalXP} XP
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Whatshot sx={{ color: '#FFA726' }} />
                    <Typography variant="h5">
                      +{session.rewards.coins} Coins
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>

            {/* Milestones */}
            {session.metrics.milestones && session.metrics.milestones.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Milestones Achieved
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {session.metrics.milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Chip
                        icon={<EmojiEvents />}
                        label={milestone.description}
                        color="secondary"
                      />
                    </motion.div>
                  ))}
                </Box>
              </Box>
            )}

            {/* Notes Summary */}
            {session.notes.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Session Notes
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {session.notes.map((note, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: 1,
                          backgroundColor: 'background.paper'
                        }}
                      >
                        <Typography variant="body2">{note.content}</Typography>
                        {note.mood && (
                          <Chip
                            label={note.mood}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
}; 