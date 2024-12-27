import React from 'react';

interface PixelatedProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showPixels?: boolean;
}

export function PixelatedProgressBar({ 
  progress, 
  color = '#3B82F6',
  height = 8,
  showPixels = true
}: PixelatedProgressBarProps) {
  const pixelSize = height / 2;
  const numPixels = Math.floor(100 / pixelSize);
  const filledPixels = Math.floor(progress * numPixels);

  return (
    <div 
      className="bg-gray-900 rounded overflow-hidden"
      style={{ height }}
    >
      {showPixels ? (
        <div className="flex h-full">
          {Array.from({ length: numPixels }).map((_, i) => (
            <div
              key={i}
              className="h-full transition-colors duration-300"
              style={{
                width: pixelSize,
                backgroundColor: i < filledPixels ? color : 'transparent'
              }}
            />
          ))}
        </div>
      ) : (
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: color
          }}
        />
      )}
    </div>
  );
} 