import { createContext, useContext, type ReactNode } from 'react';
import type { SoundSystem } from '../types/sound';
import { RetroSoundSynth } from '../utils/RetroSoundSynth';

const SoundContext = createContext<SoundSystem>(RetroSoundSynth.Instance);

export function useSound(): SoundSystem {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: ReactNode }): JSX.Element {
  return (
    <SoundContext.Provider value={RetroSoundSynth.Instance}>
      {children}
    </SoundContext.Provider>
  );
} 