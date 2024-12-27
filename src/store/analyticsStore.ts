import { create } from 'zustand';
import { TutorialAnalytics, TutorialAction, DeviceInfo } from '../types/analytics';
import { createBaseStore } from './core/baseStore';

interface AnalyticsState {
  currentSession?: TutorialAnalytics;
  startSession: (tutorialId: string) => void;
  endSession: () => void;
  trackAction: (action: Omit<TutorialAction, 'timestamp'>) => void;
  trackStepTime: (stepId: string, timeMs: number) => void;
  trackHintView: (stepId: string) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  startSession: (tutorialId: string) => {
    const deviceInfo: DeviceInfo = {
      platform: navigator.platform,
      browser: navigator.userAgent,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      language: navigator.language
    };

    set({
      currentSession: {
        id: crypto.randomUUID(),
        userId: 'current-user', // TODO: Get from auth
        tutorialId,
        startTime: new Date(),
        timeSpentPerStep: {},
        attempts: 1,
        hintViews: {},
        skippedSteps: [],
        userActions: [],
        deviceInfo,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  },

  endSession: () => {
    const { currentSession } = get();
    if (!currentSession) return;

    // Save analytics data
    const analytics: TutorialAnalytics = {
      ...currentSession,
      completionTime: new Date(),
      updatedAt: new Date()
    };

    // TODO: Send to backend
    console.log('Tutorial session completed:', analytics);

    set({ currentSession: undefined });
  },

  trackAction: (action) => {
    set(state => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        userActions: [
          ...state.currentSession.userActions,
          { ...action, timestamp: new Date() }
        ],
        updatedAt: new Date()
      } : undefined
    }));
  },

  trackStepTime: (stepId, timeMs) => {
    set(state => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        timeSpentPerStep: {
          ...state.currentSession.timeSpentPerStep,
          [stepId]: (state.currentSession.timeSpentPerStep[stepId] || 0) + timeMs
        },
        updatedAt: new Date()
      } : undefined
    }));
  },

  trackHintView: (stepId) => {
    set(state => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        hintViews: {
          ...state.currentSession.hintViews,
          [stepId]: (state.currentSession.hintViews[stepId] || 0) + 1
        },
        updatedAt: new Date()
      } : undefined
    }));
  }
})); 