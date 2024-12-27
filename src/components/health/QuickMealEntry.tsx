import React, { useState } from 'react';
import { Food, FoodCategory } from '../../types/health/nutrition';

interface QuickMealEntryProps {
  onMealLogged: (foods: Array<{ food: Food; servings: number }>) => void;
}

export function QuickMealEntry({ onMealLogged }: QuickMealEntryProps) {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [selectedFoods, setSelectedFoods] = useState<Array<{ food: Food; servings: number }>>([]);

  return (
    <div className="fixed bottom-4 right-4">
      <div className="relative">
        {/* Main button */}
        <button 
          className="bg-green-500 text-white rounded-full p-4 shadow-lg"
          onClick={() => setSelectedCategory(null)}
        >
          Quick Add Meal
        </button>

        {/* Category wheel */}
        {selectedCategory === null && (
          <div className="absolute bottom-full right-0 mb-4 flex flex-wrap gap-2 max-w-md">
            {Object.values(FoodCategory).map(category => (
              <button
                key={category}
                className="bg-white rounded-full px-4 py-2 shadow"
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryIcon(category)} {formatCategory(category)}
              </button>
            ))}
          </div>
        )}

        {/* Food selection */}
        {selectedCategory && (
          <div className="absolute bottom-full right-0 mb-4 bg-white rounded-lg shadow-xl p-4">
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {getFoodsByCategory(selectedCategory).map(food => (
                <button
                  key={food.id}
                  className="text-left p-2 hover:bg-gray-50 rounded"
                  onClick={() => {
                    setSelectedFoods(prev => [...prev, { food, servings: 1 }]);
                  }}
                >
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-gray-500">
                    {food.servingSize}{food.servingUnit} | {food.quality}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 