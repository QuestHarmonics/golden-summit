import { Quest } from '../../types/quest';

export const HOMESTEAD_QUESTS: Quest[] = [
  {
    id: 'first_homestead',
    type: 'HOMESTEAD',
    title: 'Homestead Beginnings',
    description: 'Start your journey into self-sufficiency',
    requirements: {
      level: 1,
      count: 1
    },
    rewards: {
      xp: 100,
      resources: [
        { type: 'TOOLS', amount: 2 },
        { type: 'FIREWOOD', amount: 10 }
      ]
    }
  },
  {
    id: 'preservation_master',
    type: 'HOMESTEAD',
    title: 'Preservation Master',
    description: 'Complete 5 food preservation tasks',
    requirements: {
      level: 5,
      count: 5,
      skills: [
        { type: 'PRESERVATION', level: 3 }
      ]
    },
    rewards: {
      xp: 500,
      resources: [
        { type: 'PRESERVED_FOODS', amount: 20 }
      ],
      unlocks: ['advanced_preservation_techniques']
    }
  },
  {
    id: 'smokehouse_project',
    type: 'HOMESTEAD',
    title: 'Smoke Master',
    description: 'Build and complete your first smokehouse',
    requirements: {
      level: 10,
      count: 1,
      skills: [
        { type: 'SHELTER_BUILDING', level: 5 },
        { type: 'TOOL_MAKING', level: 3 }
      ],
      prerequisites: ['preservation_master']
    },
    rewards: {
      xp: 1000,
      resources: [
        { type: 'TOOLS', amount: 5 },
        { type: 'PRESERVED_FOODS', amount: 50 }
      ],
      unlocks: ['smokehouse_specialization']
    }
  }
]; 