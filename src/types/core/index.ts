export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Difficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'epic';

export interface SkillProgress {
  level: number;
  experience: number;
  nextLevelXp: number;
}

export interface QuestRequirement {
  type: 'skill' | 'item' | 'quest' | 'level';
  id: string;
  value: number;
}

export type LifePath = 'artistry' | 'entrepreneurship' | 'homesteading' | 'maintenance'; 

export type GameDifficulty = 'easy' | 'normal' | 'hard';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface GameState {
  started: boolean;
  tutorial: boolean;
  difficulty: GameDifficulty;
  version: string;
}

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  energy: number;
  skills: Record<SkillType, number>;
  inventory: Record<ResourceType, number>;
  achievements: string[];
}

export interface TimeState {
  currentDate: Date;
  daysPassed: number;
  season: Season;
  weather: WeatherCondition;
} 