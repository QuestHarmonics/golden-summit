import { create } from 'zustand';
import { ResourceSystem } from '../types/resources';
import { persist } from 'zustand/middleware';

interface ResourceStore extends ResourceSystem {
  // Actions
  updateEnergy: (amount: number) => void;
  allocateTime: (activity: string, minutes: number) => void;
  gainExperience: (skill: string, amount: number) => void;
  applyModifier: (type: 'energy' | 'time' | 'skill', modifier: ResourceModifier) => void;
  
  // Calculations
  calculateEfficiency: () => number;
  getAvailableEnergy: () => number;
  getSkillMultiplier: (skill: string) => number;
  
  // Time Management
  startActivity: (activity: string) => void;
  completeActivity: (activity: string) => void;
  pauseActivity: (activity: string) => void;
}

export const useResourceStore = create<ResourceStore>()(
  persist(
    (set, get) => ({
      energy: {
        current: 100,
        max: 100,
        regenerationRate: 1,
        modifiers: []
      },
      time: {
        available: 24 * 60, // minutes in a day
        allocated: {},
        efficiency: 1
      },
      skills: {},

      updateEnergy: (amount) => {
        set(state => ({
          energy: {
            ...state.energy,
            current: Math.min(
              state.energy.max,
              Math.max(0, state.energy.current + amount)
            )
          }
        }));
      },

      // ... implement other methods
    }),
    {
      name: 'resource-storage'
    }
  )
); 