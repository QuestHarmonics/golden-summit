import React from 'react';
import { useStore } from '../store';

export default function Homestead() {
  const { homestead } = useStore();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Homestead</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Level: {homestead.level}</h2>
        <div className="text-gray-600">
          <p>Resources:</p>
          <ul>
            {Object.entries(homestead.resources).map(([resource, amount]) => (
              <li key={resource}>
                {resource}: {amount}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 