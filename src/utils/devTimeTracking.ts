import { useDevProgressStore } from '../store/devProgressStore';

let startTime: number | null = null;
let trackingInterval: NodeJS.Timeout | null = null;

export function startTimeTracking(taskId: string) {
  startTime = Date.now();
  
  // Update time every minute
  trackingInterval = setInterval(() => {
    if (startTime) {
      const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
      useDevProgressStore.getState().updateTimeSpent(taskId, 1);
    }
  }, 60000);
}

export function stopTimeTracking() {
  if (startTime && trackingInterval) {
    clearInterval(trackingInterval);
    startTime = null;
    trackingInterval = null;
  }
}

export function getElapsedTime(): string {
  if (!startTime) return '0:00';
  
  const elapsed = Date.now() - startTime;
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
} 