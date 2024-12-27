import React, { useState, useEffect } from 'react';
import { useLifeCycleStore } from '../store/lifeCycleStore';
import { CycleCategory, TimeOfDay } from '../types/lifecycle';
import { PixelatedProgressBar } from '../components/ui/PixelatedProgressBar';
import { PassiveAccumulator } from '../components/lifecycle/PassiveAccumulator';

export function LifeCyclePage() {
  const [selectedCategory, setSelectedCategory] = useState<CycleCategory>('survival');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const { activities, completedActivities, completeActivity, checkStreak, getActiveBuffs } = useLifeCycleStore();

  // Update time of day automatically
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 22) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const activeBuffs = getActiveBuffs();
  const categoryActivities = activities.filter(a => a.category === selectedCategory);

  return (
    <div className="p-4 h-full bg-gray-900">
      {/* Header with Active Buffs */}
      <div className="mb-6">
        <h1 className="font-pixel text-2xl text-white mb-2">LIFE CYCLE</h1>
        <div className="h-1 bg-green-500 w-20 mb-4" />
        <div className="flex gap-4 text-sm">
          {activeBuffs.energyRestore > 0 && (
            <div className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded font-pixel">
              ⚡ +{activeBuffs.energyRestore} ENERGY
            </div>
          )}
          {activeBuffs.focusBoost > 1 && (
            <div className="px-3 py-1 bg-blue-900 text-blue-300 rounded font-pixel">
              🎯 {Math.round((activeBuffs.focusBoost - 1) * 100)}% FOCUS
            </div>
          )}
          {activeBuffs.skillMultiplier > 1 && (
            <div className="px-3 py-1 bg-purple-900 text-purple-300 rounded font-pixel">
              ✨ {Math.round((activeBuffs.skillMultiplier - 1) * 100)}% XP
            </div>
          )}
        </div>
      </div>

      {/* Passive Accumulator */}
      <PassiveAccumulator />

      {/* Time of Day Indicator */}
      <div className="mb-6 bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="font-pixel text-gray-400">CURRENT CYCLE</div>
          <div className="px-3 py-1 bg-gray-700 text-white rounded font-pixel">
            {getTimeEmoji(timeOfDay)} {timeOfDay.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {(['survival', 'maintenance', 'growth', 'creation'] as const).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              p-4 rounded-lg font-pixel text-center transition-all
              ${selectedCategory === category 
                ? getCategoryStyle(category)
                : 'bg-gray-800 hover:bg-gray-700 text-gray-400'}
            `}
          >
            {getCategoryEmoji(category)}
            <div className="mt-2">{category.toUpperCase()}</div>
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryActivities.map(activity => {
          const completion = completedActivities[activity.id];
          const streak = checkStreak(activity.id);
          const isAvailable = !completion?.lastCompleted || 
            new Date().getTime() - new Date(completion.lastCompleted).getTime() >= 
            getFrequencyHours(activity.frequency) * 3600000;

          return (
            <div 
              key={activity.id}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${isAvailable 
                  ? 'bg-gray-800 border-gray-700 hover:border-green-500 cursor-pointer'
                  : 'bg-gray-800 border-gray-600 opacity-50'}
              `}
              onClick={() => isAvailable && completeActivity(activity.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-pixel text-white">{activity.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded font-pixel text-gray-300">
                      {activity.frequency.toUpperCase()}
                    </span>
                    <span className={`
                      text-xs px-2 py-1 rounded font-pixel
                      ${getEnergyColor(activity.energyImpact)}
                    `}>
                      {activity.energyImpact.toUpperCase()}
                    </span>
                  </div>
                </div>
                {streak > 0 && (
                  <div className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded font-pixel text-sm">
                    🔥 {streak}
                  </div>
                )}
              </div>

              {/* Requirements */}
              {activity.requirements && (
                <div className="mb-3 space-y-1">
                  {activity.requirements.energy && (
                    <div className="text-sm text-gray-400">
                      Requires {activity.requirements.energy} Energy
                    </div>
                  )}
                  {activity.requirements.timeOfDay && (
                    <div className="text-sm text-gray-400">
                      Best during: {activity.requirements.timeOfDay.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Rewards */}
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs font-pixel">
                  +{activity.baseXP} XP
                </div>
                {activity.buffs?.energyRestore && (
                  <div className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded text-xs font-pixel">
                    +{activity.buffs.energyRestore} ENERGY
                  </div>
                )}
                {activity.buffs?.focusBoost && (
                  <div className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs font-pixel">
                    +{Math.round((activity.buffs.focusBoost - 1) * 100)}% FOCUS
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getTimeEmoji(time: TimeOfDay): string {
  switch (time) {
    case 'morning': return '🌅';
    case 'afternoon': return '☀️';
    case 'evening': return '🌆';
    case 'night': return '🌙';
  }
}

function getCategoryEmoji(category: CycleCategory): string {
  switch (category) {
    case 'survival': return '❤️';
    case 'maintenance': return '🔧';
    case 'growth': return '📚';
    case 'creation': return '🎨';
  }
}

function getCategoryStyle(category: CycleCategory): string {
  switch (category) {
    case 'survival': return 'bg-red-900 text-red-100';
    case 'maintenance': return 'bg-blue-900 text-blue-100';
    case 'growth': return 'bg-green-900 text-green-100';
    case 'creation': return 'bg-purple-900 text-purple-100';
  }
}

function getEnergyColor(impact: 'low' | 'medium' | 'high'): string {
  switch (impact) {
    case 'low': return 'bg-green-900 text-green-300';
    case 'medium': return 'bg-yellow-900 text-yellow-300';
    case 'high': return 'bg-red-900 text-red-300';
  }
}

function getFrequencyHours(frequency: string): number {
  switch (frequency) {
    case 'daily': return 24;
    case 'weekly': return 168;
    case 'monthly': return 720;
    default: return 0;
  }
} 