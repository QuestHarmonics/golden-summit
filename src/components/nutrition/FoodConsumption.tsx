import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { FOOD_ITEMS, FoodCategory } from '../../types/nutrition';
import { PixelatedProgressBar } from '../ui/PixelatedProgressBar';

export function FoodConsumption() {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('protein');
  const { consumeFood, energy, maxEnergy, activeBuffs } = useGameStore();

  const categoryFoods = FOOD_ITEMS.filter(food => food.category === selectedCategory);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Category Selection */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(['protein', 'carbs', 'vegetables', 'fruits', 'snacks'] as const).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-lg font-pixel whitespace-nowrap
              ${selectedCategory === category 
                ? getFoodCategoryStyle(category)
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}
            `}
          >
            {getFoodEmoji(category)} {category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryFoods.map(food => (
          <button
            key={food.id}
            onClick={() => consumeFood(food)}
            className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-pixel text-white">{food.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className={`
                    text-xs px-2 py-1 rounded font-pixel
                    ${getEnergyTypeStyle(food.energyType)}
                  `}>
                    {food.energyType.toUpperCase()}
                  </span>
                  <span className="text-xs px-2 py-1 bg-yellow-900 text-yellow-300 rounded font-pixel">
                    +{food.energyValue} ENERGY
                  </span>
                </div>
              </div>
            </div>

            {/* Regeneration Info */}
            {food.regenerationRate && food.regenerationDuration && (
              <div className="mb-2 text-sm">
                <div className="text-green-400 font-pixel">
                  +{food.regenerationRate}/min for {food.regenerationDuration / 60}h
                </div>
              </div>
            )}

            {/* Buffs */}
            {food.buffs && (
              <div className="flex flex-wrap gap-2">
                {food.buffs.focusBoost && (
                  <span className="text-xs px-2 py-1 bg-blue-900 text-blue-300 rounded font-pixel">
                    +{Math.round((food.buffs.focusBoost - 1) * 100)}% FOCUS
                  </span>
                )}
                {food.buffs.skillMultiplier && (
                  <span className="text-xs px-2 py-1 bg-purple-900 text-purple-300 rounded font-pixel">
                    +{Math.round((food.buffs.skillMultiplier - 1) * 100)}% XP
                  </span>
                )}
                {food.buffs.energyEfficiency && (
                  <span className="text-xs px-2 py-1 bg-indigo-900 text-indigo-300 rounded font-pixel">
                    +{Math.round((food.buffs.energyEfficiency - 1) * 100)}% EFFICIENCY
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function getFoodEmoji(category: FoodCategory): string {
  switch (category) {
    case 'protein': return '🥩';
    case 'carbs': return '🍚';
    case 'vegetables': return '🥗';
    case 'fruits': return '🍎';
    case 'snacks': return '🍫';
  }
}

function getFoodCategoryStyle(category: FoodCategory): string {
  switch (category) {
    case 'protein': return 'bg-red-900 text-red-100';
    case 'carbs': return 'bg-yellow-900 text-yellow-100';
    case 'vegetables': return 'bg-green-900 text-green-100';
    case 'fruits': return 'bg-orange-900 text-orange-100';
    case 'snacks': return 'bg-purple-900 text-purple-100';
  }
}

function getEnergyTypeStyle(type: string): string {
  switch (type) {
    case 'instant': return 'bg-green-900 text-green-300';
    case 'sustained': return 'bg-blue-900 text-blue-300';
    case 'boost': return 'bg-purple-900 text-purple-300';
    default: return 'bg-gray-900 text-gray-300';
  }
} 