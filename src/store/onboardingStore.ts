import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingState } from '../types/user/preferences';
import { generateSkillSuggestions } from '../services/skills/skillSuggestion';

interface OnboardingStore {
  state: OnboardingState;
  suggestions: SkillSuggestion[];
  
  setAboutMe: (text: string) => void;
  setInterests: (interests: string[]) => void;
  addCustomSkill: (skill: CustomSkill) => void;
  removeCustomSkill: (skillName: string) => void;
  setSelectedSkills: (skills: string[]) => void;
  setDailyGoals: (goals: OnboardingState['dailyGoals']) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      state: {
        step: 0,
        completed: false,
        aboutMe: '',
        interests: [],
        selectedSkills: [],
        customSkills: [],
        dailyGoals: {
          focusTimeBlocks: 4
        }
      },
      suggestions: [],

      setAboutMe: (text) => {
        set(state => ({
          state: { ...state.state, aboutMe: text },
          suggestions: generateSkillSuggestions(text, state.state.interests)
        }));
      },

      setInterests: (interests) => {
        set(state => ({
          state: { ...state.state, interests },
          suggestions: generateSkillSuggestions(state.state.aboutMe, interests)
        }));
      },

      addCustomSkill: (skill) => {
        set(state => ({
          state: {
            ...state.state,
            customSkills: [...state.state.customSkills, skill]
          }
        }));
      },

      removeCustomSkill: (skillName) => {
        set(state => ({
          state: {
            ...state.state,
            customSkills: state.state.customSkills.filter(
              skill => skill.name !== skillName
            )
          }
        }));
      },

      setSelectedSkills: (skills) => {
        set(state => ({
          state: { ...state.state, selectedSkills: skills }
        }));
      },

      setDailyGoals: (goals) => {
        set(state => ({
          state: { ...state.state, dailyGoals: goals }
        }));
      },

      nextStep: () => {
        set(state => ({
          state: { ...state.state, step: state.state.step + 1 }
        }));
      },

      previousStep: () => {
        set(state => ({
          state: { ...state.state, step: Math.max(0, state.state.step - 1) }
        }));
      },

      completeOnboarding: () => {
        set(state => ({
          state: { ...state.state, completed: true }
        }));
      }
    }),
    {
      name: 'onboarding-store'
    }
  )
); 