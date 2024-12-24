import { create } from 'zustand';
import { Quest, QuestStatus } from '../types/quest';

interface QuestStore {
  quests: Quest[];
  activeQuest: Quest | null;
  addQuest: (quest: Quest) => void;
  updateQuestStatus: (questId: string, status: QuestStatus) => void;
  setActiveQuest: (quest: Quest | null) => void;
}

export const useQuestStore = create<QuestStore>((set) => ({
  quests: [],
  activeQuest: null,
  addQuest: (quest) => set((state) => ({ quests: [...state.quests, quest] })),
  updateQuestStatus: (questId, status) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId ? { ...q, status } : q
      ),
    })),
  setActiveQuest: (quest) => set({ activeQuest: quest }),
})); 