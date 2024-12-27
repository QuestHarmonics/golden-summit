import React from 'react';
import { formatDuration } from '../../utils/timeFormatting';

interface OfflineProgressProps {
  xpGained: number;
  offlineDuration: number;
  multiplier: number;
}

export function OfflineProgress({ xpGained, offlineDuration, multiplier }: OfflineProgressProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
      <h3 className="font-pixel text-lg mb-2">Welcome Back!</h3>
      <div className="space-y-1">
        <p>You were away for {formatDuration(offlineDuration)}</p>
        <p className="text-xl font-medium">
          +{xpGained} XP gained!
        </p>
        {multiplier > 1 && (
          <p className="text-sm text-blue-200">
            ({multiplier}x multiplier applied)
          </p>
        )}
      </div>
    </div>
  );
} 