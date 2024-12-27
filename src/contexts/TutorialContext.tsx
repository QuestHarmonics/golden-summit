import React, { createContext, useContext, useEffect } from 'react';
import { useTutorialStore } from '../store/tutorialStore';
import { TutorialOverlay } from '../components/tutorial/TutorialOverlay';

const TutorialContext = createContext<null>(null);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const isEnabled = useTutorialStore(state => state.isEnabled);
  const activeTutorial = useTutorialStore(state => state.activeTutorial);

  // Auto-start getting-started tutorial for new users
  useEffect(() => {
    if (isEnabled && !activeTutorial) {
      const progress = useTutorialStore.getState().progress;
      if (!progress['getting-started']) {
        useTutorialStore.getState().startTutorial('getting-started');
      }
    }
  }, [isEnabled, activeTutorial]);

  return (
    <TutorialContext.Provider value={null}>
      {children}
      {isEnabled && <TutorialOverlay />}
    </TutorialContext.Provider>
  );
} 