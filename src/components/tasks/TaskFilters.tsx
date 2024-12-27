import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { TaskStatus, TaskPriority } from '../../types/task';
import { useProgressStore } from '../../store/progressStore';

export function TaskFilters() {
  const { filters, setFilters, clearFilters } = useTaskStore();
  const skills = useProgressStore(state => state.skills);

  const statuses: TaskStatus[] = ['todo', 'in_progress', 'completed', 'archived'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high'];

  const handleStatusChange = (status: TaskStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    setFilters({ ...filters, status: newStatuses });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap gap-4">
        {/* Status filters */}
        <div>
          <h3 className="text-sm font-pixel mb-2">Status</h3>
          <div className="flex gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1 rounded-full text-xs font-pixel transition-colors
                  ${filters.status?.includes(status)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Priority filters */}
        <div>
          <h3 className="text-sm font-pixel mb-2">Priority</h3>
          <div className="flex gap-2">
            {priorities.map(priority => (
              <button
                key={priority}
                onClick={() => {
                  const currentPriorities = filters.priority || [];
                  setFilters({
                    ...filters,
                    priority: currentPriorities.includes(priority)
                      ? currentPriorities.filter(p => p !== priority)
                      : [...currentPriorities, priority]
                  });
                }}
                className={`px-3 py-1 rounded-full text-xs font-pixel transition-colors
                  ${filters.priority?.includes(priority)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Skill filters */}
        <div>
          <h3 className="text-sm font-pixel mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <button
                key={skill.id}
                onClick={() => {
                  const currentSkills = filters.skills || [];
                  setFilters({
                    ...filters,
                    skills: currentSkills.includes(skill.id)
                      ? currentSkills.filter(id => id !== skill.id)
                      : [...currentSkills, skill.id]
                  });
                }}
                className={`px-3 py-1 rounded-full text-xs font-pixel transition-colors
                  ${filters.skills?.includes(skill.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-pixel text-red-600 hover:text-red-700"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
} 