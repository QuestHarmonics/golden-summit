import { Tutorial } from '../../types/tutorial';
import { userTutorials } from './userTutorials';
import { developerTutorials } from './developerTutorials';

export const tutorials: Record<string, Tutorial> = {
  ...userTutorials,
  ...developerTutorials
};

// User onboarding tutorials
export const userTutorials = {
  'getting-started': {
    id: 'getting-started',
    title: 'Welcome to Golden Summit',
    description: 'Learn the basics and start your journey',
    scope: 'user',
    prerequisites: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'welcome',
        title: 'Welcome!',
        content: 'Welcome to Golden Summit! Ready to start your journey of self-improvement?',
        trigger: 'onView'
      },
      {
        id: 'interests',
        title: 'Your Interests',
        content: 'Tell us what interests you. This helps us personalize your experience.',
        elementSelector: '#interests-section',
        trigger: 'onView',
        action: 'select-interests'
      },
      {
        id: 'first-skill',
        title: 'Choose Your Path',
        content: 'Select your first skill to develop. You can add more later!',
        elementSelector: '#skills-selection',
        trigger: 'onAction',
        action: 'select-skill'
      }
    ],
    rewards: {
      xp: 100,
      skills: { 'organization': 50 }
    }
  },
  'first-task': {
    id: 'first-task',
    title: 'Creating Your First Task',
    description: 'Learn how to create and manage tasks',
    scope: 'user',
    prerequisites: ['getting-started'],
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'create-task',
        title: 'Create a Task',
        content: 'Click the "New Task" button to create your first task.',
        elementSelector: '#new-task-button',
        trigger: 'onView'
      },
      {
        id: 'task-details',
        title: 'Task Details',
        content: 'Fill in the task details. Remember to link it to relevant skills!',
        elementSelector: '#task-form',
        trigger: 'onView'
      },
      {
        id: 'complete-task',
        title: 'Complete Your Task',
        content: 'Once you\'ve finished your task, mark it as complete to earn rewards!',
        trigger: 'onAction',
        action: 'complete-task'
      }
    ],
    rewards: {
      xp: 150,
      skills: { 'productivity': 75 }
    }
  }
}; 