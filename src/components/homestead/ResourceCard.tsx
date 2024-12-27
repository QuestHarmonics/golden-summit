import React from 'react';
import { ResourceType } from '../../types/homestead';

interface ResourceCardProps {
  type: ResourceType;
  amount: number;
}

export function ResourceCard({ type, amount }: ResourceCardProps) {
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'MEAT': return '🥩';
      case 'ORGANS': return '🫀';
      case 'BONES': return '🦴';
      case 'FAT': return '🥓';
      case 'HERBS': return '🌿';
      case 'MUSHROOMS': return '🍄';
      case 'FIREWOOD': return '🪵';
      case 'WATER': return '💧';
      case 'COMPOST': return '🌱';
      case 'TOOLS': return '🔨';
      case 'PRESERVED_FOODS': return '🥫';
      case 'FERMENTED_FOODS': return '🫂';
      default: return '📦';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getResourceIcon(type)}</span>
        <div>
          <h3 className="font-medium text-gray-900">
            {type.split('_').map(word => 
              word.charAt(0) + word.slice(1).toLowerCase()
            ).join(' ')}
          </h3>
          <p className="text-gray-600">{amount}</p>
        </div>
      </div>
    </div>
  );
} 