import React from 'react';

interface GameIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function GameIcon({ name, size = 'md', animated = false }: GameIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div 
      className={`
        inline-block bg-contain bg-center bg-no-repeat
        ${sizeClasses[size]}
        ${animated ? 'animate-bounce-slow' : ''}
      `}
      style={{ 
        backgroundImage: `url(/sprites/${name}.png)` 
      }}
    />
  );
} 