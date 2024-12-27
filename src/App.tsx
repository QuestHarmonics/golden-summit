import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import QuestTimer from './components/QuestTimer';
import XPDisplay from './components/XPDisplay';
import TrackingPresets from './components/TrackingPresets';
import { SoundProvider } from './providers/SoundProvider';
import { SoundControls } from './components/SoundControls';

interface Preset {
  id: string;
  name: string;
  description: string;
  duration: number;
  xpReward: number;
  intensity: number;
}

const App: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  return (
    <SoundProvider>
      <ThemeProvider>
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: '100vh',
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <SoundControls />
            <XPDisplay />
            <QuestTimer preset={selectedPreset} />
            <TrackingPresets onSelectPreset={setSelectedPreset} />
          </Box>
        </Container>
      </ThemeProvider>
    </SoundProvider>
  );
};

export default App;
