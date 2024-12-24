import { useQuestStore } from '../store/questStore';

export default function Quests() {
  const quests = useQuestStore((state) => state.quests);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quests</h1>
      <div className="grid gap-6">
        {quests.map((quest) => (
          <div key={quest.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{quest.title}</h2>
            <p className="text-gray-600 mb-4">{quest.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Difficulty: {quest.difficulty}
              </span>
              <span className="text-sm text-gray-500">
                XP Reward: {quest.experienceReward}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 