import React from 'react';
import { useHomesteadStore } from '../store/homesteadStore';
import { useProgressStore } from '../store/progressStore';
import { HomesteadTask, HomesteadProject } from '../types/homestead';
import { TaskCard } from '../components/homestead/TaskCard';
import { ProjectCard } from '../components/homestead/ProjectCard';
import { ResourceCard } from '../components/homestead/ResourceCard';

export function Homestead() {
  const {
    skills,
    activeTasks,
    activeProjects,
    resources,
    startTask,
    completeTask,
    startProject,
    updateProjectProgress,
    getAvailableTasks,
    getAvailableProjects
  } = useHomesteadStore();

  const homesteadProgress = useProgressStore(state => state.progress.HOMESTEAD);
  const availableTasks = getAvailableTasks();
  const availableProjects = getAvailableProjects();

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Homestead</h1>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg">Level {homesteadProgress.level}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${(homesteadProgress.xp / homesteadProgress.xpRequired) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Active Tasks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeTasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              onComplete={() => completeTask(task.id)}
            />
          ))}
        </div>
      </div>

      {/* Available Tasks */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableTasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              onStart={() => startTask(task.id)}
            />
          ))}
        </div>
      </div>

      {/* Active Projects */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {activeProjects.map(project => (
            <ProjectCard 
              key={project.id}
              project={project}
              onUpdateProgress={updateProjectProgress}
            />
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Resources</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Object.entries(resources).map(([type, amount]) => (
            <ResourceCard 
              key={type}
              type={type}
              amount={amount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Add component implementations for TaskCard, ProjectCard, and ResourceCard... 