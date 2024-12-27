export interface StressTracking {
  hrvMorning: number;
  hrvNight: number;
  perceivedStress: 1 | 2 | 3 | 4 | 5;
  cortisol?: number;
  meditation: {
    duration: number;
    type: 'breathing' | 'mindfulness' | 'movement' | 'other';
    quality: 1 | 2 | 3 | 4 | 5;
  };
  recoveryActivities: {
    type: 'sauna' | 'coldPlunge' | 'massage' | 'other';
    duration: number;
    intensity: 1 | 2 | 3 | 4 | 5;
  }[];
} 