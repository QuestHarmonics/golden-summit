import { Entity } from '../core';

export interface UserPreferences extends Entity {
  userId: string;
  selectedSkills: string[];
  customSkills: CustomSkill[];
  interests: string[];
  dailyGoals: {
    preferredStartTime?: string;
    preferredEndTime?: string;
    focusTimeBlocks: number;
  };
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
}

export interface CustomSkill {
  name: string;
  description: string;
  category: string;
  relatedInterests: string[];
  customMilestones: string[];
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  dailyReminder: boolean;
  weeklyReport: boolean;
  achievements: boolean;
  reminderTime?: string;
}

export interface OnboardingState {
  step: number;
  completed: boolean;
  aboutMe: string;
  interests: string[];
  selectedSkills: string[];
  customSkills: CustomSkill[];
  dailyGoals: UserPreferences['dailyGoals'];
} 