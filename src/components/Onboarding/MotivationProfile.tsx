import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { UserData } from '../../store/gameStore';
import './MotivationProfile.css';

interface Question {
  id: string;
  text: string;
  category: 'achievement' | 'social' | 'exploration' | 'competition' | 'creativity';
  options: {
    text: string;
    score: number;
  }[];
}

const MOTIVATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'When starting a new project, what excites you the most?',
    category: 'achievement',
    options: [
      { text: 'Setting and reaching clear goals', score: 5 },
      { text: 'Learning new skills along the way', score: 3 },
      { text: 'Sharing progress with others', score: 1 }
    ]
  },
  {
    id: 'q2',
    text: 'How do you prefer to track your progress?',
    category: 'achievement',
    options: [
      { text: 'Detailed statistics and numbers', score: 5 },
      { text: 'Visual representations and charts', score: 3 },
      { text: 'Through feedback from others', score: 1 }
    ]
  },
  {
    id: 'q3',
    text: 'What helps you stay motivated?',
    category: 'social',
    options: [
      { text: 'Competing with others', score: 5 },
      { text: 'Personal improvement', score: 3 },
      { text: 'Supporting others', score: 1 }
    ]
  },
  // Add more questions...
];

interface MotivationType {
  achievement: number;
  social: number;
  exploration: number;
  competition: number;
  creativity: number;
}

export const MotivationProfile = () => {
  const { currentUser, updateUserData } = useGameStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [profile, setProfile] = useState<MotivationType | null>(null);

  const handleAnswer = (score: number) => {
    const question = MOTIVATION_QUESTIONS[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [question.id]: score
    }));

    if (currentQuestion < MOTIVATION_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateProfile();
    }
  };

  const calculateProfile = () => {
    const profile: MotivationType = {
      achievement: 0,
      social: 0,
      exploration: 0,
      competition: 0,
      creativity: 0
    };

    MOTIVATION_QUESTIONS.forEach(question => {
      const score = answers[question.id] || 0;
      profile[question.category] += score;
    });

    setProfile(profile);
    generatePersonalizedRecommendations(profile);
  };

  const generatePersonalizedRecommendations = (profile: MotivationType) => {
    if (!currentUser) return;
    
    const recommendations: UserData['recommendations'] = {
      questStyle: profile.competition > profile.achievement ? 'competitive' : 'personal',
      rewardSystem: profile.social > profile.achievement ? 'social' : 'achievement',
      trackingPreference: profile.creativity > profile.achievement ? 'flexible' : 'structured',
      challengeType: profile.exploration > profile.competition ? 'discovery' : 'mastery'
    };

    updateUserData(currentUser, {
      motivationProfile: profile,
      recommendations,
      gameSettings: {
        questFrequency: profile.achievement > 3 ? 'high' : 'moderate',
        socialFeatures: profile.social > 3 ? 'enabled' : 'minimal',
        competitionMode: profile.competition > 3 ? 'enabled' : 'disabled',
        explorationMode: profile.exploration > 3 ? 'enabled' : 'disabled'
      }
    });
  };

  if (profile) {
    return (
      <div className="motivation-results">
        <h2>Your Motivation Profile</h2>
        <div className="profile-chart">
          {Object.entries(profile).map(([category, score]) => (
            <div key={category} className="profile-bar">
              <label>{category}</label>
              <div className="bar">
                <div 
                  className="fill"
                  style={{ width: `${(score / 15) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => window.location.reload()}>
          Start Your Journey
        </button>
      </div>
    );
  }

  const question = MOTIVATION_QUESTIONS[currentQuestion];
  return (
    <div className="motivation-questionnaire">
      <div className="progress-bar">
        <div 
          className="progress"
          style={{ width: `${(currentQuestion / MOTIVATION_QUESTIONS.length) * 100}%` }}
        />
      </div>
      
      <h3>{question.text}</h3>
      
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className="option-button"
            onClick={() => handleAnswer(option.score)}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}; 