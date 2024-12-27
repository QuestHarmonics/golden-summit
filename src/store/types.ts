import { GameState, XPSource } from '../types/core';

// Base store state interface
export interface StoreState {
  gameState: {
    started: boolean;
  };
  setGameStarted: (started: boolean) => void;
}

// Store initialization options
export interface InitOptions {
  loadSavedData?: boolean;
  mockData?: boolean;
}

// Store validation results
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Store initialization status
export interface InitStatus {
  success: boolean;
  error?: string;
  timestamp: Date;
}

// Store metadata
export interface StoreMeta {
  name: string;
  version: string;
  lastSync: Date;
  dependencies: string[];
} 