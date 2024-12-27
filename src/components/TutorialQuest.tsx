import { useState } from 'react';

interface TutorialQuestProps {
  quest: {
    id: string;
    title: string;
    description: string;
    expiresAfter: number;
  };
  onComplete: (id: string) => void;
  onUnderstand: (id: string) => void;
}

const checkUnderstanding = async () => {
  // Implement your understanding check logic here
  return true; // Temporary return for testing
};

const promptForReplacement = (quest: TutorialQuestProps['quest']) => {
  // Implement replacement logic here
  console.log('Quest completed, ready for replacement:', quest.id);
};

const generateReplacement = (quest: TutorialQuestProps['quest']) => {
  // Implement AI or user-generated quest logic here
  console.log('Generating replacement for quest:', quest.id);
};

export const TutorialQuest = ({ quest, onComplete, onUnderstand }: TutorialQuestProps) => {
  const [completions, setCompletions] = useState(0);
  const [isLevelUp, setIsLevelUp] = useState(false);

  const handleCompletion = () => {
    setCompletions(prev => prev + 1);
    onComplete(quest.id);

    if (completions + 1 >= quest.expiresAfter) {
      // Trigger self-destruct
      promptForReplacement(quest);
    }
  };

  const verifyUnderstanding = async () => {
    const understood = await checkUnderstanding();
    if (understood) {
      setIsLevelUp(true);
      onUnderstand(quest.id);
      // Replace with user-generated or AI quest
      generateReplacement(quest);
    }
  };

  return (
    <div className={`tutorial-quest ${isLevelUp ? 'level-up' : ''}`}>
      <h3>{quest.title}</h3>
      <p>{quest.description}</p>
      <div className="quest-status">
        <span>Completions: {completions}/{quest.expiresAfter}</span>
        <button onClick={handleCompletion}>Complete</button>
        <button onClick={verifyUnderstanding}>I Understand</button>
      </div>
    </div>
  );
}; 