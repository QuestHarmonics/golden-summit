import React, { useState } from 'react';
import { Box, Container, Paper, Slide } from '@mui/material';
import { QuestTimer } from '../components/QuestTimer';
import { SessionResults } from '../components/SessionResults';
import { TrackingPresets } from '../components/TrackingPresets';
import { TrackingSession, TrackingPreset } from '../types/TrackingTypes';
import { useGameStore } from '../../../store/gameStore';

export const TrackingContainer: React.FC = () => {
  const [activeSession, setActiveSession] = useState<TrackingSession | null>(null);
  const [completedSession, setCompletedSession] = useState<TrackingSession | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<TrackingPreset | null>(null);

  const handlePresetSelect = (preset: TrackingPreset) => {
    setSelectedPreset(preset);
    setActiveSession({
      id: crypto.randomUUID(),
      skillId: preset.skillId,
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
        totalXP: 0,
        coins: 0
      }
    });
  };

  const handleSessionComplete = (session: TrackingSession) => {
    setActiveSession(null);
    setCompletedSession(session);
    setSelectedPreset(null);
  };

  const handleCloseResults = () => {
    setCompletedSession(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" gap={4}>
        {/* Show presets when no active session */}
        <Slide direction="up" in={!activeSession} mountOnEnter unmountOnExit>
          <Box>
            <TrackingPresets onSelectPreset={handlePresetSelect} />
          </Box>
        </Slide>

        {/* Active timer */}
        <Slide direction="up" in={!!activeSession} mountOnEnter unmountOnExit>
          <Box>
            {activeSession && selectedPreset && (
              <QuestTimer
                questId={activeSession.questId}
                skillId={activeSession.skillId}
                preset={selectedPreset}
              />
            )}
          </Box>
        </Slide>

        {/* Session results */}
        <Slide direction="up" in={!!completedSession} mountOnEnter unmountOnExit>
          <Box>
            {completedSession && (
              <SessionResults
                session={completedSession}
                onClose={handleCloseResults}
              />
            )}
          </Box>
        </Slide>
      </Box>
    </Container>
  );
}; 