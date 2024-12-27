import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tutorial, TutorialProgress, TutorialStep } from '../types/tutorial';
import { useProgressStore } from './progressStore';
import { tutorials } from '../data/tutorials';

interface TutorialStore {
  activeTutorial: Tutorial | null;
  progress: Record<string, TutorialProgress>;
  isEnabled: boolean;
  
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  completeTutorial: () => void;
  toggleTutorials: (enabled: boolean) => void;
  checkTrigger: (trigger: string, action?: string) => void;
  getCurrentStep: () => TutorialStep | null;
  canStartTutorial: (tutorialId: string) => boolean;
}

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      activeTutorial: null,
      progress: {},
      isEnabled: true,

      startTutorial: (tutorialId) => {
        const tutorial = tutorials[tutorialId];
        if (!tutorial || !get().canStartTutorial(tutorialId)) return;

        const progress: TutorialProgress = {
          id: crypto.randomUUID(),
          userId: 'current-user', // TODO: Get from auth store
          tutorialId,
          currentStep: 0,
          completed: false,
          completedSteps: [],
          startedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set(state => ({
          activeTutorial: tutorial,
          progress: {
            ...state.progress,
            [tutorialId]: progress
          }
        }));
      },

      nextStep: () => {
        const { activeTutorial } = get();
        if (!activeTutorial) return;

        const progress = get().progress[activeTutorial.id];
        if (!progress || progress.completed) return;

        const currentStep = activeTutorial.steps[progress.currentStep];
        if (!currentStep) return;

        // Add current step to completed steps
        const completedSteps = [...progress.completedSteps, currentStep.id];
        
        // Check if this was the last step
        const isComplete = progress.currentStep === activeTutorial.steps.length - 1;
        
        if (isComplete) {
          // Award rewards if tutorial is complete
          if (activeTutorial.rewards) {
            const { xp, skills } = activeTutorial.rewards;
            if (xp) useProgressStore.getState().addXp(xp);
            if (skills) {
              Object.entries(skills).forEach(([skillId, amount]) => {
                useProgressStore.getState().updateSkill(skillId, amount);
              });
            }
          }
        }

        set(state => ({
          progress: {
            ...state.progress,
            [activeTutorial.id]: {
              ...progress,
              currentStep: isComplete ? progress.currentStep : progress.currentStep + 1,
              completed: isComplete,
              completedSteps,
              completedAt: isComplete ? new Date() : undefined,
              updatedAt: new Date()
            }
          },
          activeTutorial: isComplete ? null : activeTutorial
        }));
      },

      completeTutorial: () => {
        const { activeTutorial } = get();
        if (!activeTutorial) return;

        set(state => ({
          activeTutorial: null,
          progress: {
            ...state.progress,
            [activeTutorial.id]: {
              ...state.progress[activeTutorial.id],
              completed: true,
              completedAt: new Date(),
              updatedAt: new Date()
            }
          }
        }));
      },

      toggleTutorials: (enabled) => {
        set({ isEnabled: enabled });
      },

      checkTrigger: (trigger, action) => {
        if (!get().isEnabled || !get().activeTutorial) return;

        const currentStep = get().getCurrentStep();
        if (!currentStep) return;

        if (
          currentStep.trigger === trigger &&
          (!currentStep.action || currentStep.action === action) &&
          (!currentStep.nextCondition || currentStep.nextCondition())
        ) {
          get().nextStep();
        }
      },

      getCurrentStep: () => {
        const { activeTutorial } = get();
        if (!activeTutorial) return null;

        const progress = get().progress[activeTutorial.id];
        if (!progress) return null;

        return activeTutorial.steps[progress.currentStep] || null;
      },

      canStartTutorial: (tutorialId) => {
        const tutorial = tutorials[tutorialId];
        if (!tutorial) return false;

        // Check prerequisites
        return tutorial.prerequisites.every(prereqId => 
          get().progress[prereqId]?.completed
        );
      }
    }),
    {
      name: 'tutorial-store'
    }
  )
); 