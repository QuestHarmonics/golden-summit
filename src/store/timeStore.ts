import { createStore } from './core/createStore';
import { StoreState } from './types';
import { CONFIG } from '../config/development';

interface TimeState extends StoreState {
  lastTick: number;
  dayStart: number;
  currentStreak: number;
  longestStreak: number;
  dailyStats: {
    date: string;
    activeTime: number;
    xpGained: number;
    tasksCompleted: number;
  }[];
  
  tick: () => void;
  checkStreak: () => void;
  updateDailyStats: (stats: Partial<TimeState['dailyStats'][0]>) => void;
}

export const useTimeStore = createStore<TimeState>(
  'time',
  (set, get) => ({
    lastTick: Date.now(),
    dayStart: new Date().setHours(0, 0, 0, 0),
    currentStreak: 0,
    longestStreak: 0,
    dailyStats: [],

    tick: () => {
      const now = Date.now();
      const { lastTick, dayStart } = get();
      
      // Check if day rolled over
      const currentDayStart = new Date().setHours(0, 0, 0, 0);
      if (currentDayStart > dayStart) {
        get().checkStreak();
        set({ dayStart: currentDayStart });
      }

      set({ lastTick: now });
    },

    checkStreak: () => {
      const { dailyStats, currentStreak, longestStreak } = get();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const wasActiveYesterday = dailyStats.some(
        stat => stat.date === yesterdayStr && stat.activeTime > 0
      );

      if (wasActiveYesterday) {
        const newStreak = currentStreak + 1;
        set({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, longestStreak)
        });
      } else {
        set({ currentStreak: 0 });
      }
    },

    updateDailyStats: (updates) => {
      const today = new Date().toISOString().split('T')[0];
      
      set(state => {
        const existingIndex = state.dailyStats.findIndex(
          stat => stat.date === today
        );

        const newStats = [...state.dailyStats];
        if (existingIndex >= 0) {
          newStats[existingIndex] = {
            ...newStats[existingIndex],
            ...updates
          };
        } else {
          newStats.unshift({
            date: today,
            activeTime: 0,
            xpGained: 0,
            tasksCompleted: 0,
            ...updates
          });
        }

        // Keep last 30 days
        return { dailyStats: newStats.slice(0, 30) };
      });
    }
  }),
  {
    version: '1.0.0',
    validate: (state) => ({
      isValid: state.lastTick > 0 && state.dayStart > 0,
      errors: []
    })
  }
); 