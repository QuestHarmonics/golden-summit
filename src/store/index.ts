import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, PlayerState, TimeState } from './types';

// Root store combining all features
interface RootStore {
  // Game state
  gameState: GameState;
  setGameState: (state: Partial<GameState>) => void;
  
  // Player state
  player: PlayerState;
  updatePlayer: (updates: Partial<PlayerState>) => void;
  
  // Time management
  time: TimeState;
  advanceTime: (minutes: number) => void;
  
  // Active features/modules
  activeModules: {
    quests: boolean;
    skills: boolean;
    farming: boolean;
    homestead: boolean;
    timeManagement: boolean;
  };
  toggleModule: (module: keyof RootStore['activeModules']) => void;
}

export const useStore = create<RootStore>()(
  persist(
    (set, get) => ({
      // Initial states and actions
      gameState: {
        started: false,
        tutorial: true,
        difficulty: 'normal',
        version: '0.1.0'
      },
      setGameState: (updates) => 
        set(state => ({ 
          gameState: { ...state.gameState, ...updates } 
        })),

      player: {
        name: '',
        level: 1,
        xp: 0,
        energy: 100,
        skills: {},
        inventory: {},
        achievements: []
      },
      updatePlayer: (updates) =>
        set(state => ({
          player: { ...state.player, ...updates }
        })),

      time: {
        currentDate: new Date(),
        daysPassed: 0,
        season: 'spring',
        weather: 'clear'
      },
      advanceTime: (minutes) => {
        // Time progression logic
      },

      activeModules: {
        quests: true,
        skills: true,
        farming: false,
        homestead: false,
        timeManagement: true
      },
      toggleModule: (module) =>
        set(state => ({
          activeModules: {
            ...state.activeModules,
            [module]: !state.activeModules[module]
          }
        }))
    }),
    {
      name: 'game-storage'
    }
  )
); 