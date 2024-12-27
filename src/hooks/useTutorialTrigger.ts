import { useEffect } from 'react';
import { useTutorialStore } from '../store/tutorialStore';

export function useTutorialTrigger(
  trigger: string,
  action?: string,
  dependencies: any[] = []
) {
  const checkTrigger = useTutorialStore(state => state.checkTrigger);

  useEffect(() => {
    checkTrigger(trigger, action);
  }, [...dependencies, checkTrigger]);
} 