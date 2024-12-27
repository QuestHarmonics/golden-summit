export interface Reward {
  xp: number;
  skills?: Record<string, number>;
  resources?: Record<string, number>;
  unlocks?: string[];
}

export interface ScaledReward extends Reward {
  baseXP: number;
  scalingFactor: number;
  minLevel: number;
  maxLevel?: number;
  bonusConditions?: {
    condition: string;
    multiplier: number;
    description: string;
  }[];
}

export interface ProgressionTier {
  level: number;
  title: string;
  xpRequired: number;
  rewards: Reward;
  unlockedFeatures: string[];
} 