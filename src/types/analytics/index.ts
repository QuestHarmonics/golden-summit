import { Entity } from '../core';

export interface TutorialAnalytics extends Entity {
  userId: string;
  tutorialId: string;
  startTime: Date;
  completionTime?: Date;
  timeSpentPerStep: Record<string, number>; // stepId -> time in ms
  attempts: number;
  hintViews: Record<string, number>; // stepId -> number of times hint viewed
  skippedSteps: string[];
  userActions: TutorialAction[];
  deviceInfo: DeviceInfo;
}

export interface TutorialAction {
  timestamp: Date;
  stepId: string;
  actionType: 'view' | 'complete' | 'hint' | 'skip' | 'retry';
  metadata?: Record<string, any>;
}

export interface DeviceInfo {
  platform: string;
  browser: string;
  screenSize: {
    width: number;
    height: number;
  };
  language: string;
} 