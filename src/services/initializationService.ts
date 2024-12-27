import { CONFIG } from '../config/development';
import { useProgressStore } from '../store/progressStore';
import { useTimeStore } from '../store/timeStore';
import { useQuestStore } from '../store/questStore';
import { useResourceStore } from '../store/resourceStore';
import { startBackgroundSync } from './backgroundSync';

const INITIALIZATION_ORDER = [
  'progress',   // Base progression system
  'time',       // Time tracking
  'resource',   // Resource management
  'quest'       // Quest system
] as const;

export async function initializeGame() {
  try {
    // Initialize stores in order
    for (const storeName of INITIALIZATION_ORDER) {
      await initializeStore(storeName);
    }

    // Start background processes
    startBackgroundSync();
    
    // Initial state setup
    setupInitialGameState();

    return true;
  } catch (error) {
    console.error('Game initialization failed:', error);
    return false;
  }
}

async function initializeStore(storeName: string) {
  const store = getStoreByName(storeName);
  if (!store) {
    throw new Error(`Store "${storeName}" not found`);
  }

  await store.initialize({
    loadSavedData: !CONFIG.MOCK_SERVICES,
    mockData: CONFIG.MOCK_SERVICES
  });
}

function getStoreByName(name: string) {
  switch (name) {
    case 'progress':
      return useProgressStore.getState();
    case 'time':
      return useTimeStore.getState();
    case 'resource':
      return useResourceStore.getState();
    case 'quest':
      return useQuestStore.getState();
    default:
      return null;
  }
}

function setupInitialGameState() {
  const questStore = useQuestStore.getState();
  const timeStore = useTimeStore.getState();

  // Generate initial quests if needed
  if (questStore.getActiveQuests().length === 0) {
    questStore.generateInitialQuests();
  }

  // Calculate offline progress
  timeStore.calculateOfflineProgress();
}

export function getInitializationStatus() {
  return INITIALIZATION_ORDER.every(storeName => {
    const store = getStoreByName(storeName);
    return store?.initialized;
  });
} 