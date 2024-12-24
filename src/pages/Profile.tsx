import { useStore } from '../store';
import { useProgressStore } from '../store/progressStore';
import { useResourceStore } from '../store/resourceStore';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Profile() {
  const user = useStore((state) => state.user);
  const { skills } = useProgressStore();
  const { dailyStats } = useResourceStore();

  if (!user) return null;

  // Calculate total experience needed for next level (example formula)
  const expForNextLevel = Math.pow(user.level, 2) * 100;
  const progressToNextLevel = (user.experience / expForNextLevel) * 100;

  // Get recent stats
  const recentStats = dailyStats.slice(-7).reverse();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-8">
          <div className="w-32">
            <CircularProgressbar
              value={progressToNextLevel}
              text={`Level ${user.level}`}
              styles={buildStyles({
                pathColor: '#3B82F6',
                textColor: '#1F2937',
                trailColor: '#E5E7EB',
              })}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
            <div className="text-gray-600">
              Experience: {user.experience} / {expForNextLevel}
            </div>
            <div className="text-gray-600">
              Energy: {user.energy} / {user.maxEnergy}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">{skill.name}</h3>
              <div className="h-2 bg-gray-200 rounded mb-2">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{
                    width: `${(skill.experience / skill.maxExperience) * 100}%`,
                  }}
                />
              </div>
              <div className="text-sm text-gray-600">
                Level {skill.level} - {skill.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {recentStats.map((stat) => (
              <div key={stat.id} className="flex justify-between items-center">
                <div className="text-gray-600">
                  {format(new Date(stat.date), 'MMM d, yyyy')}
                </div>
                <div className="flex gap-8">
                  <div>
                    <span className="font-medium">{stat.totalTasksCompleted}</span>{' '}
                    tasks
                  </div>
                  <div>
                    <span className="font-medium">
                      {stat.totalExperienceGained}
                    </span>{' '}
                    XP
                  </div>
                  <div>
                    <span className="font-medium">{stat.energySpent}</span> energy
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 