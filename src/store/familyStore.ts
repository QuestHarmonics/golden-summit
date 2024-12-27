import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FamilyProfile, FamilyQuest, FamilyMember, FamilyTradition } from '../features/family/types/FamilyTypes';
import { familyQuestGenerator } from '../features/family/utils/FamilyQuestGenerator';

interface FamilyState {
  families: Record<string, FamilyProfile>;
  currentFamily: string | null;
  lastQuestGeneration: string | null;
}

interface FamilyActions {
  createFamily: (name: string, creator: FamilyMember) => void;
  joinFamily: (familyId: string, member: FamilyMember) => void;
  leaveFamily: (familyId: string, memberId: string) => void;
  updateFamilyProfile: (familyId: string, updates: Partial<FamilyProfile>) => void;
  generateDailyQuests: () => void;
  updateQuestProgress: (familyId: string, questId: string, memberId: string, progress: number) => void;
  completeQuest: (familyId: string, questId: string) => void;
  createTradition: (familyId: string, tradition: Omit<FamilyTradition, 'id' | 'createdAt'>) => void;
  celebrateTradition: (familyId: string, traditionId: string, memory: FamilyTradition['memories'][0]) => void;
}

export const useFamilyStore = create(
  persist<FamilyState & FamilyActions>(
    (set, get) => ({
      families: {},
      currentFamily: null,
      lastQuestGeneration: null,

      createFamily: (name, creator) => {
        const familyId = `family_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newFamily: FamilyProfile = {
          id: familyId,
          name,
          createdAt: new Date().toISOString(),
          members: [creator],
          traditions: [],
          quests: [],
          legacies: [],
          stats: {
            totalTraditions: 0,
            activeTraditions: 0,
            sharedSkills: 0,
            familyLevel: 1,
            legacyPoints: 0,
            questsCompleted: 0,
            milestonesAchieved: 0
          },
          settings: {
            privacyLevel: 'private',
            notificationPreferences: {
              traditions: true,
              quests: true,
              achievements: true,
              milestones: true
            },
            automatedQuests: true,
            traditionReminders: true
          }
        };

        set(state => ({
          families: {
            ...state.families,
            [familyId]: newFamily
          },
          currentFamily: familyId
        }));
      },

      joinFamily: (familyId, member) => {
        set(state => ({
          families: {
            ...state.families,
            [familyId]: {
              ...state.families[familyId],
              members: [...state.families[familyId].members, member]
            }
          }
        }));
      },

      leaveFamily: (familyId, memberId) => {
        set(state => ({
          families: {
            ...state.families,
            [familyId]: {
              ...state.families[familyId],
              members: state.families[familyId].members.filter(m => m.id !== memberId)
            }
          },
          currentFamily: state.currentFamily === familyId ? null : state.currentFamily
        }));
      },

      updateFamilyProfile: (familyId, updates) => {
        set(state => ({
          families: {
            ...state.families,
            [familyId]: {
              ...state.families[familyId],
              ...updates
            }
          }
        }));
      },

      generateDailyQuests: () => {
        const { currentFamily, families, lastQuestGeneration } = get();
        if (!currentFamily) return;

        const today = new Date().toISOString().split('T')[0];
        if (lastQuestGeneration === today) return;

        const family = families[currentFamily];
        const newQuests = familyQuestGenerator.generateDailyFamilyQuests(family);

        set(state => ({
          families: {
            ...state.families,
            [currentFamily]: {
              ...family,
              quests: [...family.quests, ...newQuests]
            }
          },
          lastQuestGeneration: today
        }));
      },

      updateQuestProgress: (familyId, questId, memberId, progress) => {
        set(state => {
          const family = state.families[familyId];
          const questIndex = family.quests.findIndex(q => q.id === questId);
          if (questIndex === -1) return state;

          const quest = family.quests[questIndex];
          const newProgress = {
            ...quest.progress,
            participantProgress: {
              ...quest.progress.participantProgress,
              [memberId]: progress
            }
          };

          // Calculate overall progress
          const requiredMembers = quest.participants.required.length;
          const totalProgress = Object.values(newProgress.participantProgress)
            .reduce((sum, p) => sum + p, 0);
          newProgress.overallProgress = totalProgress / requiredMembers;

          const updatedQuests = [...family.quests];
          updatedQuests[questIndex] = {
            ...quest,
            progress: newProgress,
            status: newProgress.overallProgress >= 1 ? 'completed' : 'active'
          };

          return {
            families: {
              ...state.families,
              [familyId]: {
                ...family,
                quests: updatedQuests
              }
            }
          };
        });
      },

      completeQuest: (familyId, questId) => {
        set(state => {
          const family = state.families[familyId];
          const quest = family.quests.find(q => q.id === questId);
          if (!quest) return state;

          // Update family stats
          const newStats = {
            ...family.stats,
            questsCompleted: family.stats.questsCompleted + 1
          };

          if (quest.type === 'tradition') {
            newStats.totalTraditions += 1;
          }

          // Apply rewards
          const updatedMembers = family.members.map(member => {
            if (quest.participants.required.includes(member.id)) {
              return {
                ...member,
                skills: {
                  ...member.skills,
                  shared: [...member.skills.shared, ...Object.keys(quest.rewards.individual.skills)]
                }
              };
            }
            return member;
          });

          return {
            families: {
              ...state.families,
              [familyId]: {
                ...family,
                members: updatedMembers,
                stats: {
                  ...newStats,
                  legacyPoints: newStats.legacyPoints + quest.rewards.family.legacyPoints
                },
                quests: family.quests.map(q =>
                  q.id === questId
                    ? { ...q, status: 'completed' }
                    : q
                )
              }
            }
          };
        });
      },

      createTradition: (familyId, tradition) => {
        const newTradition: FamilyTradition = {
          id: `tradition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          ...tradition,
          memories: []
        };

        set(state => ({
          families: {
            ...state.families,
            [familyId]: {
              ...state.families[familyId],
              traditions: [...state.families[familyId].traditions, newTradition],
              stats: {
                ...state.families[familyId].stats,
                totalTraditions: state.families[familyId].stats.totalTraditions + 1,
                activeTraditions: state.families[familyId].stats.activeTraditions + 1
              }
            }
          }
        }));
      },

      celebrateTradition: (familyId, traditionId, memory) => {
        set(state => {
          const family = state.families[familyId];
          const traditionIndex = family.traditions.findIndex(t => t.id === traditionId);
          if (traditionIndex === -1) return state;

          const updatedTraditions = [...family.traditions];
          updatedTraditions[traditionIndex] = {
            ...updatedTraditions[traditionIndex],
            lastCelebrated: memory.date,
            memories: [...updatedTraditions[traditionIndex].memories, memory]
          };

          return {
            families: {
              ...state.families,
              [familyId]: {
                ...family,
                traditions: updatedTraditions,
                stats: {
                  ...family.stats,
                  legacyPoints: family.stats.legacyPoints + 10
                }
              }
            }
          };
        });
      }
    }),
    {
      name: 'family-storage',
      getStorage: () => localStorage
    }
  )
); 