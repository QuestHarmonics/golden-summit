import { useTimeStore } from '../store/timeStore';
import { useProgressStore } from '../store/progressStore';

let syncInterval: NodeJS.Timer;

export function startBackgroundSync() {
  // Clear any existing interval
  if (syncInterval) {
    clearInterval(syncInterval);
  }

  // Set up periodic sync
  syncInterval = setInterval(() => {
    useTimeStore.getState().sync();
  }, useTimeStore.getState().syncInterval);

  // Initial sync
  useTimeStore.getState().sync();
}

export function stopBackgroundSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
  }
}

// Handle visibility changes
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      useTimeStore.getState().calculateOfflineProgress();
      startBackgroundSync();
    } else {
      stopBackgroundSync();
    }
  });
} 