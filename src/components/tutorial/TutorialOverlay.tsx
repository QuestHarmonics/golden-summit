import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

const tutorialSteps = [
  {
    title: "Welcome to Golden Summit! 🏔️",
    content: "Your journey of personal growth starts here. Let's get you started with the basics.",
    target: "body"
  },
  {
    title: "Passive Growth 📈",
    content: "You automatically gain XP over time. The higher your level, the more XP you earn!",
    target: ".passive-xp"
  },
  {
    title: "Track Your Progress 📊",
    content: "Log your activities to gain bonus XP and track your growth in different areas.",
    target: ".metric-logger"
  },
  {
    title: "View Your Journey 🗺️",
    content: "Check your progress dashboard to see how far you've come and plan where to go next.",
    target: ".progress-dashboard"
  }
];

export const TutorialOverlay = () => {
  const { completeTutorial } = useGameStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const step = tutorialSteps[currentStep];

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content" data-target={step.target}>
        <h3>{step.title}</h3>
        <p>{step.content}</p>
        <div className="tutorial-controls">
          <div className="progress">
            Step {currentStep + 1} of {tutorialSteps.length}
          </div>
          <button onClick={handleNext}>
            {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}; 