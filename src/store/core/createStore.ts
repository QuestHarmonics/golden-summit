import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreState, InitOptions, ValidationResult, StoreMeta } from '../types';
import { CONFIG } from '../../config/development';

export function createStore<T extends StoreState>(
  name: string,
  creator: StateCreator<T>,
  options: {
    version?: string;
    dependencies?: string[];
    validate?: (state: T) => ValidationResult;
  } = {}
) {
  const storeMeta: StoreMeta = {
    name,
    version: options.version || '1.0.0',
    lastSync: new Date(),
    dependencies: options.dependencies || []
  };

  return create<T>()(
    persist(
      (set, get) => ({
        ...creator(set, get),
        initialized: false,
        loading: false,
        error: null,

        initialize: async (initOptions: InitOptions = {}) => {
          const state = get();
          if (state.initialized) return;

          set({ loading: true, error: null });

          try {
            // Check dependencies
            if (storeMeta.dependencies.length > 0) {
              await validateDependencies(storeMeta.dependencies);
            }

            // Load saved data if needed
            if (initOptions.loadSavedData) {
              await loadSavedData(name);
            }

            // Validate state if validator provided
            if (options.validate) {
              const validation = options.validate(get());
              if (!validation.isValid) {
                throw new Error(`Store validation failed: ${validation.errors.join(', ')}`);
              }
            }

            set({ initialized: true, loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
          }
        },

        reset: () => {
          set({
            initialized: false,
            loading: false,
            error: null
          });
        }
      }),
      {
        name: `game-store-${name}`,
        version: options.version || 1,
        partialize: (state) => {
          const { loading, error, ...persistedState } = state;
          return persistedState;
        }
      }
    )
  );
}

async function validateDependencies(dependencies: string[]) {
  for (const dep of dependencies) {
    const store = window[`game-store-${dep}`];
    if (!store?.initialized) {
      throw new Error(`Dependency store "${dep}" not initialized`);
    }
  }
}

async function loadSavedData(storeName: string) {
  if (CONFIG.MOCK_SERVICES) return;
  
  try {
    const saved = localStorage.getItem(`game-store-${storeName}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Failed to load saved data for ${storeName}:`, error);
  }
} 