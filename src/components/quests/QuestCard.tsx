import React from 'react';
import { Quest } from '../../types/quest';
import { useQuestStore } from '../../store/questStore';

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
}

export function QuestCard({ quest, onClick }: QuestCardProps) {
  const { getQuestProgress } = useQuestStore();
  const progress = getQuestProgress(quest.id);

  return (
    <div 
      className="p-4 bg-gray-800 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-pixel text-lg text-white">{quest.title}</h3>
        <span className={`
          px-2 py-1 text-xs rounded font-pixel
          ${getDifficultyColor(quest.difficulty)}
        `}>
          {quest.difficulty}
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-4">{quest.description}</p>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Rewards Preview */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="text-yellow-400">
          +{quest.rewards.xp} XP
        </div>
        {quest.rewards.skillXp && Object.entries(quest.rewards.skillXp).map(([skill, xp]) => (
          <div key={skill} className="text-green-400">
            +{xp} {skill}
          </div>
        ))}
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: Quest['difficulty']) {
  switch (difficulty) {
    case 'trivial': return 'bg-gray-600 text-gray-200';
    case 'easy': return 'bg-green-600 text-green-100';
    case 'medium': return 'bg-blue-600 text-blue-100';
    case 'hard': return 'bg-purple-600 text-purple-100';
    case 'epic': return 'bg-yellow-600 text-yellow-100';
  }
} 