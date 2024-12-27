import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useQuestStore } from '../../store/questStore';
import { RetroSoundSynth } from '../../utils/RetroSoundSynth';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  element?: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  requiredForProgress: boolean;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Golden Summit!',
    content: 'Your journey to self-improvement begins here. Let\'s get you started with the basics.',
    position: 'top',
    requiredForProgress: false
  },
  {
    id: 'daily-quests',
    title: 'Daily Quests',
    content: 'Complete daily quests to earn XP and level up your skills. Each quest is designed to help you build better habits.',
    element: '.quest-list',
    position: 'right',
    requiredForProgress: true
  },
  {
    id: 'skill-tree',
    title: 'Skill Tree',
    content: 'Track your progress in different areas of life. As you complete quests, your skills will level up.',
    element: '.skill-tree',
    position: 'left',
    requiredForProgress: true
  },
  {
    id: 'first-quest',
    title: 'Your First Quest',
    content: 'Let\'s complete your first quest! Click on any quest in the list to begin.',
    element: '.quest-item',
    position: 'right',
    requiredForProgress: true
  }
];

export const TutorialManager: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { isTutorialComplete, completeTutorial } = useGameStore();
  const { initializeTutorial } = useQuestStore();

  useEffect(() => {
    if (!isTutorialComplete) {
      initializeTutorial();
      RetroSoundSynth.Instance.playEffect('powerUp');
    }
  }, [isTutorialComplete, initializeTutorial]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      RetroSoundSynth.Instance.playEffect('xp');
      
      // Execute step action if exists
      const nextStep = tutorialSteps[currentStep + 1];
      if (nextStep.action) {
        nextStep.action();
      }

      // Highlight the target element if specified
      if (nextStep.element) {
        const element = document.querySelector(nextStep.element);
        if (element) {
          element.classList.add('tutorial-highlight');
        }
      }
    } else {
      completeTutorial();
      setIsVisible(false);
      RetroSoundSynth.Instance.playEffect('achievement');
    }
  };

  const handleSkip = () => {
    completeTutorial();
    setIsVisible(false);
    RetroSoundSynth.Instance.playEffect('error');
  };

  if (isTutorialComplete || !isVisible) return null;

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="tutorial-overlay">
      <div className={`tutorial-popup tutorial-${currentTutorialStep.position}`}>
        <h3>{currentTutorialStep.title}</h3>
        <p>{currentTutorialStep.content}</p>
        <div className="tutorial-controls">
          {!currentTutorialStep.requiredForProgress && (
            <button onClick={handleSkip} className="tutorial-skip">
              Skip Tutorial
            </button>
          )}
          <button onClick={handleNext} className="tutorial-next">
            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
        <div className="tutorial-progress">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 