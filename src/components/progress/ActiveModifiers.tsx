import React from 'react';
import { useProgressStore } from '../../store/progressStore';

export function ActiveModifiers() {
  const modifiers = useProgressStore(state => state.modifiers);

  if (modifiers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Active Modifiers</h3>
      <div className="space-y-3">
        {modifiers.map(modifier => {
          const timeLeft = new Date(modifier.startTime).getTime() + modifier.duration - Date.now();
          const minutesLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60)));

          return (
            <div key={modifier.id} className="flex justify-between items-center">
              <div>
                <span className="font-medium">{modifier.source}</span>
                <span className="text-sm text-gray-600 ml-2">
                  ({modifier.multiplier}x)
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {minutesLeft} min remaining
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 