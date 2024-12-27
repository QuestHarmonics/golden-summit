import React from 'react';
import { useFarmStore } from '../../store/farmStore';
import { PixelatedProgressBar } from '../ui/PixelatedProgressBar';

export function FarmDashboard() {
  const { capital, projectedCashFlow } = useFarmStore();

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Capital Overview */}
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="font-pixel text-gray-400 text-sm">CAPITAL</h3>
          <p className="text-green-400 font-pixel text-xl">${capital}</p>
        </div>

        {/* Monthly Projection */}
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="font-pixel text-gray-400 text-sm">MONTHLY PROJECTION</h3>
          <p className={`font-pixel text-xl ${
            projectedCashFlow.monthly.total >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${Math.abs(projectedCashFlow.monthly.total)}
          </p>
        </div>

        {/* Active Projects */}
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="font-pixel text-gray-400 text-sm">ACTIVE PROJECTS</h3>
          <p className="text-blue-400 font-pixel text-xl">
            {Object.values(useFarmStore.getState().infrastructure)
              .filter(i => i.status === 'in-progress').length}
          </p>
        </div>

        {/* Sustainability Score */}
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="font-pixel text-gray-400 text-sm">SUSTAINABILITY</h3>
          <PixelatedProgressBar
            progress={0.75}
            color="#10B981"
            showPixels
          />
        </div>
      </div>
    </div>
  );
} 