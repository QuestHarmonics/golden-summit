import React from 'react';
import { useDevProgressStore } from '../../store/devProgressStore';
import { GitStatus } from './GitStatus';
import { GitProgressBar } from './GitProgressBar';

export function DevDashboard() {
  const {
    roadmap,
    currentFocus,
    timeSpent,
    getNextTasks,
    getCompletionPercentage
  } = useDevProgressStore();

  const nextTasks = getNextTasks();
  const completion = getCompletionPercentage();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-pixel">Development Progress</h1>
        <div className="text-xl font-pixel text-blue-600">
          {completion.toFixed(1)}% Complete
        </div>
      </div>

      <GitStatus />

      {/* Current Focus */}
      {currentFocus && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="font-pixel text-lg mb-2">Currently Working On:</h2>
          <div className="flex items-center justify-between">
            <span className="font-medium">{roadmap[currentFocus].title}</span>
            <span className="text-gray-600">
              Time Spent: {(timeSpent[currentFocus] || 0).toFixed(0)} minutes
            </span>
          </div>
        </div>
      )}

      {/* Next Tasks */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-pixel text-lg mb-4">Next Up</h2>
        <div className="space-y-4">
          {nextTasks.map(task => (
            <div 
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600">
                  Estimated: {task.estimatedHours} hours
                </p>
              </div>
              <button
                onClick={() => useDevProgressStore.getState().startWork(task.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 