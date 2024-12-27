import { SoundContext } from '../contexts/SoundContext';
import type { SoundSystem } from '../types/sound';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useContext } from 'react';

export function useSound(): SoundSystem {
  return useContext(SoundContext);
} 