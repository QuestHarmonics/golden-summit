import { create } from 'zustand';
import type { StoreState, XPGain } from '../types';

interface GameState {
  started: boolean;
  xp: number;
  level: number;
}

interface RootState extends StoreState {
  gameState: GameState;
  addXp: (amount: number, source: XPGain) => void;
}

const useStore = create<RootState>((set, get) => ({
  gameState: {
    started: false,
    xp: 0,
    level: 1
  },
  setGameStarted: (started) => set({ gameState: { ...get().gameState, started } }),
  addXp: (amount, source) => set((state) => ({
    gameState: {
      ...state.gameState,
      xp: state.gameState.xp + (amount * source.multiplier)
    }
  }))
}));

export { useStore }; 