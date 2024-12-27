export interface UserData {
  username: string;
  xp: number;
  level: number;
  coins: number;
  inventory: string[];
  streaks: {
    daily: number;
    weekly: number;
  };
  buffs: {
    energyBoost?: number;
    focusBoost?: number;
    skillMultiplier?: number;
    expiresAt: number;
  }[];
} 