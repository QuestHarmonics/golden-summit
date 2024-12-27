// @ts-ignore - RetroSoundSynth is used as context value
import { RetroSoundSynth } from '../utils/RetroSoundSynth';
import { createContext } from 'react';
import type { SoundSystem } from '../types/sound';

const soundInstance = RetroSoundSynth.Instance;
export const SoundContext = createContext<SoundSystem>(soundInstance); 