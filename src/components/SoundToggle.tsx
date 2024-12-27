import { useState } from 'react';
import './SoundToggle.css';
import { RetroSoundSynth } from '../utils/RetroSoundSynth';

export const SoundToggle = () => {
  const [enabled, setEnabled] = useState(true);

  const toggleSound = () => {
    RetroSoundSynth.Instance.toggle();
    setEnabled(!enabled);
    if (enabled) {
      RetroSoundSynth.Instance.click();
    }
  };

  return (
    <button 
      className={`sound-toggle ${enabled ? 'enabled' : ''}`}
      onClick={toggleSound}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}; 