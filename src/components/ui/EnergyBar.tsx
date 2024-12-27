import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelatedProgressBar } from './PixelatedProgressBar';

export function EnergyBar() {
  const { energy, maxEnergy, regeneration, updateEnergy } = useGameStore();

  // Update energy every second if regeneration is active
  useEffect(() => {
    if (!regeneration?.active) return;

    const interval = setInterval(() => {
      updateEnergy();
    }, 1000);

    return () => clearInterval(interval);
  }, [regeneration, updateEnergy]);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="font-pixel text-gray-400">ENERGY</div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-pixel">
            {Math.floor(energy)}/{maxEnergy}
          </span>
          {regeneration?.active && (
            <div className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-pixel">
              +{regeneration.rate}/min
            </div>
          )}
        </div>
      </div>

      <PixelatedProgressBar
        progress={energy / maxEnergy}
        color={regeneration?.active ? '#10B981' : '#EAB308'}
        showPixels
      />

      {regeneration?.active && (
        <div className="text-xs text-gray-500 mt-1">
          Regenerating for {formatTimeRemaining(new Date(regeneration.endTime))}
        </div>
      )}
    </div>
  );
}

function formatTimeRemaining(endTime: Date): string {
  const remaining = endTime.getTime() - Date.now();
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
} 