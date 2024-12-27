import { SustainabilityProject } from '../types/sustainability/projects';
import { WeatherCondition } from '../types/weather';
import { MoonPhase } from '../types/moon';
import { Season } from '../types/core';

interface DependencyCheck {
  met: boolean;
  missing: {
    projects?: string[];
    resources?: string[];
    skills?: string[];
    infrastructure?: string[];
    conditions?: string[];
  };
  readiness: number; // 0-1 scale
}

export function checkProjectDependencies(
  projectId: string,
  projects: Record<string, SustainabilityProject>,
  state: {
    completedProjects: string[];
    resources: Record<string, number>;
    skills: Record<string, number>;
    infrastructure: string[];
    currentSeason: Season;
    weather: WeatherCondition;
    moonPhase: MoonPhase;
  }
): DependencyCheck {
  const project = projects[projectId];
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  const missing: DependencyCheck['missing'] = {};
  let readinessScore = 0;
  let totalRequirements = 0;

  // Check project dependencies
  if (project.dependencies.projects?.length) {
    const missingProjects = project.dependencies.projects.filter(
      dep => !state.completedProjects.includes(dep)
    );
    if (missingProjects.length) {
      missing.projects = missingProjects;
    }
    readinessScore += state.completedProjects.length / project.dependencies.projects.length;
    totalRequirements++;
  }

  // Check resource requirements
  const missingResources: string[] = [];
  Object.entries(project.dependencies.resources).forEach(([resource, amount]) => {
    if (!state.resources[resource] || state.resources[resource] < amount) {
      missingResources.push(resource);
    }
  });
  if (missingResources.length) {
    missing.resources = missingResources;
  }
  readinessScore += (Object.keys(project.dependencies.resources).length - missingResources.length) 
                    / Object.keys(project.dependencies.resources).length;
  totalRequirements++;

  // Similar checks for skills, infrastructure, and conditions...

  return {
    met: Object.keys(missing).length === 0,
    missing,
    readiness: readinessScore / totalRequirements
  };
} 