import React from 'react';
import { useFarmStore } from '../../store/farmStore';
import { ResourceType } from '../../types/homestead';
import { PixelatedProgressBar } from '../ui/PixelatedProgressBar';

export function ResourceTracker() {
  const { resources, getResourceCapacity } = useFarmStore();

  const resourceCategories = {
    'PRODUCTION': ['MEAT', 'ORGANS', 'EGGS', 'VEGETABLES', 'FRUITS'],
    'MATERIALS': ['BONES', 'FAT', 'HERBS', 'FIREWOOD', 'COMPOST'],
    'PROCESSED': ['PRESERVED_FOODS', 'FERMENTED_FOODS', 'TOOLS']
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="font-pixel text-white mb-4">RESOURCES</h2>

      {Object.entries(resourceCategories).map(([category, types]) => (
        <div key={category} className="mb-4">
          <h3 className="text-gray-400 font-pixel text-sm mb-2">{category}</h3>
          <div className="space-y-2">
            {types.map((type) => (
              <ResourceItem 
                key={type} 
                type={type as ResourceType} 
                amount={resources[type] || 0}
                capacity={getResourceCapacity(type as ResourceType)}
              />
            ))}
          </div>
        </div>
      ))}

      <button 
        className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 
                   text-white rounded font-pixel text-sm"
      >
        MANAGE STORAGE
      </button>
    </div>
  );
}

function ResourceItem({ 
  type, 
  amount, 
  capacity 
}: { 
  type: ResourceType; 
  amount: number; 
  capacity: number;
}) {
  const getResourceIcon = (type: ResourceType): string => {
    const icons: Record<ResourceType, string> = {
      'MEAT': '🥩',
      'ORGANS': '🫀',
      'BONES': '🦴',
      'FAT': '🥓',
      'HERBS': '🌿',
      'MUSHROOMS': '🍄',
      'FIREWOOD': '🪵',
      'WATER': '💧',
      'COMPOST': '♻️',
      'TOOLS': '🔧',
      'PRESERVED_FOODS': '🥫',
      'FERMENTED_FOODS': '🫂',
      'EGGS': '🥚',
      'VEGETABLES': '🥕',
      'FRUITS': '🍎'
    };
    return icons[type] || '📦';
  };

  return (
    <div className="bg-gray-700 rounded p-2">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span>{getResourceIcon(type)}</span>
          <span className="font-pixel text-sm text-gray-300">
            {type.replace('_', ' ')}
          </span>
        </div>
        <span className="font-pixel text-sm text-gray-400">
          {amount}/{capacity}
        </span>
      </div>
      <PixelatedProgressBar
        progress={amount / capacity}
        color={amount > capacity * 0.8 ? '#EF4444' : '#10B981'}
        showPixels
      />
    </div>
  );
} 