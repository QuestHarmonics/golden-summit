import { DailyQuestTracker } from '../components/DailyQuestTracker';

export function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to Golden Summit</h1>
      <p>Your journey to self-improvement begins here.</p>
      <DailyQuestTracker />
    </div>
  );
} 