import { Season } from '../core';
import { WeatherCondition } from '../weather';
import { ResourceType } from '../resources';
import { SkillType } from '../skills';

export interface TaskCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredSkills: SkillType[];
}

export const TASK_CATEGORIES = {
  WATER_SUPPLY: {
    id: 'WATER_SUPPLY',
    name: 'Water Supply',
    description: 'Water management and irrigation systems',
    icon: '💧',
    color: '#3B82F6',
    requiredSkills: ['WATER_MANAGEMENT', 'CONSTRUCTION']
  },
  FENCING: {
    id: 'FENCING',
    name: 'Fencing',
    description: 'Perimeter security and animal containment',
    icon: '🔲',
    color: '#8B5CF6',
    requiredSkills: ['CONSTRUCTION', 'PLANNING']
  },
  // ... other categories
};

export interface Task {
  id: string;
  name: string;
  description: string;
  type: 'Infrastructure' | 'Maintenance' | 'Planning';
  points: number;
  completed: boolean;
  timeEstimate: number;
}

export const INITIAL_TASKS: Task[] = [
  {
    id: 'water-1',
    name: 'Install Rainwater Collection',
    description: 'Set up basic rainwater harvesting system',
    type: 'Infrastructure',
    points: 50,
    completed: false,
    timeEstimate: 120
  },
  {
    id: 'fence-1',
    name: 'Basic Perimeter Fence',
    description: 'Install first section of perimeter fencing',
    type: 'Infrastructure',
    points: 30,
    completed: false,
    timeEstimate: 180
  },
  {
    id: 'plan-1',
    name: 'Site Planning',
    description: 'Create initial layout for infrastructure',
    type: 'Planning',
    points: 20,
    completed: false,
    timeEstimate: 60
  }
]; 