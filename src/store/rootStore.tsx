import React, { createContext } from 'react';
import { create } from 'zustand';

interface StoreState {
  gameState: {
    started: boolean;
  };
  setGameStarted: (started: boolean) => void;
}

export const StoreContext = createContext<StoreState | null>(null);

export const useStore = create<StoreState>((set) => ({
  gameState: {
    started: false
  },
  setGameStarted: (started) => set((state) => ({
    gameState: { ...state.gameState, started }
  }))
})); 