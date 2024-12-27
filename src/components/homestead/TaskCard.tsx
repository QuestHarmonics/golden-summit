import React from 'react';
import { HomesteadTask } from '../../types/homestead';

interface TaskCardProps {
  task: HomesteadTask;
  onComplete?: () => void;
  onStart?: () => void;
}

export function TaskCard({ task, onComplete, onStart }: TaskCardProps) {
  const isActive = !!onComplete;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <span className="text-sm text-gray-500 capitalize">{task.type.toLowerCase()}</span>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {task.skillType}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {task.resourceRewards.map(reward => (
          <div key={reward.type} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
            +{reward.amount} {reward.type}
          </div>
        ))}
      </div>

      {task.streak > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-orange-600">🔥 Streak: {task.streak}</span>
          <span className="text-xs text-gray-500">
            ({(task.streakBonus * 100).toFixed(0)}% bonus)
          </span>
        </div>
      )}

      <button
        onClick={isActive ? onComplete : onStart}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isActive 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isActive ? 'Complete Task' : 'Start Task'}
      </button>
    </div>
  );
} 