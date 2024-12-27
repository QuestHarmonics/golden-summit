import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quest, questGenerator } from '../utils/QuestGenerator';
import { useGameStore } from './gameStore';

interface QuestLog {
  progress: number;
  startedAt: string;
  completedAt?: string;
}

interface QuestState {
  quests: Record<string, Quest>;
  questLogs: Record<string, QuestLog>;
  lastQuestGeneration: string | null;
}

interface QuestActions {
  generateDailyQuests: () => void;
  updateProgress: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  initializeTutorial: () => void;
}

export const useQuestStore = create(
  persist<QuestState & QuestActions>(
    (set, get) => ({
      quests: {},
      questLogs: {},
      lastQuestGeneration: null,

      generateDailyQuests: () => {
        const today = new Date().toISOString().split('T')[0];
        if (get().lastQuestGeneration === today) return;

        const gameStore = useGameStore.getState();
        const currentUser = gameStore.currentUser;
        if (!currentUser) return;

        const userSkills = gameStore.users[currentUser]?.data.skills || [];
        const newQuests = questGenerator.generateDailyQuests(userSkills);
        
        const questsMap: Record<string, Quest> = {};
        const logsMap: Record<string, QuestLog> = {};
        
        newQuests.forEach(quest => {
          questsMap[quest.id] = quest;
          logsMap[quest.id] = {
            progress: 0,
            startedAt: new Date().toISOString()
          };
        });

        set(state => ({
          quests: {
            ...state.quests,
            ...questsMap
          },
          questLogs: {
            ...state.questLogs,
            ...logsMap
          },
          lastQuestGeneration: today
        }));
      },

      updateProgress: (questId: string, progress: number) => {
        set(state => ({
          questLogs: {
            ...state.questLogs,
            [questId]: {
              ...state.questLogs[questId],
              progress: Math.min(1, Math.max(0, progress))
            }
          }
        }));
      },

      completeQuest: (questId: string) => {
        set(state => ({
          questLogs: {
            ...state.questLogs,
            [questId]: {
              ...state.questLogs[questId],
              progress: 1,
              completedAt: new Date().toISOString()
            }
          }
        }));
      },

      initializeTutorial: () => {
        const tutorialQuests = questGenerator.generateTutorialQuests();
        const questsMap: Record<string, Quest> = {};
        const logsMap: Record<string, QuestLog> = {};
        
        tutorialQuests.forEach(quest => {
          questsMap[quest.id] = quest;
          logsMap[quest.id] = {
            progress: 0,
            startedAt: new Date().toISOString()
          };
        });

        set(state => ({
          quests: {
            ...state.quests,
            ...questsMap
          },
          questLogs: {
            ...state.questLogs,
            ...logsMap
          }
        }));
      }
    }),
    {
      name: 'quest-storage',
      getStorage: () => localStorage
    }
  )
); 