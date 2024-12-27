// Core entity type that all domain objects extend
export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Core status tracking
export interface Trackable {
  progress: number;
  status: 'inactive' | 'active' | 'completed' | 'archived';
}

// Core reward system
export interface Rewarding {
  xpReward: number;
  skillRewards: Record<string, number>;
  unlocks?: string[];
}

// Core progression system
export interface Progressive {
  level: number;
  xp: number;
  maxXp: number;
  multiplier: number;
}

// Core tagging system
export interface Taggable {
  tags: string[];
  category?: string;
}

// Core scheduling system
export interface Schedulable {
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  recurringPattern?: RecurringPattern;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // every X days/weeks/months
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
}

export interface XPSource {
  id: string;
  amount: number;
  multiplier: number;
  timestamp: Date;
  source: string;
  description?: string;
}

export interface GameState {
  started: boolean;
} 