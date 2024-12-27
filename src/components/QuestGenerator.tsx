import { useGameStore } from '../store/gameStore';

export const QuestGenerator = () => {
  const { currentUser, users } = useGameStore();

  if (!currentUser || !users[currentUser]) return null;

  const userData = users[currentUser].data;

  return (
    <div className="quests">
      <h2>Daily Quests</h2>
      {userData.skills.map(skill => (
        <div key={skill.id} className="quest-card">
          <p>Practice {skill.name} for 30 minutes</p>
          <button>Complete</button>
        </div>
      ))}
    </div>
  );
}; 