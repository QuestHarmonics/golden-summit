import React from 'react';
import { useProgressStore } from '../../store/progressStore';

export function XPGains() {
  const skills = useProgressStore(state => state.skills);

  if (skills.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">XP Gains</h3>
        <p className="text-gray-600">No skills available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">XP Gains</h3>
      <div className="space-y-4">
        {skills.map(skill => (
          <div key={skill.id} className="flex justify-between items-center">
            <span className="font-medium">{skill.name}</span>
            <span className="text-sm text-gray-600">
              {skill.baseXpRate.toFixed(1)} XP/hour
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 