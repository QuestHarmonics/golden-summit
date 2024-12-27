import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import './XPAccumulator.css';
import { EventBus } from '../services/EventBus';
import { useSound } from '../hooks/useSound';

export const XPAccumulator = () => {
  const { currentUser, users, updateUserData } = useGameStore();
  const [multiplier, setMultiplier] = useState(1);
  const [xpRate, setXpRate] = useState(0);
  const [activeQuests, setActiveQuests] = useState<string[]>([]);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [passiveXP, setPassiveXP] = useState(0);
  const sound = useSound();

  const userData = currentUser ? users[currentUser].data : null;

  useEffect(() => {
    if (!userData) return;

    // Calculate active multipliers and set active quests
    const activeQuestsList = userData.quests
      .filter(q => !q.completed && new Date(q.date) > new Date())
      .map(q => q.title);
    
    setActiveQuests(activeQuestsList);

    // Calculate active multipliers from quests
    const activeMultipliers = userData.quests
      .filter(q => !q.completed && new Date(q.date) > new Date())
      .reduce((acc, quest) => acc + (quest.xpMultiplier || 0), 1);

    setMultiplier(activeMultipliers);

    // Calculate XP rate from active skills
    const activeSkillsXP = userData.skills.reduce((acc, skill) => {
      const isActive = skill.activities?.some(
        a => new Date(a.date).getTime() > Date.now() - 3600000
      );
      return acc + (isActive ? (skill.focus / 10) : 0);
    }, 0);

    setXpRate(activeSkillsXP * multiplier);
  }, [userData, multiplier]);

  useEffect(() => {
    if (multiplier > 1) {
      sound.multiplierStart();
    }
  }, [multiplier, sound]);

  useEffect(() => {
    const unsubscribe = EventBus.getInstance().subscribe('xp:gain', (amount: number) => {
      console.log(`Gained ${amount} XP`);
      sound.xpGain();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userData) return;
    
    const level = Math.floor(userData.xp / 100) + 1;
    if (level > userData.level) {
      setIsLevelUp(true);
      sound.levelUp();
      setTimeout(() => setIsLevelUp(false), 1000);
    }
  }, [userData?.xp]);

  useEffect(() => {
    if (!userData) return;

    const timer = setInterval(() => {
      const basePassiveRate = 0.1; // 0.1 XP per second
      const totalPassiveXP = basePassiveRate * multiplier;
      
      setPassiveXP(prev => prev + totalPassiveXP);
      
      if (passiveXP >= 1 && currentUser) {
        updateUserData(currentUser, {
          xp: userData.xp + Math.floor(passiveXP)
        });
        setPassiveXP(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [userData, multiplier, passiveXP]);

  if (!userData) return null;

  return (
    <div className={`xp-accumulator ${isLevelUp ? 'level-up' : ''}`}>
      <div className="xp-display">
        <div className="xp-total">
          <span className="pixel-text">
            XP: {Math.floor(userData.xp)}
            {passiveXP > 0 && `+${passiveXP.toFixed(1)}`}
          </span>
          <span className="level-indicator">LVL {userData.level}</span>
        </div>
        <div className="xp-rate">
          {xpRate > 0 && (
            <span className="rate-indicator">
              +{xpRate.toFixed(1)}/min
              {multiplier > 1 && (
                <span className="multiplier">
                  x{multiplier.toFixed(1)}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
      {activeQuests.length > 0 && (
        <div className="active-buffs">
          {activeQuests.map(quest => (
            <div key={quest} className="buff-indicator">
              🎯 Quest Bonus Active!
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 