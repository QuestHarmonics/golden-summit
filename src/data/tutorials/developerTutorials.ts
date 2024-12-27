import { Tutorial } from '../../types/tutorial';

export const developerTutorials: Record<string, Tutorial> = {
  'dev-setup': {
    id: 'dev-setup',
    title: 'Developer Environment Setup',
    description: 'Set up your development environment for Golden Summit',
    scope: 'developer',
    prerequisites: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'repo-setup',
        title: 'Repository Setup',
        content: 'Clone the repository and install dependencies using `npm install`',
        trigger: 'manual',
        hint: 'Make sure you have Node.js and Git installed.'
      },
      {
        id: 'env-setup',
        title: 'Environment Configuration',
        content: 'Copy `.env.example` to `.env` and configure your environment variables.',
        trigger: 'manual'
      },
      {
        id: 'dev-server',
        title: 'Start Development Server',
        content: 'Run `npm run dev` to start the development server.',
        trigger: 'manual'
      }
    ],
    rewards: {
      xp: 200,
      skills: { 'development': 100 }
    }
  },
  'feature-development': {
    id: 'feature-development',
    title: 'Adding New Features',
    description: 'Learn how to add new features to Golden Summit',
    scope: 'developer',
    prerequisites: ['dev-setup'],
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'create-branch',
        title: 'Create Feature Branch',
        content: 'Create a new branch for your feature: `git checkout -b feature/your-feature`',
        trigger: 'manual'
      },
      {
        id: 'implement-types',
        title: 'Define Types',
        content: 'Start by defining types in the appropriate types directory.',
        trigger: 'manual',
        hint: 'Follow the existing type patterns and extend core types when possible.'
      },
      {
        id: 'create-store',
        title: 'Implement Store',
        content: 'Create a store using the baseStore pattern if needed.',
        trigger: 'manual',
        hint: 'Use the createBaseStore helper for consistent store implementation.'
      }
    ],
    rewards: {
      xp: 300,
      skills: { 
        'development': 150,
        'architecture': 100
      }
    }
  }
}; 