import React, { useState } from 'react';
import { HomesteadProject } from '../../types/homestead';

interface ProjectCardProps {
  project: HomesteadProject;
  onUpdateProgress: (projectId: string, stepIndex: number) => void;
}

export function ProjectCard({ project, onUpdateProgress }: ProjectCardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepComplete = () => {
    onUpdateProgress(project.id, currentStep);
    setCurrentStep(prev => prev + 1);
  };

  const progress = (currentStep / project.steps.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
        <p className="text-gray-600 text-sm">{project.description}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {currentStep < project.steps.length && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Current Step</h4>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm">{project.steps[currentStep].description}</p>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{project.steps[currentStep].skillType}</span>
              <span>{project.steps[currentStep].duration} days</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {project.rewards.resources.map(reward => (
          <div key={reward.type} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
            +{reward.amount} {reward.type}
          </div>
        ))}
      </div>

      {currentStep < project.steps.length && (
        <button
          onClick={handleStepComplete}
          className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Complete Step
        </button>
      )}
    </div>
  );
} 