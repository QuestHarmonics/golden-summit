import { create } from 'zustand';
import { Store } from './types';
import { persist } from 'zustand/middleware';
import { useHomesteadStore } from './homesteadStore';
import { useProgressStore } from './progressStore';

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      quests: [],
      questProgress: [],
      skills: [],
      achievements: [],
      tasks: [],
      habits: [],
      locations: [],
      mapMarkers: [],
      resources: [],
      dailyStats: [],
      journalEntries: [],
      
      initializeStores: () => {
        useProgressStore.getState().initializeProgress();
        useHomesteadStore.getState().generateDailyTasks();
        
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilMidnight = tomorrow.getTime() - now.getTime();
        
        setTimeout(() => {
          useHomesteadStore.getState().generateDailyTasks();
          setInterval(() => {
            useHomesteadStore.getState().generateDailyTasks();
          }, 24 * 60 * 60 * 1000);
        }, timeUntilMidnight);
      }
    }),
    {
      name: 'golden-summit-store',
      partialize: (state) => ({
        user: state.user,
        quests: state.quests,
        questProgress: state.questProgress,
        skills: state.skills,
        achievements: state.achievements,
        homestead: useHomesteadStore.getState()
      })
    }
  )
); 