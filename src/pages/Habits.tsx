import { useTimeManagementStore } from '../store/timeManagementStore';
import { format } from 'date-fns';

export default function Habits() {
  const { habits, updateHabitStreak } = useTimeManagementStore();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Habits</h1>
      <div className="grid gap-6">
        {habits.map((habit) => (
          <div key={habit.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{habit.name}</h2>
                <p className="text-gray-600 mb-4">{habit.description}</p>
                <div className="text-sm text-gray-500">
                  Frequency: {habit.frequency}
                </div>
              </div>
              <button
                onClick={() => updateHabitStreak(habit.id, true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Complete
              </button>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium">Current Streak:</span>{' '}
                {habit.streak} days
              </div>
              <div className="text-sm">
                <span className="font-medium">Best Streak:</span>{' '}
                {habit.bestStreak} days
              </div>
              {habit.lastCompleted && (
                <div className="text-sm text-gray-500">
                  Last completed:{' '}
                  {format(new Date(habit.lastCompleted), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 