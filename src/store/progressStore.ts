import { create } from 'zustand';
import { GameProgress, ProgressCategory } from './types';
import { useHomesteadStore } from './homesteadStore';

interface ProgressStore {
  progress: Record<ProgressCategory, GameProgress>;
  addXP: (category: ProgressCategory, amount: number) => void;
  levelUp: (category: ProgressCategory) => void;
  getLevel: (category: ProgressCategory) => number;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: {
    PHYSICAL: { level: 1, xp: 0, xpRequired: 100 },
    MENTAL: { level: 1, xp: 0, xpRequired: 100 },
    SOCIAL: { level: 1, xp: 0, xpRequired: 100 },
    HOMESTEAD: { level: 1, xp: 0, xpRequired: 100 },
    NUTRITION: { level: 1, xp: 0, xpRequired: 100 }
  },

  addXP: (category, amount) => {
    set(state => {
      const currentProgress = state.progress[category];
      const newXP = currentProgress.xp + amount;
      
      if (newXP >= currentProgress.xpRequired) {
        // Level up
        const levelsGained = Math.floor(newXP / currentProgress.xpRequired);
        const remainingXP = newXP % currentProgress.xpRequired;
        const newLevel = currentProgress.level + levelsGained;
        
        // Handle homestead level-up bonuses
        if (category === 'HOMESTEAD') {
          const homesteadStore = useHomesteadStore.getState();
          // Unlock new tasks/projects based on level
          homesteadStore.generateDailyTasks();
        }

        return {
          progress: {
            ...state.progress,
            [category]: {
              level: newLevel,
              xp: remainingXP,
              xpRequired: currentProgress.xpRequired * Math.pow(1.1, levelsGained)
            }
          }
        };
      }

      return {
        progress: {
          ...state.progress,
          [category]: {
            ...currentProgress,
            xp: newXP
          }
        }
      };
    });
  },

  // ... rest of the store implementation
})); 