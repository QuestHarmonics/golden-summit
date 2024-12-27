import React, { useState } from 'react';
import { useFarmStore } from '../../store/farmStore';
import { FarmProject } from '../../types/farm/development';

export function ProjectTimeline() {
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const { projects, startProject, checkProjectRequirements } = useFarmStore();

  const phases = ['planning', 'acquisition', 'infrastructure', 'planting', 'operation'];
  
  const filteredProjects = Object.values(projects).filter(
    p => selectedPhase === 'all' || p.phase === selectedPhase
  );

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-pixel text-white">PROJECT TIMELINE</h2>
        <div className="flex gap-2">
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="bg-gray-700 text-gray-300 rounded px-3 py-1 font-pixel text-sm"
          >
            <option value="all">ALL PHASES</option>
            {phases.map(phase => (
              <option key={phase} value={phase}>
                {phase.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProjects.map(project => (
          <ProjectCard 
            key={project.id}
            project={project}
            canStart={checkProjectRequirements(project.id)}
            onStart={() => startProject(project.id, 'MID')}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ 
  project, 
  canStart, 
  onStart 
}: { 
  project: FarmProject;
  canStart: boolean;
  onStart: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-pixel text-white">{project.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 
                     text-gray-300 rounded font-pixel text-sm"
          >
            {showDetails ? 'HIDE' : 'DETAILS'}
          </button>
          {canStart && (
            <button
              onClick={onStart}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 
                       text-white rounded font-pixel text-sm"
            >
              START
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-pixel text-gray-400">DURATION</h4>
              <p className="text-white">
                {project.timeline.estimatedDuration} days
              </p>
            </div>
            <div>
              <h4 className="font-pixel text-gray-400">CATEGORY</h4>
              <p className="text-white">{project.category}</p>
            </div>
          </div>

          <div>
            <h4 className="font-pixel text-gray-400">REQUIREMENTS</h4>
            <ul className="list-disc list-inside text-white">
              {project.requirements.skills.map(skill => (
                <li key={skill.type}>
                  {skill.type} (Level {skill.level})
                </li>
              ))}
            </ul>
          </div>

          {project.expectedYield && (
            <div>
              <h4 className="font-pixel text-gray-400">EXPECTED YIELD</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="text-red-300">
                  LOW: ${project.expectedYield.amount.LOW}
                </div>
                <div className="text-yellow-300">
                  MID: ${project.expectedYield.amount.MID}
                </div>
                <div className="text-green-300">
                  HIGH: ${project.expectedYield.amount.HIGH}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 