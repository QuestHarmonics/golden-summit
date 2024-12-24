import { create } from 'zustand';
import { Quest, QuestProgress } from '../types/quest';
import { useHomesteadStore } from './homesteadStore';
import { useProgressStore } from './progressStore';
import { HOMESTEAD_QUESTS } from '../data/quests/homesteadQuests';

interface QuestStore {
  quests: Quest[];
  questProgress: QuestProgress[];
  addQuest: (quest: Quest) => void;
  updateQuest: (id: string, quest: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  updateProgress: (questId: string, progress: Partial<QuestProgress>) => void;
  getHomesteadQuests: () => Quest[];
  updateHomesteadProgress: (taskId: string) => void;
  initializeQuests: () => void;
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  quests: [],
  questProgress: [],
  addQuest: (quest) =>
    set((state) => ({
      quests: [...state.quests, quest]
    })),
  updateQuest: (id, quest) =>
    set((state) => ({
      quests: state.quests.map((q) => 
        q.id === id ? { ...q, ...quest } : q
      )
    })),
  deleteQuest: (id) =>
    set((state) => ({
      quests: state.quests.filter((q) => q.id !== id),
      questProgress: state.questProgress.filter((p) => p.questId !== id)
    })),
  updateProgress: (questId, progress) =>
    set((state) => ({
      questProgress: state.questProgress.map((p) =>
        p.questId === questId ? { ...p, ...progress } : p
      )
    })),
  getHomesteadQuests: () => {
    const homesteadStore = useHomesteadStore.getState();
    const homesteadLevel = homesteadStore.getHomesteadLevel();
    
    return get().quests.filter(quest => 
      quest.type === 'HOMESTEAD' && 
      quest.requirements.level <= homesteadLevel
    );
  },
  updateHomesteadProgress: (taskId: string) => {
    set(state => ({
      questProgress: state.questProgress.map(progress => {
        const quest = state.quests.find(q => q.id === progress.questId);
        if (quest?.type !== 'HOMESTEAD') return progress;

        const updatedCount = progress.count + 1;
        const isComplete = updatedCount >= quest.requirements.count;

        if (isComplete) {
          // Award quest rewards
          useHomesteadStore.getState().addResources(quest.rewards.resources);
          useProgressStore.getState().addXP('HOMESTEAD', quest.rewards.xp);
        }

        return {
          ...progress,
          count: updatedCount,
          completed: isComplete,
          completedAt: isComplete ? new Date() : null
        };
      })
    }));
  },
  initializeQuests: () => {
    const existingQuests = get().quests;
    const homesteadQuests = HOMESTEAD_QUESTS.filter(
      quest => !existingQuests.some(eq => eq.id === quest.id)
    );

    set(state => ({
      quests: [...state.quests, ...homesteadQuests],
      questProgress: [
        ...state.questProgress,
        ...homesteadQuests.map(quest => ({
          questId: quest.id,
          count: 0,
          completed: false,
          completedAt: null
        }))
      ]
    }));
  }
})); 