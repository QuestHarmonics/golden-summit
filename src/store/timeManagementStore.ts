import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createBaseStore } from './core/createBaseStore';
import { TimeBlock, TimeCategory } from '../types/timeManagement';
import { calculateScaledReward } from '../utils/rewardCalculations';

interface TimeManagementState {
  activeTimer: {
    startTime: number;
    category: TimeCategory;
    taskId?: string;
  } | null;
  timeBlocks: Record<string, TimeBlock>;
  categories: Record<string, TimeCategory>;
  
  // Timer methods
  startTimer: (category: string, taskId?: string) => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  
  // Time tracking
  addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
  getTimeSpentToday: (category?: string) => number;
  getDailyStreak: () => number;

  questTimers: Record<string, {
    totalTime: number;
    segments: { start: number; end: number; }[];
  }>;
  
  // Add methods
  startQuestTimer: (questId: string) => void;
  pauseQuestTimer: (questId: string) => void;
  getQuestTime: (questId: string) => number;
}

export const useTimeManagementStore = create<TimeManagementState>()(
  persist(
    (set, get) => ({
      ...createBaseStore<TimeBlock>(set),
      activeTimer: null,
      timeBlocks: {},
      categories: {
        work: {
          id: 'work',
          name: 'Work',
          color: '#4F46E5',
          xpMultiplier: 1.2
        },
        study: {
          id: 'study',
          name: 'Study',
          color: '#059669',
          xpMultiplier: 1.5
        },
        exercise: {
          id: 'exercise',
          name: 'Exercise',
          color: '#DC2626',
          xpMultiplier: 1.3
        }
      },

      startTimer: (categoryId, taskId) => {
        set({
          activeTimer: {
            startTime: Date.now(),
            category: get().categories[categoryId],
            taskId
          }
        });
      },

      pauseTimer: () => {
        const { activeTimer } = get();
        if (!activeTimer) return;

        const duration = Date.now() - activeTimer.startTime;
        const timeBlock: TimeBlock = {
          id: crypto.randomUUID(),
          categoryId: activeTimer.category.id,
          taskId: activeTimer.taskId,
          startTime: new Date(activeTimer.startTime),
          duration,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        get().addTimeBlock(timeBlock);
        set({ activeTimer: null });
      },

      stopTimer: () => {
        get().pauseTimer();
      },

      addTimeBlock: (block) => {
        const timeBlock: TimeBlock = {
          ...block,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set(state => ({
          timeBlocks: {
            ...state.timeBlocks,
            [timeBlock.id]: timeBlock
          }
        }));

        // Award XP based on time spent and category multiplier
        const category = get().categories[block.categoryId];
        if (category) {
          const minutes = Math.floor(block.duration / 60000);
          const baseXP = minutes * 5; // 5 XP per minute
          const reward = calculateScaledReward({
            baseXP,
            scalingFactor: category.xpMultiplier,
            minLevel: 0
          }, 1); // TODO: Get actual player level

          // TODO: Award XP through progress store
        }
      },

      getTimeSpentToday: (categoryId?) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return Object.values(get().timeBlocks)
          .filter(block => {
            const blockDate = new Date(block.startTime);
            return blockDate >= today && (!categoryId || block.categoryId === categoryId);
          })
          .reduce((total, block) => total + block.duration, 0);
      },

      getDailyStreak: () => {
        const timeBlocks = Object.values(get().timeBlocks);
        if (timeBlocks.length === 0) return 0;

        let streak = 1;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        while (true) {
          currentDate.setDate(currentDate.getDate() - 1);
          const hasTimeBlock = timeBlocks.some(block => {
            const blockDate = new Date(block.startTime);
            blockDate.setHours(0, 0, 0, 0);
            return blockDate.getTime() === currentDate.getTime();
          });

          if (!hasTimeBlock) break;
          streak++;
        }

        return streak;
      },

      questTimers: {},

      startQuestTimer: (questId) => {
        set(state => ({
          questTimers: {
            ...state.questTimers,
            [questId]: {
              totalTime: state.questTimers[questId]?.totalTime || 0,
              segments: [
                ...(state.questTimers[questId]?.segments || []),
                { start: Date.now(), end: 0 }
              ]
            }
          }
        }));
      },

      pauseQuestTimer: (questId) => {
        const now = Date.now();
        set(state => {
          const timer = state.questTimers[questId];
          if (!timer) return state;

          const lastSegment = timer.segments[timer.segments.length - 1];
          if (!lastSegment || lastSegment.end !== 0) return state;

          const newSegments = [...timer.segments];
          newSegments[newSegments.length - 1] = {
            ...lastSegment,
            end: now
          };

          const totalTime = newSegments.reduce(
            (total, seg) => total + (seg.end - seg.start),
            0
          );

          return {
            questTimers: {
              ...state.questTimers,
              [questId]: {
                totalTime,
                segments: newSegments
              }
            }
          };
        });

        // Award XP based on time spent
        const timer = get().questTimers[questId];
        if (timer) {
          const minutes = Math.floor(timer.totalTime / 60000);
          const baseXP = minutes * 3; // 3 XP per minute on quests
          // TODO: Add to quest completion XP
        }
      },

      getQuestTime: (questId) => {
        const timer = get().questTimers[questId];
        if (!timer) return 0;

        const activeSegment = timer.segments.find(seg => seg.end === 0);
        const activeTime = activeSegment 
          ? Date.now() - activeSegment.start 
          : 0;

        return timer.totalTime + activeTime;
      }
    }),
    {
      name: 'time-management'
    }
  )
); 