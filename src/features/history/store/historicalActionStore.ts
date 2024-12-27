import { create } from 'zustand';
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import {
  HistoricalAction,
  HistoricalActionType,
  HistoricalQuest,
  HistoricalQuestType,
  HISTORICAL_ACTION_REWARDS
} from '../types/HistoricalActions';
import { useProfileStore } from '../../profile/store/profileStore';

interface HistoricalActionState {
  actions: HistoricalAction[];
  quests: HistoricalQuest[];
  loading: boolean;
  error: string | null;
}

interface HistoricalActionActions {
  fetchActions: (nodeId: string) => Promise<void>;
  fetchQuests: (nodeId: string) => Promise<void>;
  recordAction: (
    type: HistoricalActionType,
    nodeId: string,
    userId: string,
    data: HistoricalAction['data'],
    questId?: string
  ) => Promise<void>;
  createQuest: (quest: Omit<HistoricalQuest, 'id' | 'createdAt' | 'progress'>) => Promise<void>;
  updateQuestProgress: (questId: string, completedRequirement: string) => Promise<void>;
  claimReward: (actionId: string) => Promise<void>;
  clearError: () => void;
}

export const useHistoricalActionStore = create<HistoricalActionState & HistoricalActionActions>((set, get) => ({
  actions: [],
  quests: [],
  loading: false,
  error: null,

  fetchActions: async (nodeId: string) => {
    set({ loading: true, error: null });
    try {
      const actionsRef = collection(db, 'historicalActions');
      const q = query(actionsRef, where('nodeId', '==', nodeId));
      const querySnapshot = await getDocs(q);
      
      const actions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoricalAction[];

      set({
        actions,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch historical actions',
        loading: false
      });
    }
  },

  fetchQuests: async (nodeId: string) => {
    set({ loading: true, error: null });
    try {
      const questsRef = collection(db, 'historicalQuests');
      const q = query(questsRef, where('nodeId', '==', nodeId));
      const querySnapshot = await getDocs(q);
      
      const quests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoricalQuest[];

      set({
        quests,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch historical quests',
        loading: false
      });
    }
  },

  recordAction: async (type, nodeId, userId, data, questId) => {
    set({ loading: true, error: null });
    try {
      const reward = HISTORICAL_ACTION_REWARDS[type];
      const action: Omit<HistoricalAction, 'id'> = {
        type,
        nodeId,
        userId,
        questId,
        data,
        timestamp: Timestamp.now(),
        rewardClaimed: false,
        reward
      };

      const actionRef = await addDoc(collection(db, 'historicalActions'), action);

      // Update quest progress if this action is part of a quest
      if (questId) {
        const quest = get().quests.find(q => q.id === questId);
        if (quest) {
          const requirement = quest.requirements.find(r => r.actionType === type);
          if (requirement) {
            await get().updateQuestProgress(questId, actionRef.id);
          }
        }
      }

      set(state => ({
        actions: [...state.actions, { id: actionRef.id, ...action }],
        loading: false
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to record historical action',
        loading: false
      });
    }
  },

  createQuest: async (quest) => {
    set({ loading: true, error: null });
    try {
      const newQuest: Omit<HistoricalQuest, 'id'> = {
        ...quest,
        createdAt: Timestamp.now(),
        progress: {
          current: 0,
          required: quest.requirements.reduce((sum, req) => sum + req.count, 0),
          completedRequirements: []
        }
      };

      const questRef = await addDoc(collection(db, 'historicalQuests'), newQuest);

      set(state => ({
        quests: [...state.quests, { id: questRef.id, ...newQuest }],
        loading: false
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create historical quest',
        loading: false
      });
    }
  },

  updateQuestProgress: async (questId: string, completedRequirement: string) => {
    set({ loading: true, error: null });
    try {
      const quest = get().quests.find(q => q.id === questId);
      if (!quest) throw new Error('Quest not found');

      const updatedProgress = {
        current: quest.progress.current + 1,
        required: quest.progress.required,
        completedRequirements: [...quest.progress.completedRequirements, completedRequirement]
      };

      const questRef = doc(db, 'historicalQuests', questId);
      await updateDoc(questRef, {
        progress: updatedProgress,
        ...(updatedProgress.current >= updatedProgress.required
          ? { completedAt: Timestamp.now() }
          : {})
      });

      // If quest is completed, grant additional rewards
      if (updatedProgress.current >= updatedProgress.required) {
        const reward = HISTORICAL_ACTION_REWARDS[HistoricalActionType.COMPLETE_QUEST];
        await useProfileStore.getState().updateXP(quest.assignedTo!, reward.xp);
        await useProfileStore.getState().updateGold(quest.assignedTo!, reward.gold);
      }

      set(state => ({
        quests: state.quests.map(q =>
          q.id === questId
            ? {
                ...q,
                progress: updatedProgress,
                ...(updatedProgress.current >= updatedProgress.required
                  ? { completedAt: Timestamp.now() }
                  : {})
              }
            : q
        ),
        loading: false
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update quest progress',
        loading: false
      });
    }
  },

  claimReward: async (actionId: string) => {
    set({ loading: true, error: null });
    try {
      const action = get().actions.find(a => a.id === actionId);
      if (!action) throw new Error('Action not found');
      if (action.rewardClaimed) throw new Error('Reward already claimed');

      const { reward } = action;
      if (!reward) throw new Error('No reward available');

      // Update user's XP and gold
      await useProfileStore.getState().updateXP(action.userId, reward.xp);
      await useProfileStore.getState().updateGold(action.userId, reward.gold);

      // Mark reward as claimed
      const actionRef = doc(db, 'historicalActions', actionId);
      await updateDoc(actionRef, { rewardClaimed: true });

      set(state => ({
        actions: state.actions.map(a =>
          a.id === actionId ? { ...a, rewardClaimed: true } : a
        ),
        loading: false
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to claim reward',
        loading: false
      });
    }
  },

  clearError: () => set({ error: null })
})); 