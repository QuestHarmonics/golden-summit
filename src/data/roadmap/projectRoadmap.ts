import { Entity } from '../types/core';

export interface RoadmapItem extends Entity {
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 1 | 2 | 3; // 1 highest, 3 lowest
  dependencies: string[];
  estimatedHours: number;
  completedAt?: Date;
}

export const projectRoadmap: Record<string, RoadmapItem> = {
  // Core Systems
  'core-setup': {
    id: 'core-setup',
    title: 'Core System Setup',
    status: 'completed', // Since you have basic structure
    priority: 1,
    dependencies: [],
    estimatedHours: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Authentication & User Management
  'auth-system': {
    id: 'auth-system',
    title: 'Authentication System',
    status: 'pending',
    priority: 1,
    dependencies: ['core-setup'],
    estimatedHours: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Progress Systems
  'progress-system': {
    id: 'progress-system',
    title: 'Progress & XP System',
    status: 'in-progress',
    priority: 1,
    dependencies: ['core-setup'],
    estimatedHours: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Task Management
  'task-system': {
    id: 'task-system',
    title: 'Task Management',
    status: 'in-progress',
    priority: 1,
    dependencies: ['progress-system'],
    estimatedHours: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Quest System
  'quest-system': {
    id: 'quest-system',
    title: 'Quest System',
    status: 'pending',
    priority: 2,
    dependencies: ['task-system'],
    estimatedHours: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Time Management
  'time-management': {
    id: 'time-management',
    title: 'Time Management System',
    status: 'pending',
    priority: 2,
    dependencies: ['task-system'],
    estimatedHours: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Map System
  'map-system': {
    id: 'map-system',
    title: 'Map & Location System',
    status: 'pending',
    priority: 3,
    dependencies: ['core-setup'],
    estimatedHours: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Resource Management
  'resource-system': {
    id: 'resource-system',
    title: 'Resource Management',
    status: 'pending',
    priority: 2,
    dependencies: ['progress-system'],
    estimatedHours: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Documentation
  'documentation-system': {
    id: 'documentation-system',
    title: 'Documentation System',
    status: 'pending',
    priority: 3,
    dependencies: ['core-setup'],
    estimatedHours: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Weather Integration
  'weather-integration': {
    id: 'weather-integration',
    title: 'Texas Weather Integration',
    status: 'pending',
    priority: 3,
    dependencies: ['core-setup'],
    estimatedHours: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Moon Phase Integration
  'moon-phase': {
    id: 'moon-phase',
    title: 'Moon Phase Integration',
    status: 'pending',
    priority: 3,
    dependencies: ['core-setup'],
    estimatedHours: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}; 