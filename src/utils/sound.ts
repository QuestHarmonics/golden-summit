import { useGameStore } from '../store/gameStore';

export const playSound = (soundName: string) => {
  const { soundEnabled, customSounds } = useGameStore.getState();
  
  if (!soundEnabled) return;

  try {
    // Use custom sound if available, otherwise fall back to default
    const soundUrl = customSounds[soundName] || `/sounds/${soundName}.mp3`;
    const audio = new Audio(soundUrl);
    
    audio.play().catch(err => {
      console.log('Sound playback disabled:', err);
    });
  } catch (err) {
    console.log('Sound system error:', err);
  }
}; 