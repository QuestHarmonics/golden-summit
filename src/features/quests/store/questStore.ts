import { create } from 'zustand';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Quest, QuestStatus } from '../types/Quest';

interface QuestState {
  quests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  loading: boolean;
  error: string | null;
}

interface QuestActions {
  fetchQuests: (familyId: string) => Promise<void>;
  createQuest: (quest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateQuestStatus: (questId: string, status: QuestStatus) => Promise<void>;
  clearError: () => void;
}

export const useQuestStore = create<QuestState & QuestActions>((set, get) => ({
  quests: [],
  activeQuests: [],
  completedQuests: [],
  loading: false,
  error: null,

  fetchQuests: async (familyId: string) => {
    set({ loading: true, error: null });
    try {
      const questsRef = collection(db, 'quests');
      const q = query(
        questsRef,
        where('familyId', '==', familyId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const quests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quest[];

      const activeQuests = quests.filter(quest => quest.status === QuestStatus.IN_PROGRESS);
      const completedQuests = quests.filter(quest => quest.status === QuestStatus.COMPLETED);
      
      set({
        quests,
        activeQuests,
        completedQuests,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch quests',
        loading: false
      });
    }
  },

  createQuest: async (quest) => {
    set({ loading: true, error: null });
    try {
      if (!quest.familyId) {
        throw new Error('Family ID is required');
      }

      const now = Timestamp.now();
      await addDoc(collection(db, 'quests'), {
        ...quest,
        createdAt: now,
        updatedAt: now
      });

      // Refresh quests after creating a new one
      await get().fetchQuests(quest.familyId);
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create quest',
        loading: false
      });
    }
  },

  updateQuestStatus: async (questId: string, status: QuestStatus) => {
    set({ loading: true, error: null });
    try {
      const questRef = doc(db, 'quests', questId);
      await updateDoc(questRef, {
        status,
        updatedAt: Timestamp.now(),
        ...(status === QuestStatus.COMPLETED ? { completedAt: Timestamp.now() } : {})
      });

      // Get the current quests and update the local state
      const { quests } = get();
      const updatedQuests = quests.map(quest =>
        quest.id === questId ? { ...quest, status } : quest
      );

      const activeQuests = updatedQuests.filter(quest => quest.status === QuestStatus.IN_PROGRESS);
      const completedQuests = updatedQuests.filter(quest => quest.status === QuestStatus.COMPLETED);

      set({
        quests: updatedQuests,
        activeQuests,
        completedQuests,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update quest status',
        loading: false
      });
    }
  },

  clearError: () => set({ error: null })
})); 