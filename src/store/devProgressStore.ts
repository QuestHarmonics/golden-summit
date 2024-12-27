import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { projectRoadmap, RoadmapItem } from '../data/roadmap/projectRoadmap';

interface DevProgressState {
  roadmap: Record<string, RoadmapItem>;
  currentFocus: string | null;
  timeSpent: Record<string, number>; // in minutes
  
  startWork: (itemId: string) => void;
  completeItem: (itemId: string) => void;
  updateTimeSpent: (itemId: string, minutes: number) => void;
  getNextTasks: () => RoadmapItem[];
  getCompletionPercentage: () => number;
}

export const useDevProgressStore = create<DevProgressState>()(
  persist(
    (set, get) => ({
      roadmap: projectRoadmap,
      currentFocus: null,
      timeSpent: {},

      startWork: (itemId) => {
        set(state => ({
          currentFocus: itemId,
          roadmap: {
            ...state.roadmap,
            [itemId]: {
              ...state.roadmap[itemId],
              status: 'in-progress',
              updatedAt: new Date()
            }
          }
        }));
      },

      completeItem: (itemId) => {
        set(state => ({
          roadmap: {
            ...state.roadmap,
            [itemId]: {
              ...state.roadmap[itemId],
              status: 'completed',
              completedAt: new Date(),
              updatedAt: new Date()
            }
          },
          currentFocus: null
        }));
      },

      updateTimeSpent: (itemId, minutes) => {
        set(state => ({
          timeSpent: {
            ...state.timeSpent,
            [itemId]: (state.timeSpent[itemId] || 0) + minutes
          }
        }));
      },

      getNextTasks: () => {
        const { roadmap } = get();
        return Object.values(roadmap)
          .filter(item => {
            if (item.status !== 'pending') return false;
            return item.dependencies.every(depId => 
              roadmap[depId]?.status === 'completed'
            );
          })
          .sort((a, b) => a.priority - b.priority);
      },

      getCompletionPercentage: () => {
        const { roadmap } = get();
        const total = Object.keys(roadmap).length;
        const completed = Object.values(roadmap)
          .filter(item => item.status === 'completed')
          .length;
        return (completed / total) * 100;
      }
    }),
    {
      name: 'dev-progress'
    }
  )
); 