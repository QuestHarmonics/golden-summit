import React from 'react';

export function GitProgressBar({ commits, target }: { commits: number; target: number }) {
  const progress = Math.min((commits / target) * 100, 100);
  
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded">
      <div 
        className="absolute h-full bg-blue-500 rounded transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
      <div className="absolute w-full text-center text-xs font-pixel">
        {commits}/{target} Commits
      </div>
    </div>
  );
} 