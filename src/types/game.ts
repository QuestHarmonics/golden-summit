export interface LevelSystem {
  currentXP: number;
  level: number;
  xpToNextLevel: number;
  multiplier: number;
}

export const calculateLevel = (xp: number): LevelSystem => {
  const level = Math.floor(Math.log(xp / 100 + 1) / Math.log(1.1)) + 1;
  const xpForNextLevel = 100 * (Math.pow(1.1, level) - 1);
  
  return {
    currentXP: xp,
    level,
    xpToNextLevel: xpForNextLevel - xp,
    multiplier: 1 + (level * 0.1)
  };
};

export interface GameState {
  currentXP: number;
  level: number;
  multiplier: number;
  activeQuests: Quest[];
  // ... other game state properties
}

export interface GameActions {
  addXP: (amount: number) => void;
  setLevel: (level: number) => void;
  setMultiplier: (multiplier: number) => void;
  // ... other game actions
} 