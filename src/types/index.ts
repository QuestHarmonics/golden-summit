export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'PHYSICAL' | 'MENTAL' | 'CREATIVE' | 'SOCIAL' | 'PRACTICAL';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  xpReward: number;
  timeEstimate: string;
  requirements?: string[];
  steps?: string[];
  tips?: string[];
}

export interface XPGain {
  source: string;
  type: 'QUEST' | 'ACHIEVEMENT' | 'TASK';
  amount: number;
  multiplier: number;
}

export interface StoreState {
  gameState: {
    started: boolean;
  };
  setGameStarted: (started: boolean) => void;
  addXp: (amount: number, source: XPGain) => void;
} 