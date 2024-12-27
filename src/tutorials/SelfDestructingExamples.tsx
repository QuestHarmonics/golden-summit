interface TutorialQuest {
  id: string;
  type: 'TUTORIAL' | 'EXAMPLE' | 'PRACTICE';
  completed: boolean;
  understood: boolean;
  expiresAfter: number; // completions before self-destruct
}

const tutorialProgression = {
  STAGE_1: {
    BASIC_MULTIPLIER: {
      quest: {
        title: "Morning Momentum",
        description: "Complete any exercise within 2 hours of waking up",
        reward: "1.5x XP Multiplier for 2 hours",
        selfDestruct: {
          trigger: "3 successful completions",
          replacedBy: "Create your own morning routine quest"
        }
      },
      learningGoal: "Understanding time-based multipliers"
    },

    SKILL_COMBO: {
      quest: {
        title: "Social Chef",
        description: "Cook a meal with a friend (Cooking + Social)",
        reward: "2x XP for both skills",
        selfDestruct: {
          trigger: "2 successful completions",
          replacedBy: "Design a skill-combining quest"
        }
      },
      learningGoal: "Understanding skill synergy"
    }
  },

  STAGE_2: {
    COMMUNITY_BOOST: {
      quest: {
        title: "Knowledge Share",
        description: "Teach someone a skill you're tracking",
        reward: "3x XP + Community Impact Points",
        selfDestruct: {
          trigger: "1 successful completion",
          replacedBy: "Create a teaching quest"
        }
      },
      learningGoal: "Understanding community multipliers"
    }
  }
};

// Progressive Difficulty Examples
const difficultyExamples = {
  GARDENING: [
    {
      level: 1,
      quest: "Plant an herb garden",
      duration: "1 hour",
      multiplier: 1.2,
      selfDestruct: "After 2 completions"
    },
    {
      level: 2,
      quest: "Create a vegetable plot",
      duration: "1 day",
      multiplier: 1.5,
      selfDestruct: "After 1 completion"
    },
    {
      level: 3,
      quest: "Design community garden",
      duration: "1 week",
      multiplier: 2.0,
      selfDestruct: "After understanding demonstrated"
    }
  ]
};

// Replacement System
interface QuestReplacement {
  original: TutorialQuest;
  trigger: 'completion' | 'understanding' | 'time';
  newQuest: {
    type: 'USER_GENERATED' | 'AI_SUGGESTED';
    template: string;
    difficulty: number;
  }
}

// Understanding Verification
interface UnderstandingCheck {
  questions: [
    {
      prompt: "How do multipliers stack?",
      correctAnswer: "They combine additively up to 5x",
      verificationMethod: "Create a quest using multipliers"
    },
    {
      prompt: "How do skill synergies work?",
      correctAnswer: "Related skills boost each other",
      verificationMethod: "Design a multi-skill quest"
    }
  ];
  
  verification: {
    method: 'PRACTICAL' | 'CREATION' | 'TEACHING';
    criteria: string[];
    evidence: string[];
  }
} 