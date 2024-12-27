import { Entity } from '../core';

export type TutorialScope = 'user' | 'developer' | 'both';
export type TutorialTrigger = 'onAction' | 'onView' | 'onComplete' | 'manual';

export interface Tutorial extends Entity {
  title: string;
  description: string;
  scope: TutorialScope;
  steps: TutorialStep[];
  prerequisites: string[]; // IDs of tutorials that must be completed first
  rewards?: {
    xp: number;
    skills: Record<string, number>;
    unlocks: string[];
  };
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  elementSelector?: string; // CSS selector for highlighting UI elements
  trigger: TutorialTrigger;
  action?: string; // Action that needs to be completed
  hint?: string;
  nextCondition?: () => boolean;
}

export interface TutorialProgress extends Entity {
  userId: string;
  tutorialId: string;
  currentStep: number;
  completed: boolean;
  completedSteps: string[]; // Step IDs
  startedAt: Date;
  completedAt?: Date;
} 