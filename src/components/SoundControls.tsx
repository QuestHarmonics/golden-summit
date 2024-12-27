import { useState } from 'react';
import { RetroSoundSynth } from '../utils/RetroSoundSynth';
import './SoundControls.css';

const soundInstance = RetroSoundSynth.Instance;

export const SoundControls = () => {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [theme, setTheme] = useState<'classic' | 'modern' | 'fantasy'>('classic');

  const toggleSound = () => {
    soundInstance.toggle();
    setEnabled(!enabled);
    if (enabled) {
      soundInstance.click();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundInstance.setVolume(newVolume);
  };

  const handleThemeChange = (newTheme: 'classic' | 'modern' | 'fantasy') => {
    setTheme(newTheme);
    soundInstance.setTheme(newTheme);
    soundInstance.click();
  };

  return (
    <div className="sound-controls">
      <button 
        className={`sound-toggle ${enabled ? 'enabled' : ''}`}
        onClick={toggleSound}
      >
        {enabled ? '🔊' : '🔇'}
      </button>
      
      {enabled && (
        <>
          <div className="volume-slider">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          
          <div className="theme-buttons">
            <button 
              className={`theme-btn ${theme === 'classic' ? 'active' : ''}`}
              onClick={() => handleThemeChange('classic')}
            >
              8-Bit
            </button>
            <button 
              className={`theme-btn ${theme === 'modern' ? 'active' : ''}`}
              onClick={() => handleThemeChange('modern')}
            >
              Modern
            </button>
            <button 
              className={`theme-btn ${theme === 'fantasy' ? 'active' : ''}`}
              onClick={() => handleThemeChange('fantasy')}
            >
              Fantasy
            </button>
          </div>
        </>
      )}
    </div>
  );
}; 