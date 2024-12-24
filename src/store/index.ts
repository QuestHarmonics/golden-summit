import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AppState } from './types';

const initialState: AppState = {
  user: null,
  quests: [],
  skills: [],
  achievements: [],
  tasks: [],
  habits: [],
  regions: [],
  energyLogs: [],
  dailyStats: [],
  journalEntries: [],
};

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
      }),
      {
        name: 'golden-summit-storage',
      }
    )
  )
); 