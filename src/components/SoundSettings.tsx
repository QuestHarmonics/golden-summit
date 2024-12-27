import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const SoundSettings = () => {
  const { soundEnabled, setSoundEnabled, setCustomSound } = useGameStore();
  const [uploading, setUploading] = useState(false);

  const handleSoundUpload = async (event: React.ChangeEvent<HTMLInputElement>, soundType: string) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.includes('audio')) return;

    try {
      setUploading(true);
      // Create object URL for immediate use
      const soundUrl = URL.createObjectURL(file);
      setCustomSound(soundType, soundUrl);
    } catch (error) {
      console.error('Error uploading sound:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="sound-settings">
      <h3>Sound Settings</h3>
      
      <div className="setting-row">
        <label>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
          />
          Enable Sounds
        </label>
      </div>

      {soundEnabled && (
        <div className="custom-sounds">
          <h4>Custom Sounds</h4>
          
          <div className="sound-upload">
            <label>
              Level Up
              <input
                type="file"
                accept="audio/mp3"
                onChange={(e) => handleSoundUpload(e, 'level-up')}
                disabled={uploading}
              />
            </label>
            <button onClick={() => setCustomSound('level-up', null)}>Reset</button>
          </div>

          <div className="sound-upload">
            <label>
              Achievement
              <input
                type="file"
                accept="audio/mp3"
                onChange={(e) => handleSoundUpload(e, 'achievement')}
                disabled={uploading}
              />
            </label>
            <button onClick={() => setCustomSound('achievement', null)}>Reset</button>
          </div>

          <div className="sound-upload">
            <label>
              Click
              <input
                type="file"
                accept="audio/mp3"
                onChange={(e) => handleSoundUpload(e, 'click')}
                disabled={uploading}
              />
            </label>
            <button onClick={() => setCustomSound('click', null)}>Reset</button>
          </div>

          <div className="sound-upload">
            <label>
              Error
              <input
                type="file"
                accept="audio/mp3"
                onChange={(e) => handleSoundUpload(e, 'error')}
                disabled={uploading}
              />
            </label>
            <button onClick={() => setCustomSound('error', null)}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}; 