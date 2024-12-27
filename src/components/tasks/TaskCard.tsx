import React from 'react';
import { Task } from '../../types/task';
import { StatusBar } from '../ui/StatusBar';

interface TaskCardProps {
  task: Task;
  onComplete: (quality: number) => void;
  onDelete: () => void;
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return '🔥'; // Using emojis for now, could be replaced with sprite icons
      case 'medium':
        return '⚡';
      case 'low':
        return '💧';
      default:
        return '•';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-pixel text-lg">{task.title}</h3>
          <span className="text-xl">{getPriorityIcon()}</span>
        </div>
        
        {task.description && (
          <p className="text-gray-600 mb-4">{task.description}</p>
        )}

        <div className="space-y-2">
          {/* Progress bar for subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <StatusBar
              current={task.subtasks.filter(st => st.completed).length}
              max={task.subtasks.length}
              type="hp"
            />
          )}

          {/* XP Reward indicator */}
          <div className="flex items-center text-sm">
            <span className="font-pixel text-yellow-500">+{task.xpReward} XP</span>
          </div>

          {/* Related skills */}
          <div className="flex flex-wrap gap-2">
            {task.relatedSkills.map(skill => (
              <span 
                key={skill}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-pixel"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => onComplete(5)} // Default to max quality
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-pixel"
          >
            Complete
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-pixel"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 