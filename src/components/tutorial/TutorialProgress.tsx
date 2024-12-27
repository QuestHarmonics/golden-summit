import React from 'react';
import { useTutorialStore } from '../../store/tutorialStore';
import { tutorials } from '../../data/tutorials';
import { GameIcon } from '../ui/GameIcon';

export function TutorialProgress() {
  const progress = useTutorialStore(state => state.progress);
  const startTutorial = useTutorialStore(state => state.startTutorial);
  const isEnabled = useTutorialStore(state => state.isEnabled);
  const toggleTutorials = useTutorialStore(state => state.toggleTutorials);

  const availableTutorials = Object.values(tutorials).filter(tutorial => 
    !progress[tutorial.id]?.completed
  );

  const completedTutorials = Object.values(tutorials).filter(tutorial =>
    progress[tutorial.id]?.completed
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-pixel">Tutorials</h2>
        <button
          onClick={() => toggleTutorials(!isEnabled)}
          className={`px-4 py-2 rounded-md font-pixel ${
            isEnabled 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isEnabled ? 'Disable' : 'Enable'} Tutorials
        </button>
      </div>

      {/* Available Tutorials */}
      <div className="mb-8">
        <h3 className="text-lg font-pixel mb-4">Available</h3>
        <div className="space-y-4">
          {availableTutorials.map(tutorial => (
            <div
              key={tutorial.id}
              className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <GameIcon name="quest-scroll" />
                  <h4 className="font-pixel">{tutorial.title}</h4>
                </div>
                <button
                  onClick={() => startTutorial(tutorial.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-pixel text-sm"
                  disabled={!tutorial.prerequisites.every(id => progress[id]?.completed)}
                >
                  Start
                </button>
              </div>
              <p className="text-sm text-gray-600">{tutorial.description}</p>
              
              {/* Prerequisites */}
              {tutorial.prerequisites.length > 0 && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">Prerequisites: </span>
                  {tutorial.prerequisites.map(id => (
                    <span
                      key={id}
                      className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
                        progress[id]?.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {tutorials[id]?.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Completed Tutorials */}
      {completedTutorials.length > 0 && (
        <div>
          <h3 className="text-lg font-pixel mb-4">Completed</h3>
          <div className="space-y-2">
            {completedTutorials.map(tutorial => (
              <div
                key={tutorial.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <GameIcon name="checkmark" />
                  <span className="font-pixel text-gray-600">{tutorial.title}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(progress[tutorial.id].completedAt!).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 