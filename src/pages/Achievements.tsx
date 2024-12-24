import { useProgressStore } from '../store/progressStore';
import { format } from 'date-fns';

export default function Achievements() {
  const { achievements } = useProgressStore();

  // Group achievements by category
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    acc[achievement.category] = acc[achievement.category] || [];
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, typeof achievements>);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Achievements</h1>
      
      {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-white p-6 rounded-lg shadow transition-all
                  ${achievement.isUnlocked
                    ? 'border-2 border-yellow-400'
                    : 'opacity-75 grayscale'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={achievement.icon}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {achievement.description}
                    </p>
                    {achievement.isUnlocked && achievement.unlockedAt && (
                      <div className="text-sm text-gray-500">
                        Unlocked: {format(new Date(achievement.unlockedAt), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 