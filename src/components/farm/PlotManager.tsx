import React, { useState } from 'react';
import { useFarmStore } from '../../store/farmStore';
import { PlotType } from '../../types/farm/development';

export function PlotManager() {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const { infrastructure, crops } = useFarmStore();

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="font-pixel text-white mb-4">PLOT MANAGEMENT</h2>

      {/* Plot Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Object.entries(infrastructure)
          .filter(([_, info]) => info.status === 'completed')
          .map(([id, info]) => (
            <button
              key={id}
              onClick={() => setSelectedPlot(id)}
              className={`
                aspect-square rounded-lg p-2
                ${selectedPlot === id ? 'bg-blue-900' : 'bg-gray-700'}
                hover:bg-gray-600 transition-colors
              `}
            >
              <div className="h-full flex flex-col items-center justify-center">
                {getPlotIcon(id as PlotType)}
                <span className="font-pixel text-xs text-gray-300 mt-2">
                  {id.toUpperCase()}
                </span>
                <div className="mt-1 w-full bg-gray-800 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${info.condition}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
      </div>

      {/* Plot Details */}
      {selectedPlot && (
        <div className="mt-4 bg-gray-700 rounded-lg p-4">
          <h3 className="font-pixel text-white mb-2">
            {selectedPlot.toUpperCase()} DETAILS
          </h3>
          {/* Plot-specific information and actions */}
        </div>
      )}
    </div>
  );
}

function getPlotIcon(type: PlotType): React.ReactNode {
  const icons: Record<PlotType, string> = {
    'garden': '🌱',
    'greenhouse': '🏡',
    'orchard': '🌳',
    'medicinal': '🌿',
    'composting': '♻️'
  };
  return icons[type] || '📍';
} 