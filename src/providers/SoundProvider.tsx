import { createContext, useContext, type ReactNode } from 'react';
import type { SoundSystem } from '../types/sound';
import { RetroSoundSynth } from '../utils/RetroSoundSynth';

const instance = RetroSoundSynth.Instance;
const SoundContext = createContext<SoundSystem>(instance);

export const useSound = (): SoundSystem => useContext(SoundContext);

export const SoundProvider = ({ children }: { children: ReactNode }): JSX.Element => (
  <SoundContext.Provider value={instance}>
    {children}
  </SoundContext.Provider>
); 