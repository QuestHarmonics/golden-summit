import { createStore } from './core/createStore';
import { StoreState } from './types';
import { CookingSkill, CookingSession } from '../types/skills/cooking';
import { useProgressStore } from './progressStore';
import { CONFIG } from '../config/development';

interface CookingState extends StoreState {
  skill: CookingSkill;
  activeSessions: Record<string, CookingSession>;
  completedSessions: CookingSession[];
  
  startCooking: (ingredients: string[], recipeId?: string) => string;
  endCooking: (sessionId: string, success: boolean, notes?: string) => void;
  addTechnique: (sessionId: string, technique: CookingTechnique) => void;
  calculateXP: (session: CookingSession) => number;
  getActiveMultiplier: () => number;
}

export const useCookingStore = createStore<CookingState>(
  'cooking',
  (set, get) => ({
    skill: {
      id: 'cooking',
      level: 1,
      currentXP: 0,
      requiredXP: 1000,
      specialties: [],
      techniques: [],
      recipesKnown: [],
      achievements: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    activeSessions: {},
    completedSessions: [],

    startCooking: (ingredients, recipeId) => {
      const sessionId = crypto.randomUUID();
      const session: CookingSession = {
        id: sessionId,
        startTime: new Date(),
        ingredients,
        techniques: [],
        difficulty: 1,
        success: false,
        recipeId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set(state => ({
        activeSessions: {
          ...state.activeSessions,
          [sessionId]: session
        }
      }));

      return sessionId;
    },

    endCooking: (sessionId, success, notes) => {
      const session = get().activeSessions[sessionId];
      if (!session) return;

      const endTime = new Date();
      const duration = endTime.getTime() - session.startTime.getTime();
      const xpGained = get().calculateXP({
        ...session,
        endTime,
        success,
        notes
      });

      // Update skill XP
      const progressStore = useProgressStore.getState();
      progressStore.addXp(xpGained, {
        source: 'skill',
        multiplier: get().getActiveMultiplier(),
        skillId: 'cooking'
      });

      // Complete session
      set(state => {
        const { [sessionId]: removed, ...remaining } = state.activeSessions;
        return {
          activeSessions: remaining,
          completedSessions: [
            {
              ...session,
              endTime,
              success,
              notes,
              xpGained
            },
            ...state.completedSessions
          ]
        };
      });
    },

    calculateXP: (session) => {
      let baseXP = session.ingredients.length * 10;
      
      // Add technique bonuses
      baseXP += session.techniques.length * 15;
      
      // Add time bonus (cap at 2 hours)
      const cookingTime = Math.min(
        (session.endTime!.getTime() - session.startTime.getTime()) / 3600000,
        2
      );
      baseXP += cookingTime * 20;

      // Success multiplier
      if (session.success) {
        baseXP *= 1.5;
      }

      return Math.round(baseXP);
    },

    getActiveMultiplier: () => {
      const { skill } = get();
      let multiplier = 1;

      // Level bonus
      multiplier += (skill.level - 1) * 0.1;

      // Technique bonus
      multiplier += skill.techniques.length * 0.05;

      // Specialty bonus
      multiplier += skill.specialties.length * 0.1;

      return multiplier;
    }
  }),
  {
    version: '1.0.0',
    dependencies: ['progress', 'health'],
    validate: (state) => ({
      isValid: state.skill.level > 0 && state.skill.requiredXP > 0,
      errors: []
    })
  }
); 