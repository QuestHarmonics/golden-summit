import { useEffect } from 'react';
import { useDailyQuestStore } from '../store/dailyQuestStore';
import { useStore } from '../store/rootStore';

export function DailyQuestTracker() {
  const {
    dailyQuests,
    activeQuests,
    multiplier,
    completeQuest,
    resetDailyQuests
  } = useDailyQuestStore();

  const { addXp } = useStore();

  // Check for reset at midnight
  useEffect(() => {
    resetDailyQuests();
    const interval = setInterval(resetDailyQuests, 1000 * 60 * 60); // Check hourly
    return () => clearInterval(interval);
  }, []);

  const handleQuestComplete = (questId: string, xpReward: number) => {
    completeQuest(questId);
    const bonusXp = Math.round(xpReward * multiplier);
    addXp(bonusXp, {
      source: questId,
      type: 'QUEST',
      amount: xpReward,
      multiplier
    });
  };

  return (
    <div className="daily-quest-tracker">
      <h2>Daily Quests</h2>
      <div className="multiplier">
        Current XP Multiplier: {multiplier.toFixed(2)}x
      </div>
      <div className="quest-list">
        {activeQuests.map(questId => {
          const quest = dailyQuests[questId];
          return (
            <div key={questId} className="quest-item">
              <input
                type="checkbox"
                checked={quest.completed}
                onChange={() => handleQuestComplete(questId, 50)} // xpReward from quest data
                disabled={quest.completed}
              />
              <span className={quest.completed ? 'completed' : ''}>
                {questId} {/* Replace with actual quest title */}
                {quest.streakCount > 1 && ` (${quest.streakCount} day streak!)`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 