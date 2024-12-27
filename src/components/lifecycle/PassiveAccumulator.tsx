import React, { useEffect } from 'react';
import { useLifeCycleStore } from '../../store/lifeCycleStore';
import { PixelatedProgressBar } from '../ui/PixelatedProgressBar';

export function PassiveAccumulator() {
  const { passiveAccumulator, updatePassiveXP, collectPassiveXP } = useLifeCycleStore();

  // Update passive XP every minute
  useEffect(() => {
    const interval = setInterval(() => {
      updatePassiveXP();
    }, 60000);

    return () => clearInterval(interval);
  }, [updatePassiveXP]);

  if (!passiveAccumulator.unlocked) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="font-pixel text-gray-400">PASSIVE XP</div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-pixel">
            {passiveAccumulator.rate * passiveAccumulator.multiplier}/hr
          </span>
          {passiveAccumulator.stored > 0 && (
            <button
              onClick={() => collectPassiveXP()}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded font-pixel text-sm"
            >
              COLLECT
            </button>
          )}
        </div>
      </div>

      <PixelatedProgressBar
        progress={passiveAccumulator.stored / passiveAccumulator.capacity}
        color="#10B981"
        showPixels
      />

      <div className="flex justify-between text-sm mt-1">
        <span className="text-gray-500 font-pixel">
          {passiveAccumulator.stored} XP
        </span>
        <span className="text-gray-500 font-pixel">
          {passiveAccumulator.capacity} MAX
        </span>
      </div>
    </div>
  );
} 