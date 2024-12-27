import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DailyQuest {
  id: string;
  completed: boolean;
  completedAt: Date | null;
  streakCount: number;
}

interface DailyQuestStore {
  dailyQuests: Record<string, DailyQuest>;
  activeQuests: string[];
  multiplier: number;
  lastResetDate: Date;
  
  // Actions
  completeQuest: (questId: string) => void;
  resetDailyQuests: () => void;
  addQuestToDaily: (questId: string) => void;
  removeQuestFromDaily: (questId: string) => void;
  calculateMultiplier: () => number;
}

export const useDailyQuestStore = create<DailyQuestStore>()(
  persist(
    (set, get) => ({
      dailyQuests: {},
      activeQuests: [],
      multiplier: 1,
      lastResetDate: new Date(),

      completeQuest: (questId: string) => {
        set((state) => {
          const quest = state.dailyQuests[questId];
          const now = new Date();
          const streakCount = quest ? quest.streakCount + 1 : 1;

          return {
            dailyQuests: {
              ...state.dailyQuests,
              [questId]: {
                id: questId,
                completed: true,
                completedAt: now,
                streakCount
              }
            }
          };
        });
        // Recalculate multiplier after completion
        get().calculateMultiplier();
      },

      resetDailyQuests: () => {
        const now = new Date();
        const lastReset = new Date(get().lastResetDate);
        
        // Only reset if it's a new day
        if (now.getDate() !== lastReset.getDate()) {
          set((state) => ({
            dailyQuests: Object.fromEntries(
              Object.entries(state.dailyQuests).map(([id, quest]) => [
                id,
                {
                  ...quest,
                  completed: false,
                  completedAt: null,
                  // Maintain streak if completed yesterday
                  streakCount: quest.completed ? quest.streakCount : 0
                }
              ])
            ),
            lastResetDate: now
          }));
        }
      },

      addQuestToDaily: (questId: string) => {
        set((state) => ({
          activeQuests: [...new Set([...state.activeQuests, questId])],
          dailyQuests: {
            ...state.dailyQuests,
            [questId]: state.dailyQuests[questId] || {
              id: questId,
              completed: false,
              completedAt: null,
              streakCount: 0
            }
          }
        }));
      },

      removeQuestFromDaily: (questId: string) => {
        set((state) => ({
          activeQuests: state.activeQuests.filter(id => id !== questId)
        }));
      },

      calculateMultiplier: () => {
        const state = get();
        const completedCount = Object.values(state.dailyQuests)
          .filter(quest => quest.completed).length;
        const streakBonus = Math.min(
          Math.max(...Object.values(state.dailyQuests)
            .map(quest => quest.streakCount)
          ) * 0.1,
          0.5
        );
        
        // Base multiplier (1) + completion bonus + streak bonus
        const newMultiplier = 1 + (completedCount * 0.2) + streakBonus;
        
        set({ multiplier: newMultiplier });
        return newMultiplier;
      }
    }),
    {
      name: 'daily-quests-storage'
    }
  )
); 