import { HomesteadTask } from '../../types/homestead';

export const HOMESTEAD_TASKS: HomesteadTask[] = [
  // Daily Tasks
  {
    id: 'daily_fire_tending',
    type: 'DAILY',
    title: 'Tend the Fire',
    description: 'Maintain a fire throughout the day using proper techniques',
    skillType: 'FIRE_MAKING',
    xpReward: 50,
    resourceRewards: [
      {
        type: 'FIREWOOD',
        amount: 5
      }
    ],
    streak: 0,
    streakBonus: 1.1
  },
  {
    id: 'daily_foraging',
    type: 'DAILY',
    title: 'Local Foraging',
    description: 'Gather edible and medicinal plants from your local area',
    skillType: 'FORAGING',
    xpReward: 75,
    resourceRewards: [
      {
        type: 'HERBS',
        amount: 3
      },
      {
        type: 'MUSHROOMS',
        amount: 2
      }
    ],
    streak: 0,
    streakBonus: 1.2
  },

  // Weekly Tasks
  {
    id: 'weekly_preservation',
    type: 'WEEKLY',
    title: 'Food Preservation',
    description: 'Preserve meats and organs using traditional methods',
    skillType: 'PRESERVATION',
    xpReward: 300,
    resourceRewards: [
      {
        type: 'PRESERVED_FOODS',
        amount: 10
      }
    ],
    requirements: {
      skills: [
        {
          type: 'PRESERVATION',
          level: 2
        }
      ],
      resources: [
        {
          type: 'MEAT',
          amount: 5
        },
        {
          type: 'ORGANS',
          amount: 2
        }
      ]
    },
    streak: 0,
    streakBonus: 1.3
  },

  // Monthly Tasks
  {
    id: 'monthly_tool_maintenance',
    type: 'MONTHLY',
    title: 'Tool Crafting & Maintenance',
    description: 'Craft or maintain essential tools for homesteading',
    skillType: 'TOOL_MAKING',
    xpReward: 1000,
    resourceRewards: [
      {
        type: 'TOOLS',
        amount: 2
      }
    ],
    requirements: {
      skills: [
        {
          type: 'TOOL_MAKING',
          level: 3
        }
      ]
    },
    streak: 0,
    streakBonus: 1.5
  }
];

export const HOMESTEAD_PROJECTS: HomesteadProject[] = [
  {
    id: 'smokehouse_build',
    name: 'Build a Smokehouse',
    description: 'Construct a traditional smokehouse for meat preservation',
    duration: 14,
    requiredSkills: [
      {
        type: 'SHELTER_BUILDING',
        level: 5
      },
      {
        type: 'TOOL_MAKING',
        level: 3
      }
    ],
    requiredResources: [
      {
        type: 'TOOLS',
        amount: 5
      },
      {
        type: 'FIREWOOD',
        amount: 50
      }
    ],
    rewards: {
      xp: 2000,
      resources: [
        {
          type: 'PRESERVED_FOODS',
          amount: 50
        }
      ],
      unlocks: [
        {
          type: 'STORAGE',
          name: 'Smokehouse',
          description: 'Unlock advanced meat preservation techniques',
          resourceBonus: 2,
          efficiencyBonus: 1.5
        }
      ]
    },
    steps: [
      {
        description: 'Prepare the foundation',
        duration: 2,
        skillType: 'SHELTER_BUILDING'
      },
      {
        description: 'Construct the frame',
        duration: 5,
        skillType: 'SHELTER_BUILDING'
      },
      {
        description: 'Install smoke ventilation',
        duration: 3,
        skillType: 'TOOL_MAKING'
      },
      {
        description: 'Test and adjust airflow',
        duration: 4,
        skillType: 'FIRE_MAKING'
      }
    ]
  }
]; 