import React from 'react';
import { useResourceStore } from '../../store/resourceStore';

export function ResourceDisplay() {
  const { energy, time, skills } = useResourceStore();

  return (
    <div className="p-4 font-pixel">
      {/* Energy Meter */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>ENERGY</span>
          <span>{energy.current}/{energy.max}</span>
        </div>
        <div className="h-4 bg-gray-800 border-2 border-gray-600">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all"
            style={{ 
              width: `${(energy.current / energy.max) * 100}%`,
              boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1)'
            }}
          />
        </div>
      </div>

      {/* Time Block */}
      <div className="grid grid-cols-24 gap-px bg-gray-800 p-1">
        {Array.from({ length: 24 }).map((_, hour) => (
          <div
            key={hour}
            className={`h-6 ${
              time.allocated[hour] 
                ? 'bg-blue-500' 
                : 'bg-gray-700'
            }`}
            title={`${hour}:00`}
          />
        ))}
      </div>

      {/* Skills */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {Object.entries(skills).map(([name, skill]) => (
          <div key={name} className="bg-gray-800 p-2 border border-gray-700">
            <div className="text-xs mb-1">{name.toUpperCase()}</div>
            <div className="text-lg font-bold">Lvl {skill.level}</div>
            <div className="h-2 bg-gray-700 mt-1">
              <div 
                className="h-full bg-green-500"
                style={{ 
                  width: `${(skill.experience % 100)}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 