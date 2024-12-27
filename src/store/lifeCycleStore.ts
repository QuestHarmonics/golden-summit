import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LifeCycleActivity, LIFE_CYCLE_ACTIVITIES } from '../types/lifecycle';
import { TimeOfDay } from '../types/lifecycle';
import { PassiveAccumulator } from '../types/lifecycle';

interface LifeCycleState {
  activities: LifeCycleActivity[];
  completedActivities: Record<string, {
    lastCompleted: Date;
    streak: number;
    totalCompletions: number;
  }>;
  activeBuffs: {
    energyRestore: number;
    focusBoost: number;
    skillMultiplier: number;
  };
  passiveAccumulator: PassiveAccumulator;
}

interface LifeCycleStore extends LifeCycleState {
  completeActivity: (activityId: string) => void;
  checkStreak: (activityId: string) => number;
  getAvailableActivities: (timeOfDay: TimeOfDay) => LifeCycleActivity[];
  getActiveBuffs: () => LifeCycleState['activeBuffs'];
  resetDailyActivities: () => void;
  resetWeeklyActivities: () => void;
  updatePassiveXP: () => void;
  collectPassiveXP: () => number;
}

export const useLifeCycleStore = create<LifeCycleStore>()(
  persist(
    (set, get) => ({
      activities: LIFE_CYCLE_ACTIVITIES,
      completedActivities: {},
      activeBuffs: {
        energyRestore: 0,
        focusBoost: 1,
        skillMultiplier: 1
      },
      passiveAccumulator: {
        rate: 1,
        multiplier: 1,
        lastUpdate: new Date(),
        capacity: 100,
        stored: 0,
        unlocked: false
      },

      completeActivity: (activityId) => {
        const activity = get().activities.find(a => a.id === activityId);
        if (!activity) return;

        const now = new Date();
        const lastCompletion = get().completedActivities[activityId]?.lastCompleted;
        const streak = get().checkStreak(activityId);

        set(state => {
          const newState = {
            completedActivities: {
              ...state.completedActivities,
              [activityId]: {
                lastCompleted: now,
                streak: streak + 1,
                totalCompletions: (state.completedActivities[activityId]?.totalCompletions || 0) + 1
              }
            },
            activeBuffs: {
              energyRestore: state.activeBuffs.energyRestore + (activity.buffs?.energyRestore || 0),
              focusBoost: state.activeBuffs.focusBoost * (activity.buffs?.focusBoost || 1),
              skillMultiplier: state.activeBuffs.skillMultiplier * (activity.buffs?.skillMultiplier || 1)
            }
          };

          if (activity.passiveBonus) {
            const newAccumulator = {
              ...state.passiveAccumulator,
              rate: state.passiveAccumulator.rate + (activity.passiveBonus.accumulatorBoost || 0),
              capacity: state.passiveAccumulator.capacity + (activity.passiveBonus.capacityBoost || 0)
            };

            if (!state.passiveAccumulator.unlocked) {
              newAccumulator.unlocked = true;
            }

            newState.passiveAccumulator = newAccumulator;
          }

          return newState;
        });
      },

      checkStreak: (activityId) => {
        const completion = get().completedActivities[activityId];
        if (!completion) return 0;

        const activity = get().activities.find(a => a.id === activityId);
        if (!activity) return 0;

        const now = new Date();
        const lastCompleted = new Date(completion.lastCompleted);

        // Check if streak is still valid based on frequency
        const daysSinceCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24);
        
        switch (activity.frequency) {
          case 'daily':
            return daysSinceCompletion <= 1 ? completion.streak : 0;
          case 'weekly':
            return daysSinceCompletion <= 7 ? completion.streak : 0;
          case 'monthly':
            return daysSinceCompletion <= 31 ? completion.streak : 0;
          default:
            return completion.streak;
        }
      },

      getAvailableActivities: (timeOfDay) => {
        const now = new Date();
        return get().activities.filter(activity => {
          // Check time of day requirement
          if (activity.requirements?.timeOfDay && 
              !activity.requirements.timeOfDay.includes(timeOfDay)) {
            return false;
          }

          // Check if already completed based on frequency
          const completion = get().completedActivities[activity.id];
          if (!completion) return true;

          const lastCompleted = new Date(completion.lastCompleted);
          const hoursSinceCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);

          switch (activity.frequency) {
            case 'daily':
              return hoursSinceCompletion >= 24;
            case 'weekly':
              return hoursSinceCompletion >= 168;
            case 'monthly':
              return hoursSinceCompletion >= 720;
            default:
              return true;
          }
        });
      },

      getActiveBuffs: () => get().activeBuffs,

      resetDailyActivities: () => {
        set(state => ({
          activeBuffs: {
            energyRestore: 0,
            focusBoost: 1,
            skillMultiplier: 1
          }
        }));
      },

      resetWeeklyActivities: () => {
        // Reset weekly-specific buffs or states
      },

      updatePassiveXP: () => {
        set(state => {
          const now = new Date();
          const hoursSinceUpdate = (now.getTime() - new Date(state.passiveAccumulator.lastUpdate).getTime()) / (1000 * 60 * 60);
          
          const xpGained = Math.floor(
            hoursSinceUpdate * 
            state.passiveAccumulator.rate * 
            state.passiveAccumulator.multiplier
          );

          const newStored = Math.min(
            state.passiveAccumulator.stored + xpGained,
            state.passiveAccumulator.capacity
          );

          return {
            passiveAccumulator: {
              ...state.passiveAccumulator,
              stored: newStored,
              lastUpdate: now
            }
          };
        });
      },

      collectPassiveXP: () => {
        const { stored } = get().passiveAccumulator;
        if (stored > 0) {
          set(state => ({
            passiveAccumulator: {
              ...state.passiveAccumulator,
              stored: 0
            }
          }));
          return stored;
        }
        return 0;
      }
    }),
    {
      name: 'lifecycle-storage'
    }
  )
); 