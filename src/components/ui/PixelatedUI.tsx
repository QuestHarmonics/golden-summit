import React from 'react';

interface PixelatedUIProps {
  energy: number;
  xp: number;
  currentQuest?: string;
}

export function PixelatedUI({ energy, xp, currentQuest }: PixelatedUIProps) {
  return (
    <div className="fixed top-4 left-4 font-pixel" style={{ imageRendering: 'pixelated' }}>
      {/* Energy Bar */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">⚡</span>
          <div className="w-32 h-4 bg-gray-800 border border-gray-600">
            <div 
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>
      </div>

      {/* XP Counter */}
      <div className="flex items-center gap-2 text-green-400">
        <span>XP</span>
        <span className="font-bold">{xp.toString().padStart(6, '0')}</span>
      </div>

      {/* Active Quest */}
      {currentQuest && (
        <div className="mt-4 px-3 py-2 bg-gray-800 border border-gray-600 max-w-xs">
          <div className="text-xs text-gray-400">CURRENT QUEST</div>
          <div className="text-white">{currentQuest}</div>
        </div>
      )}
    </div>
  );
} 