import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { QuestPredictor } from '../utils/questPredictor';
import { QuestSuggestion } from '../types/quests';

export const QuestSuggestions = () => {
  const { metrics, quests } = useGameStore();
  const [suggestions, setSuggestions] = useState<QuestSuggestion[]>([]);
  const predictor = new QuestPredictor();

  useEffect(() => {
    predictor.updatePatterns(metrics);
    const newSuggestions = predictor.suggestQuests(quests);
    setSuggestions(newSuggestions);
  }, [metrics, quests]);

  return (
    <div className="quest-suggestions">
      <h3>Suggested Next Steps</h3>
      {suggestions.map(({ quest, confidence, reason }) => (
        <div key={quest.id} className="suggestion-card">
          <div className="quest-info">
            <h4>{quest.title}</h4>
            <p>{quest.description}</p>
            <div className="confidence-bar" style={{ '--confidence': `${confidence * 100}%` } as any}>
              {(confidence * 100).toFixed(0)}% Match
            </div>
          </div>
          <div className="reason">{reason}</div>
          <button 
            className="accept-quest"
            onClick={() => useGameStore.getState().startQuest(quest.id)}
          >
            Accept Quest
          </button>
        </div>
      ))}
    </div>
  );
}; 