import { useEffect, useRef } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useTutorialStore } from '../store/tutorialStore';

export function useTutorialAnalytics() {
  const startTime = useRef<Date>();
  const currentStepId = useRef<string>();
  
  const { activeTutorial, getCurrentStep } = useTutorialStore();
  const { 
    startSession,
    endSession,
    trackAction,
    trackStepTime,
    trackHintView
  } = useAnalyticsStore();

  // Track tutorial session
  useEffect(() => {
    if (activeTutorial) {
      startSession(activeTutorial.id);
      startTime.current = new Date();
    } else if (startTime.current) {
      endSession();
      startTime.current = undefined;
    }
  }, [activeTutorial?.id]);

  // Track step time
  useEffect(() => {
    const currentStep = getCurrentStep();
    if (!currentStep) return;

    if (currentStep.id !== currentStepId.current) {
      if (currentStepId.current && startTime.current) {
        const timeSpent = Date.now() - startTime.current.getTime();
        trackStepTime(currentStepId.current, timeSpent);
      }
      currentStepId.current = currentStep.id;
      startTime.current = new Date();
    }
  }, [getCurrentStep]);

  return {
    trackAction,
    trackHintView
  };
} 