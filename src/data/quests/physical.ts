import { Quest } from '../../types';

export const PHYSICAL_QUESTS: Quest[] = [
  // BEGINNER TIER
  {
    id: 'PHY_1',
    title: 'Morning Vitality Ritual',
    description: 'Establish a morning routine that energizes your body and mind.',
    category: 'PHYSICAL',
    difficulty: 'BEGINNER',
    xpReward: 50,
    timeEstimate: '15 minutes',
    steps: [
      'Drink a glass of water upon waking',
      'Perform 5 minutes of gentle stretching',
      'Take 10 deep breaths by a window',
      'Do 5-10 jumping jacks to activate your body'
    ],
    tips: [
      'Prepare water beside your bed the night before',
      'Start slowly and build intensity gradually',
      'Focus on how your body feels as it wakes up'
    ]
  },
  {
    id: 'PHY_2',
    title: 'Posture Perfect',
    description: 'Develop awareness and improve your standing/sitting posture.',
    category: 'PHYSICAL',
    difficulty: 'BEGINNER',
    xpReward: 30,
    timeEstimate: '5 minutes, multiple times daily',
    steps: [
      'Set hourly posture check reminders',
      'Align ears over shoulders when standing',
      'Keep shoulders relaxed, not hunched',
      'Engage core while sitting'
    ],
    tips: [
      'Imagine a string pulling you up from the crown of your head',
      'Use your phone\'s wallpaper as a posture reminder',
      'Position your screen at eye level'
    ]
  },
  // INTERMEDIATE TIER
  {
    id: 'PHY_15',
    title: 'Movement Mastery',
    description: 'Create and maintain a consistent exercise routine.',
    category: 'PHYSICAL',
    difficulty: 'INTERMEDIATE',
    xpReward: 100,
    timeEstimate: '30 minutes',
    requirements: ['Complete PHY_1', 'Basic fitness level'],
    steps: [
      'Choose 3 days for structured exercise',
      'Plan workouts combining cardio and strength',
      'Track progress in a fitness journal',
      'Include proper warm-up and cool-down'
    ],
    tips: [
      'Start with bodyweight exercises if new to strength training',
      'Listen to your body and adjust intensity as needed',
      'Focus on form over speed or weight'
    ]
  },
  // ADVANCED TIER
  {
    id: 'PHY_20',
    title: 'Sleep Optimization Protocol',
    description: 'Master the science of sleep for maximum recovery and energy.',
    category: 'PHYSICAL',
    difficulty: 'ADVANCED',
    xpReward: 150,
    timeEstimate: 'Ongoing',
    steps: [
      'Create a consistent sleep/wake schedule',
      'Design an optimal sleep environment',
      'Develop a pre-sleep ritual',
      'Monitor sleep quality and patterns',
      'Adjust habits based on sleep data'
    ],
    tips: [
      'Keep room temperature between 60-67°F (15-19°C)',
      'Eliminate blue light exposure 2 hours before bed',
      'Use blackout curtains and white noise if needed'
    ]
  },
  {
    id: 'PHY_5',
    title: 'Hydration Hero',
    description: 'Master the habit of proper daily hydration.',
    category: 'PHYSICAL',
    difficulty: 'BEGINNER',
    xpReward: 40,
    timeEstimate: 'All day',
    steps: [
      'Calculate your daily water needs',
      'Set up regular water breaks',
      'Track water intake',
      'Learn to recognize thirst signals'
    ],
    tips: [
      'Keep a water bottle visible at all times',
      'Use an app or journal to track intake',
      'Add natural flavors like lemon or cucumber'
    ]
  },
  {
    id: 'PHY_6',
    title: 'Flexibility Foundation',
    description: 'Develop basic flexibility through daily stretching.',
    category: 'PHYSICAL',
    difficulty: 'BEGINNER',
    xpReward: 45,
    timeEstimate: '15 minutes',
    steps: [
      'Perform basic toe touches',
      'Practice shoulder and neck stretches',
      'Do hip flexor stretches',
      'Hold each stretch for 30 seconds'
    ],
    tips: [
      'Never bounce while stretching',
      'Breathe deeply through each stretch',
      'Stop if you feel pain'
    ]
  },
  {
    id: 'PHY_7',
    title: 'Mindful Walking',
    description: 'Transform regular walks into mindful movement practice.',
    category: 'PHYSICAL',
    difficulty: 'BEGINNER',
    xpReward: 35,
    timeEstimate: '20 minutes',
    steps: [
      'Find a quiet walking route',
      'Focus on each step',
      'Notice your breathing pattern',
      'Observe your surroundings'
    ],
    tips: [
      'Leave your phone at home',
      'Walk at a comfortable pace',
      'Try different terrains'
    ]
  },
  {
    id: 'PHY_8',
    title: 'Breath Mastery',
    description: 'Learn and practice proper breathing techniques.',
    category: 'PHYSICAL',
    difficulty: 'INTERMEDIATE',
    xpReward: 75,
    timeEstimate: '10 minutes, 3 times daily',
    steps: [
      'Practice diaphragmatic breathing',
      'Try box breathing (4-4-4-4)',
      'Experiment with nostril breathing',
      'Notice breathing patterns during activities'
    ],
    tips: [
      'Start in a quiet environment',
      'Place hand on belly to feel breath',
      'Gradually increase duration'
    ]
  },
  {
    id: 'PHY_9',
    title: 'Strength Foundations',
    description: 'Build basic strength using bodyweight exercises.',
    category: 'PHYSICAL',
    difficulty: 'INTERMEDIATE',
    xpReward: 85,
    timeEstimate: '25 minutes',
    steps: [
      'Master proper push-up form',
      'Practice squats with good alignment',
      'Hold planks for increasing duration',
      'Learn proper lunges'
    ],
    tips: [
      'Focus on form before adding repetitions',
      'Rest between sets',
      'Stay hydrated during exercise'
    ]
  },
  {
    id: 'PHY_10',
    title: 'Recovery Ritual',
    description: 'Develop a post-exercise recovery routine.',
    category: 'PHYSICAL',
    difficulty: 'INTERMEDIATE',
    xpReward: 90,
    timeEstimate: '30 minutes',
    steps: [
      'Perform cool-down stretches',
      'Use a foam roller on major muscle groups',
      'Practice progressive muscle relaxation',
      'Plan proper post-workout nutrition'
    ],
    tips: [
      'Listen to your body\'s needs',
      'Stay hydrated during recovery',
      'Give muscles time to repair'
    ]
  },
  {
    id: 'PHY_11',
    title: 'Balance Builder',
    description: 'Improve your balance and stability through daily practice.',
    category: 'PHYSICAL',
    difficulty: 'INTERMEDIATE',
    xpReward: 80,
    timeEstimate: '15 minutes',
    steps: [
      'Practice single-leg standing',
      'Walk heel-to-toe in a straight line',
      'Try standing with eyes closed (near support)',
      'Perform basic yoga poses for balance'
    ],
    tips: [
      'Start near a wall for safety',
      'Progress gradually to more challenging positions',
      'Practice on different surfaces as you improve'
    ]
  },
  {
    id: 'PHY_12',
    title: 'Joint Mobility Mastery',
    description: 'Maintain and improve joint health through targeted exercises.',
    category: 'PHYSICAL',
    difficulty: 'INTERMEDIATE',
    xpReward: 95,
    timeEstimate: '20 minutes',
    steps: [
      'Perform wrist and ankle circles',
      'Practice shoulder mobility exercises',
      'Do hip rotations and circles',
      'Include spinal mobility movements'
    ],
    tips: [
      'Move slowly and deliberately',
      'Avoid forcing movements',
      'Do these before more intense exercise'
    ]
  },
  {
    id: 'PHY_13',
    title: 'Endurance Evolution',
    description: 'Build cardiovascular endurance progressively.',
    category: 'PHYSICAL',
    difficulty: 'ADVANCED',
    xpReward: 120,
    timeEstimate: '45 minutes',
    steps: [
      'Establish baseline cardio capacity',
      'Create progressive cardio plan',
      'Incorporate interval training',
      'Monitor heart rate recovery'
    ],
    tips: [
      'Start with walking if needed',
      'Increase duration before intensity',
      'Track progress weekly'
    ]
  },
  {
    id: 'PHY_14',
    title: 'Nutrition Navigator',
    description: 'Develop healthy eating habits and meal planning skills.',
    category: 'PHYSICAL',
    difficulty: 'INTERMEDIATE',
    xpReward: 100,
    timeEstimate: 'Ongoing',
    steps: [
      'Learn basic macro and micronutrients',
      'Plan balanced meals for the week',
      'Practice portion control',
      'Track meals and energy levels'
    ],
    tips: [
      'Start with small changes',
      'Prepare meals in advance',
      'Read nutrition labels carefully'
    ]
  },
  {
    id: 'PHY_15',
    title: 'Stress-Relief Specialist',
    description: 'Master physical techniques for stress management.',
    category: 'PHYSICAL',
    difficulty: 'INTERMEDIATE',
    xpReward: 90,
    timeEstimate: '20 minutes',
    steps: [
      'Practice progressive muscle relaxation',
      'Learn stress-relief breathing techniques',
      'Use physical activity for stress relief',
      'Create a calming movement routine'
    ],
    tips: [
      'Find a quiet space to practice',
      'Notice tension patterns in your body',
      'Combine with mental relaxation techniques'
    ]
  },
  {
    id: 'PHY_26',
    title: 'Power Development Protocol',
    description: 'Build explosive strength and power through advanced training.',
    category: 'PHYSICAL',
    difficulty: 'EXPERT',
    xpReward: 185,
    timeEstimate: '45 minutes',
    steps: [
      'Master plyometric basics',
      'Develop rate of force production',
      'Practice power-based movements',
      'Integrate power into daily training'
    ],
    tips: [
      'Quality over quantity',
      'Full recovery between sets',
      'Perfect form before adding intensity'
    ]
  },
  {
    id: 'PHY_27',
    title: 'Movement Meditation Master',
    description: 'Combine mindfulness with physical movement for enhanced mind-body connection.',
    category: 'PHYSICAL',
    difficulty: 'ADVANCED',
    xpReward: 160,
    timeEstimate: '40 minutes',
    steps: [
      'Practice moving meditation',
      'Develop body awareness',
      'Integrate breath with movement',
      'Create mindful movement flows'
    ],
    tips: [
      'Start with simple movements',
      'Focus on present moment',
      'Notice subtle body signals'
    ]
  },
  {
    id: 'PHY_28',
    title: 'Injury Prevention Specialist',
    description: 'Master techniques to prevent and manage common physical issues.',
    category: 'PHYSICAL',
    difficulty: 'ADVANCED',
    xpReward: 175,
    timeEstimate: 'Ongoing',
    steps: [
      'Learn common injury patterns',
      'Develop preventive exercises',
      'Master proper movement mechanics',
      'Create prehab routines'
    ],
    tips: [
      'Address weaknesses early',
      'Maintain balanced development',
      'Listen to body signals'
    ]
  },
  {
    id: 'PHY_29',
    title: 'Performance Nutrition Expert',
    description: 'Master advanced nutritional timing and strategies for optimal performance.',
    category: 'PHYSICAL',
    difficulty: 'EXPERT',
    xpReward: 195,
    timeEstimate: 'Daily',
    steps: [
      'Learn nutrient timing principles',
      'Master pre/post workout nutrition',
      'Develop meal planning skills',
      'Understand supplementation basics'
    ],
    tips: [
      'Focus on whole foods first',
      'Time nutrients around activity',
      'Stay hydrated throughout day'
    ]
  },
  {
    id: 'PHY_30',
    title: 'Elite Recovery Integration',
    description: 'Combine advanced recovery techniques for optimal restoration.',
    category: 'PHYSICAL',
    difficulty: 'EXPERT',
    xpReward: 200,
    timeEstimate: 'Variable',
    steps: [
      'Master various recovery methods',
      'Create personalized recovery protocols',
      'Learn recovery timing strategies',
      'Integrate active and passive recovery'
    ],
    tips: [
      'Match recovery to training intensity',
      'Use multiple recovery methods',
      'Monitor recovery effectiveness'
    ]
  }
]; 