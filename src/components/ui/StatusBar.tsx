import React from 'react';

interface StatusBarProps {
  current: number;
  max: number;
  type: 'hp' | 'mp' | 'xp';
  showText?: boolean;
}

export function StatusBar({ current, max, type, showText = true }: StatusBarProps) {
  const getColors = () => {
    switch (type) {
      case 'hp':
        return 'from-red-500 to-red-600 bg-red-200';
      case 'mp':
        return 'from-blue-500 to-blue-600 bg-blue-200';
      case 'xp':
        return 'from-green-500 to-green-600 bg-green-200';
      default:
        return 'from-gray-500 to-gray-600 bg-gray-200';
    }
  };

  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="relative w-full h-4 rounded-full bg-pattern overflow-hidden">
      <div 
        className={`h-full rounded-full bg-gradient-to-r ${getColors()} transition-all duration-300 ease-out`}
        style={{ width: `${percentage}%` }}
      />
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-pixel text-white shadow-sm">
          {current}/{max}
        </div>
      )}
    </div>
  );
} 