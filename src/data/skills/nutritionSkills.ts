import { NutritionSkill } from '../../types/skills/nutrition';

export const NUTRITION_SKILLS: NutritionSkill[] = [
  {
    id: 'PRIMAL_DIGESTION',
    name: 'Primal Digestion',
    description: 'Enhance your ability to extract nutrients from animal foods',
    maxLevel: 5,
    requirements: {
      level: 1,
      achievements: ['carnivore_initiate']
    },
    bonuses: {
      1: [
        {
          type: 'MULTIPLIER',
          target: 'XP',
          value: 1.1,
          description: 'Gain 10% more XP from animal foods'
        }
      ],
      3: [
        {
          type: 'UNLOCK',
          target: 'ABILITY',
          value: 1,
          description: 'Unlock Raw Meat Digestion'
        }
      ],
      5: [
        {
          type: 'MULTIPLIER',
          target: 'FORCE',
          value: 1.2,
          description: 'Gain 20% more Force from all animal foods'
        }
      ]
    }
  },
  {
    id: 'RAW_MASTERY',
    name: 'Raw Mastery',
    description: 'Master the consumption and utilization of raw animal foods',
    maxLevel: 5,
    requirements: {
      level: 10,
      prerequisites: ['PRIMAL_DIGESTION'],
      achievements: ['raw_primal']
    },
    bonuses: {
      1: [
        {
          type: 'MULTIPLIER',
          target: 'XP',
          value: 1.2,
          description: 'Gain 20% more XP from raw animal foods'
        }
      ],
      3: [
        {
          type: 'UNLOCK',
          target: 'ABILITY',
          value: 1,
          description: 'Unlock Raw Organ Digestion'
        }
      ],
      5: [
        {
          type: 'MULTIPLIER',
          target: 'FORCE',
          value: 1.5,
          description: 'Gain 50% more Force from raw animal foods'
        }
      ]
    }
  },
  {
    id: 'ORGAN_MASTERY',
    name: 'Organ Mastery',
    description: 'Maximize benefits from organ meat consumption',
    maxLevel: 5,
    requirements: {
      level: 15,
      prerequisites: ['RAW_MASTERY'],
      achievements: ['organ_master']
    },
    bonuses: {
      1: [
        {
          type: 'MULTIPLIER',
          target: 'XP',
          value: 1.3,
          description: 'Gain 30% more XP from organ meats'
        }
      ],
      3: [
        {
          type: 'UNLOCK',
          target: 'ABILITY',
          value: 1,
          description: 'Unlock Organ Synergy'
        }
      ],
      5: [
        {
          type: 'MULTIPLIER',
          target: 'FORCE',
          value: 2.0,
          description: 'Gain 100% more Force from organ meats'
        }
      ]
    }
  },
  {
    id: 'KETONE_ADAPTATION',
    name: 'Ketone Adaptation',
    description: 'Enhance your body\'s ability to utilize ketones for energy',
    maxLevel: 5,
    requirements: {
      level: 20,
      prerequisites: ['PRIMAL_DIGESTION'],
      achievements: ['carnivore_master']
    },
    bonuses: {
      1: [
        {
          type: 'FLAT',
          target: 'RECOVERY',
          value: 10,
          description: 'Increase recovery rate by 10%'
        }
      ],
      5: [
        {
          type: 'UNLOCK',
          target: 'ABILITY',
          value: 1,
          description: 'Unlock Ketone Surge'
        }
      ]
    }
  },
  {
    id: 'ANCESTRAL_WISDOM',
    name: 'Ancestral Wisdom',
    description: 'Unlock ancient knowledge of optimal carnivorous nutrition',
    maxLevel: 3,
    requirements: {
      level: 30,
      prerequisites: ['ORGAN_MASTERY', 'KETONE_ADAPTATION']
    },
    bonuses: {
      1: [
        {
          type: 'MULTIPLIER',
          target: 'XP',
          value: 1.5,
          description: 'Gain 50% more XP from all food sources'
        }
      ],
      3: [
        {
          type: 'UNLOCK',
          target: 'ABILITY',
          value: 1,
          description: 'Unlock Primal Feast Ritual'
        },
        {
          type: 'MULTIPLIER',
          target: 'FORCE',
          value: 3.0,
          description: 'Triple Force gains from perfect carnivore days'
        }
      ]
    }
  }
]; 