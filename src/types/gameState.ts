export interface Requirement {
  type: 'level' | 'skill' | 'quest' | 'item' | 'achievement';
  id: string;
  value: number;
  operator: '=' | '>' | '<' | '>=' | '<=';
}

export interface Reward {
  type: 'xp' | 'item' | 'skill' | 'currency';
  id: string;
  amount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  requirements: Requirement[];
  rewards: Reward[];
  status: 'hidden' | 'revealed' | 'completed';
  path: string;
  icon: string;
}

export interface LifePath {
  id: string;
  name: string;
  level: number;
  xp: number;
  skills: Skill[];
  quests: Quest[];
  achievements: Achievement[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  parentPath: string;
  connectedSkills: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'nutrition' | 'cooking';
  difficulty: number;
  baseReward: {
    xp: number;
    coins: number;
  };
  rewards: {
    items: string[];
    buffs?: {
      type: string;
      value: number;
      duration: number;
    }[];
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'tool' | 'resource' | 'consumable' | 'achievement';
  quantity: number;
  stackable: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

export type WeatherState = 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
export type TimeState = 'dawn' | 'day' | 'dusk' | 'night';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface GameState {
  paths: {
    artistry: LifePath;
    entrepreneurship: LifePath;
    homesteading: LifePath;
    dailyLife: LifePath;
  };
  player: {
    level: number;
    xp: number;
    energy: number;
    maxEnergy: number;
    streaks: Record<string, number>;
    inventory: InventoryItem[];
    lastLogin: string;
    weather: WeatherState;
    timeOfDay: TimeState;
  };
  visualization: {
    activeGeometry: string[];
    unlockedAreas: string[];
    achievements: string[];
    currentSeason: Season;
  };
}

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