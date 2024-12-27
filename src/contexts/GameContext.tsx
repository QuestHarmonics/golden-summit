import React, { createContext, useContext, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { LifePath } from '../types/gameState';
import { playSound } from '../utils/sound';
import { showNotification } from '../utils/notification';

interface GameStore {
  xp: number;
  level: number;
  health: number;
  maxHealth: number;
  coins: number;
  dailyStreak: number;
  lastLoginDate: string;
  paths: Record<string, LifePath>;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  updateHealth: (amount: number) => void;
  updateDailyStreak: () => void;
}

interface GameContextType {
  // Core game state
  gameState: GameStore;
  
  // Path management
  activePath: LifePath | null;
  setActivePath: (path: LifePath) => void;
  
  // Progress tracking
  gainXP: (amount: number, pathId?: string) => void;
  completeQuest: (questId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  
  // Time and season management
  currentTime: Date;
  currentSeason: string;
  weatherConditions: string;
  
  // System status
  isLoading: boolean;
  error: string | null;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const store = useGameStore() as GameStore;
  const [activePath, setActivePath] = React.useState<LifePath | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Initialize game systems
  useEffect(() => {
    try {
      // Load saved game state
      setIsLoading(true);
      
      // Initialize time and weather
      updateTimeAndWeather();
      
      // Start game loops
      startGameLoops();
      
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize game');
    }
  }, []);

  // Update time and weather
  const updateTimeAndWeather = () => {
    const now = new Date();
    setCurrentTime(now);
    // Update season and weather based on real time
  };

  // Start game loops
  const startGameLoops = () => {
    // Time loop
    setInterval(updateTimeAndWeather, 60000); // Update every minute
    
    // Auto-save loop
    setInterval(() => {
      // Save game state
    }, 300000); // Save every 5 minutes
  };

  // Core game functions
  const gainXP = (amount: number, pathId?: string) => {
    if (pathId && activePath?.id === pathId) {
      store.addXP(amount);
    } else {
      store.addXP(amount);
    }
  };

  const completeQuest = (questId: string) => {
    const quest = store.paths[activePath?.id || 'dailyLife']?.quests?.find(q => q.id === questId);
    if (quest) {
      store.addXP(quest.rewards.find(r => r.type === 'xp')?.amount || 0);
      showNotification(`Quest Complete: ${quest.title}`);
      playSound('achievement');
    }
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = store.paths[activePath?.id || 'dailyLife']?.achievements?.find(a => a.id === achievementId);
    if (achievement && !achievement.status.includes('completed')) {
      store.addXP(achievement.rewards.find(r => r.type === 'xp')?.amount || 0);
      showNotification(`Achievement Unlocked: ${achievement.title}`);
      playSound('achievement');
    }
  };

  const value = {
    gameState: store,
    activePath,
    setActivePath,
    gainXP,
    completeQuest,
    unlockAchievement,
    currentTime,
    currentSeason: calculateSeason(currentTime),
    weatherConditions: calculateWeather(),
    isLoading,
    error
  };

  return (
    <GameContext.Provider value={value}>
      {isLoading ? <LoadingScreen /> : children}
    </GameContext.Provider>
  );
}

// Helper hook for using the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Helper functions
const calculateSeason = (date: Date): string => {
  const month = date.getMonth();
  if (month <= 1 || month === 11) return 'winter';
  if (month <= 4) return 'spring';
  if (month <= 7) return 'summer';
  return 'autumn';
};

const calculateWeather = (): string => {
  // Implement weather calculation based on season and random factors
  return 'clear';
};

const LoadingScreen = () => (
  <div className="loading-screen">
    <h2>Loading Golden Summit...</h2>
    {/* Add loading animation */}
  </div>
); 