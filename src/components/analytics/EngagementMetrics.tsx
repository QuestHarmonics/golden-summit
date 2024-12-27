import React from 'react';
import { tutorials } from '../../data/tutorials';
import { GameIcon } from '../ui/GameIcon';

export function EngagementMetrics() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-pixel mb-4">Tutorial Engagement</h3>
      
      <div className="space-y-6">
        {Object.values(tutorials).map(tutorial => (
          <div key={tutorial.id} className="border-b pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <GameIcon name="quest-scroll" />
                <h4 className="font-pixel">{tutorial.title}</h4>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Completion: <span className="font-medium">78%</span>
                </span>
                <span className="text-gray-600">
                  Avg. Time: <span className="font-medium">5m 23s</span>
                </span>
                <span className="text-gray-600">
                  Hint Usage: <span className="font-medium">12%</span>
                </span>
              </div>
            </div>

            {/* Step breakdown */}
            <div className="grid grid-cols-1 gap-2 mt-4">
              {tutorial.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span className="text-sm text-gray-600">
                    {index + 1}. {step.title}
                  </span>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-500">
                      Avg. Time: <span className="font-medium">45s</span>
                    </span>
                    <span className="text-gray-500">
                      Drop-off: <span className="font-medium">3%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 