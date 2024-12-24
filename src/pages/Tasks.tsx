import { useTimeManagementStore } from '../store/timeManagementStore';

export default function Tasks() {
  const { tasks, updateTask } = useTimeManagementStore();

  const tasksByStatus = tasks.reduce((acc, task) => {
    acc[task.status] = [...(acc[task.status] || []), task];
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Todo Column */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">To Do</h2>
          {tasksByStatus['TODO']?.map((task) => (
            <div
              key={task.id}
              className="mb-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => updateTask(task.id, { status: 'IN_PROGRESS' })}
            >
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>Energy: {task.energyCost}</span>
                <span className={`px-2 py-1 rounded ${
                  task.priority === 'HIGH' 
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* In Progress Column */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">In Progress</h2>
          {tasksByStatus['IN_PROGRESS']?.map((task) => (
            <div
              key={task.id}
              className="mb-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => updateTask(task.id, { status: 'COMPLETED' })}
            >
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>Energy: {task.energyCost}</span>
                <span className={`px-2 py-1 rounded ${
                  task.priority === 'HIGH' 
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Column */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Completed</h2>
          {tasksByStatus['COMPLETED']?.map((task) => (
            <div
              key={task.id}
              className="mb-4 p-4 bg-gray-50 rounded-lg opacity-75"
            >
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>Energy: {task.energyCost}</span>
                <span className={`px-2 py-1 rounded ${
                  task.priority === 'HIGH' 
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 