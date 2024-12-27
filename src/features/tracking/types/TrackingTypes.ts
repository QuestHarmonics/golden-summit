export interface TrackingSession {
  id: string;
  questId?: string;
  skillId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  status: 'active' | 'paused' | 'completed';
  notes: Array<{
    timestamp: string;
    content: string;
    mood?: 'energized' | 'focused' | 'creative' | 'tired' | 'distracted' | 'challenged' | 'inspired' | 'relaxed';
    intensity?: 1 | 2 | 3 | 4 | 5;
    tags?: string[];
    attachments?: {
      type: 'image' | 'link' | 'file';
      url: string;
      description?: string;
    }[];
  }>;
  laps: Array<{
    startTime: string;
    endTime: string;
    duration: number;
    label?: string;
    intensity?: 1 | 2 | 3 | 4 | 5;
    notes?: string;
    achievements?: string[];
  }>;
  metrics: {
    focusScore?: number;
    interruptions?: number;
    flowState?: number;
    energyLevel?: number;
    consistency?: number;
    efficiency?: number;
    quality?: number;
    difficulty?: number;
    satisfaction?: number;
    milestones?: Array<{
      timestamp: string;
      description: string;
      xpBonus: number;
      type: 'time' | 'achievement' | 'streak' | 'challenge' | 'discovery';
      icon?: string;
      unlocks?: string[];
    }>;
    challenges?: Array<{
      id: string;
      name: string;
      completed: boolean;
      progress: number;
      reward: number;
    }>;
    achievements?: Array<{
      id: string;
      name: string;
      description: string;
      timestamp: string;
      rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    }>;
  };
  rewards: {
    baseXP: number;
    bonusXP: number;
    streakBonus: number;
    focusBonus: number;
    milestoneBonus: number;
    challengeBonus: number;
    consistencyBonus: number;
    qualityBonus: number;
    discoveryBonus: number;
    totalXP: number;
    coins: number;
    items?: Array<{
      id: string;
      name: string;
      type: 'consumable' | 'collectible' | 'achievement';
      rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
      quantity: number;
    }>;
    skillProgress?: Record<string, {
      xp: number;
      level: number;
      unlocks: string[];
    }>;
  };
  feedback?: {
    insights: string[];
    suggestions: string[];
    patterns: string[];
    nextGoals: string[];
  };
}

export interface TrackingPreset {
  id: string;
  name: string;
  description: string;
  skillId: string;
  category: 'productivity' | 'wellness' | 'learning' | 'creativity' | 'fitness' | 'mindfulness';
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration?: number;
  flexibility: 'strict' | 'moderate' | 'flexible';
  lapIntervals?: number[];
  reminderIntervals?: number[];
  autoPause?: boolean;
  moodTracking?: boolean;
  intensityTracking?: boolean;
  requiresNotes?: boolean;
  allowsAttachments?: boolean;
  milestones?: Array<{
    atMinute: number;
    description: string;
    xpBonus: number;
    type: 'time' | 'achievement' | 'streak' | 'challenge' | 'discovery';
    conditions?: {
      minIntensity?: number;
      requiredMood?: string[];
      requiredTags?: string[];
    };
  }>;
  challenges?: Array<{
    id: string;
    name: string;
    description: string;
    conditions: {
      type: 'duration' | 'intensity' | 'consistency' | 'notes' | 'mood';
      target: number;
      comparison: '>' | '>=' | '=' | '<=' | '<';
    }[];
    reward: number;
  }>;
  rewards: {
    baseXPPerMinute: number;
    bonusConditions: Array<{
      type: 'intensity' | 'notes' | 'mood' | 'consistency' | 'streak';
      multiplier: number;
      description: string;
    }>;
    items?: Array<{
      id: string;
      chance: number; // 0-1
      conditions?: {
        minDuration?: number;
        minIntensity?: number;
        requiredMood?: string[];
      };
    }>;
  };
  recommendations?: {
    preparation: string[];
    bestTimeOfDay: string[];
    environment: string[];
    combinations: string[];
  };
}

export interface TrackingStats {
  totalSessions: number;
  totalDuration: number;
  averageDuration: number;
  bestFocusScore: number;
  longestStreak: number;
  currentStreak: number;
  preferredTimes: Record<string, number>;
  commonTags: Record<string, number>;
  milestoneProgress: Record<string, number>;
  patterns: {
    timeOfDay: Record<string, { count: number; effectiveness: number }>;
    duration: Record<string, { count: number; effectiveness: number }>;
    intensity: Record<number, { count: number; effectiveness: number }>;
    moods: Record<string, { count: number; effectiveness: number }>;
    combinations: Record<string, { count: number; effectiveness: number }>;
  };
  achievements: {
    total: number;
    byRarity: Record<string, number>;
    recent: string[];
    favorite: string[];
  };
  insights: {
    bestConditions: {
      timeOfDay: string[];
      duration: string[];
      intensity: number[];
      moods: string[];
    };
    improvement: {
      focus: number;
      consistency: number;
      efficiency: number;
    };
    suggestions: string[];
  };
} 