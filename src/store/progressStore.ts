import create from 'zustand';
import { persist } from 'zustand/middleware';
import { useSound } from '../hooks/useSound';

interface ProgressState {
  xp: number;
  level: number;
  dailyStreak: number;
  totalTime: number;
  addXP: (amount: number) => void;
  addTime: (minutes: number) => void;
  updateDailyStreak: () => void;
}

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.pow(xp / 100, 0.4)) + 1;
};

const calculateNextLevelXP = (level: number): number => {
  return Math.pow((level) / 0.4, 2.5) * 100;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      dailyStreak: 0,
      totalTime: 0,

      addXP: (amount: number) => {
        const sound = useSound();
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = calculateLevel(newXP);
          
          if (newLevel > state.level) {
            sound.playEffect('levelUp');
          } else {
            sound.playEffect('xp');
          }

          return {
            xp: newXP,
            level: newLevel,
          };
        });
      },

      addTime: (minutes: number) => {
        set((state) => ({
          totalTime: state.totalTime + minutes,
        }));
      },

      updateDailyStreak: () => {
        const lastUpdate = localStorage.getItem('lastStreakUpdate');
        const today = new Date().toDateString();

        if (lastUpdate !== today) {
          localStorage.setItem('lastStreakUpdate', today);
          set((state) => ({
            dailyStreak: state.dailyStreak + 1,
          }));
          useSound().playEffect('achievement');
        }
      },
    }),
    {
      name: 'progress-storage',
    }
  )
); 