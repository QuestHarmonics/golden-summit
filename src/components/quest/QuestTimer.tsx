import React, { useEffect, useState } from 'react';
import { useQuestStore } from '../../store/questStore';
import { useTimeManagementStore } from '../../store/timeManagementStore';
import { formatTime } from '../../utils/timeFormatting';

interface QuestTimerProps {
  questId: string;
}

export function QuestTimer({ questId }: QuestTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const quest = useQuestStore(state => state.items[questId]);
  const { startTimer, pauseTimer, activeTimer } = useTimeManagementStore();

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (activeTimer && activeTimer.questId === questId) {
      interval = setInterval(() => {
        const elapsed = Date.now() - activeTimer.startTime;
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer, questId]);

  const handleStartQuest = () => {
    startTimer('quest', questId);
  };

  const handlePauseQuest = () => {
    pauseTimer();
  };

  const isActive = activeTimer?.questId === questId;
  const timeDisplay = formatTime(elapsedTime);

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="font-pixel text-2xl text-blue-600">
        {timeDisplay}
      </div>
      <button
        onClick={isActive ? handlePauseQuest : handleStartQuest}
        className={`px-4 py-2 rounded-md font-medium ${
          isActive 
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isActive ? 'Pause Quest' : 'Start Quest'}
      </button>
      {quest.estimatedTime && (
        <div className="text-sm text-gray-500">
          Estimated: {formatTime(quest.estimatedTime * 60000)}
        </div>
      )}
    </div>
  );
} 