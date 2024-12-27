import { PrimalRecipe } from '../../types/nutrition/primal';

export const primalRecipes: PrimalRecipe[] = [
  {
    id: 'lubrication-formula-basic',
    name: "Basic Lubrication Formula",
    category: 'lubrication-formula',
    difficulty: 4,
    ingredients: [
      {
        name: 'raw-butter',
        quality: 'raw-dairy-grass-fed',
        state: 'room-temperature',
        amount: 2,
        unit: 'oz'
      },
      {
        name: 'raw-honey',
        quality: 'raw-honey',
        state: 'room-temperature',
        amount: 1,
        unit: 'tbsp'
      }
    ],
    preparation: [
      {
        order: 1,
        description: 'Bring butter to room temperature naturally',
        duration: 60,
        temperature: {
          min: 68,
          max: 72,
          unit: '°F',
          critical: true
        }
      },
      {
        order: 2,
        description: 'Whip butter and honey together until well combined',
        warning: 'Do not use electrical equipment - hand mix only'
      }
    ],
    benefits: [
      {
        system: 'digestive',
        description: 'Improves nutrient absorption and digestive function',
        timeToEffect: '2-3 days'
      },
      {
        system: 'immune',
        description: 'Supports natural immune function',
        timeToEffect: '1-2 weeks'
      }
    ],
    warnings: [
      'Must use completely raw ingredients',
      'Do not heat above room temperature',
      'Consume within 24 hours of preparation'
    ],
    temperature: {
      min: 65,
      max: 72,
      unit: '°F',
      critical: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'high-meat-advanced',
    name: "Advanced High Meat Preparation",
    category: 'high-meat',
    difficulty: 5,
    ingredients: [
      {
        name: 'grass-fed-beef',
        quality: 'raw-grass-fed',
        state: 'fresh',
        amount: 16,
        unit: 'oz'
      }
    ],
    preparation: [
      {
        order: 1,
        description: 'Cut meat into 1-inch cubes',
        warning: 'Use clean non-metallic cutting surface'
      }
    ],
    agingRequired: {
      duration: 168, // 7 days
      conditions: [
        {
          type: 'temperature',
          value: '65-72°F',
          critical: true
        },
        {
          type: 'container-type',
          value: 'glass jar with loose lid',
          critical: true
        },
        {
          type: 'air-exposure',
          value: 'daily opening required',
          critical: true
        }
      ]
    },
    benefits: [
      {
        system: 'immune',
        description: 'Powerful immune system enhancement',
        timeToEffect: '1-3 months'
      },
      {
        system: 'digestive',
        description: 'Enhanced protein digestion and gut flora',
        timeToEffect: '2-4 weeks'
      }
    ],
    warnings: [
      'Advanced preparation only',
      'Start with small amounts',
      'Must be properly aged',
      'Use highest quality meat only'
    ],
    temperature: {
      min: 65,
      max: 72,
      unit: '°F',
      critical: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'raw-meat-smoothie-basic',
    name: "Beginner Raw Meat Smoothie",
    category: 'raw-blend',
    difficulty: 3,
    ingredients: [
      {
        name: 'grass-fed-beef',
        quality: 'raw-grass-fed',
        state: 'fresh',
        amount: 4,
        unit: 'oz'
      },
      {
        name: 'raw-eggs',
        quality: 'raw-pastured',
        state: 'fresh',
        amount: 2,
        unit: 'pieces'
      },
      {
        name: 'raw-cream',
        quality: 'raw-dairy-grass-fed',
        state: 'fresh',
        amount: 2,
        unit: 'oz'
      }
    ],
    preparation: [
      {
        order: 1,
        description: 'Cut meat into small pieces',
        warning: 'Use clean non-metallic cutting surface'
      },
      {
        order: 2,
        description: 'Blend ingredients briefly',
        warning: 'Do not over-blend, 10-15 seconds maximum'
      }
    ],
    benefits: [
      {
        system: 'digestive',
        description: 'Optimal nutrient absorption',
        timeToEffect: '1-2 days'
      }
    ],
    temperature: {
      min: 33,
      max: 40,
      unit: '°F',
      critical: true
    }
  },
  {
    id: 'primal-liver-blend',
    name: "Advanced Organ Meat Blend",
    category: 'raw-organs',
    difficulty: 5,
    ingredients: [
      {
        name: 'grass-fed-liver',
        quality: 'raw-grass-fed',
        state: 'fresh',
        amount: 2,
        unit: 'oz'
      },
      {
        name: 'grass-fed-brain',
        quality: 'raw-grass-fed',
        state: 'fresh',
        amount: 1,
        unit: 'oz'
      },
      {
        name: 'raw-butter',
        quality: 'raw-dairy-grass-fed',
        state: 'room-temperature',
        amount: 1,
        unit: 'oz'
      }
    ],
    preparation: [
      {
        order: 1,
        description: 'Gently warm butter to room temperature',
        temperature: {
          min: 68,
          max: 72,
          unit: '°F',
          critical: true
        }
      },
      {
        order: 2,
        description: 'Blend organs briefly with butter',
        warning: 'Maximum 5-10 seconds blend time'
      }
    ],
    benefits: [
      {
        system: 'nervous',
        description: 'Enhanced brain function and nerve repair',
        timeToEffect: '1-2 weeks'
      },
      {
        system: 'endocrine',
        description: 'Hormonal system support',
        timeToEffect: '2-4 weeks'
      }
    ],
    warnings: [
      'Advanced practitioners only',
      'Start with tiny amounts',
      'Source highest quality organs only',
      'Consume immediately after preparation'
    ]
  }
]; 