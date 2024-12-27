import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { achievementSystem, Achievement } from '../../utils/AchievementSystem';
import { RetroSoundSynth } from '../../utils/RetroSoundSynth';
import './AchievementDisplay.css';

export const AchievementDisplay: React.FC = () => {
  const { currentUser, users, updateUserData } = useGameStore();
  const [showNotification, setShowNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (!currentUser || !users[currentUser]) return;

    const userData = users[currentUser].data;
    const newAchievements = achievementSystem.checkAllAchievements(userData);

    if (newAchievements.length > 0) {
      const achievementId = newAchievements[0];
      const achievement = achievementSystem.getAchievements().find(a => a.id === achievementId);
      
      if (achievement) {
        setNewAchievement(achievement);
        setShowNotification(true);
        RetroSoundSynth.Instance.playEffect('achievement');

        // Apply rewards
        const rewards = achievementSystem.getAchievementRewards(achievementId);
        if (rewards) {
          updateUserData(currentUser, {
            xp: userData.xp + rewards.xp,
            coins: userData.coins + rewards.coins,
            achievements: [...userData.achievements, achievementId]
          });
        }

        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
          setNewAchievement(null);
        }, 5000);
      }
    }
  }, [currentUser, users, updateUserData]);

  if (!currentUser || !users[currentUser]) return null;

  const userData = users[currentUser].data;
  const allAchievements = achievementSystem.getAchievements();

  return (
    <div className="achievements-container">
      {/* Achievement Notification */}
      {showNotification && newAchievement && (
        <div className="achievement-notification">
          <div className="achievement-icon">{newAchievement.icon}</div>
          <div className="achievement-info">
            <h3>{newAchievement.title}</h3>
            <p>{newAchievement.description}</p>
          </div>
        </div>
      )}

      {/* Achievements List */}
      <div className="achievements-list">
        {allAchievements.map(achievement => {
          const isUnlocked = userData.achievements.includes(achievement.id);
          const progress = achievementSystem.getProgress(achievement.id, userData);
          const shouldHide = achievement.secret && !isUnlocked;

          return (
            <div 
              key={achievement.id}
              className={`achievement-card ${isUnlocked ? 'unlocked' : ''} ${shouldHide ? 'secret' : ''}`}
            >
              <div className="achievement-header">
                <span className="achievement-icon">{achievement.icon}</span>
                <h4>{shouldHide ? '???' : achievement.title}</h4>
              </div>
              <p>{shouldHide ? 'Secret Achievement' : achievement.description}</p>
              {!isUnlocked && !shouldHide && (
                <div className="achievement-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${progress * 100}%` }}
                  />
                  <span className="progress-text">{Math.round(progress * 100)}%</span>
                </div>
              )}
              {isUnlocked && (
                <div className="achievement-rewards">
                  <span>+{achievement.reward.xp} XP</span>
                  <span>+{achievement.reward.coins} Coins</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 