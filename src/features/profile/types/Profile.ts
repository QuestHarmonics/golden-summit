import { Timestamp } from 'firebase/firestore';

export interface UserStats {
  questsCompleted: number;
  questsFailed: number;
  totalXPEarned: number;
  totalGoldEarned: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Timestamp;
  progress?: {
    current: number;
    required: number;
  };
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  sound: boolean;
}

export interface UserPreferences {
  questDifficulty: 'all' | 'easy' | 'medium' | 'hard';
  questTypes: ('personal' | 'family')[];
  dailyGoal: number;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  level: number;
  xp: number;
  gold: number;
  stats: UserStats;
  achievements: Achievement[];
  settings: UserSettings;
  preferences: UserPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 