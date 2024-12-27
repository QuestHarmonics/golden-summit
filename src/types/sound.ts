export type SoundTheme = 'classic' | 'modern' | 'retro';

export type SoundEffect = 'xp' | 'levelUp' | 'powerUp' | 'achievement' | 'error';

export interface SoundSystem {
  initAudio(): void;
  playEffect(effect: SoundEffect): void;
  setTheme(theme: SoundTheme): void;
} 