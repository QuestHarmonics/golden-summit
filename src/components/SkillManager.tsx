import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Skill } from '../store/gameStore';

export const SkillManager = () => {
  const { currentUser, users, updateUserData } = useGameStore();
  const [newSkillName, setNewSkillName] = useState('');
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  if (!currentUser || !users[currentUser]) return null;
  const userData = users[currentUser].data;

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      level: 1,
      xp: 0,
      focus: 50,
      timeSpent: 0,
      activities: [],
      progress: {
        daily: 0,
        weekly: 0,
        total: 0
      }
    };

    updateUserData(currentUser, {
      skills: [...userData.skills, newSkill]
    });
    setNewSkillName('');
  };

  const trackProgress = (skillId: string, minutes: number) => {
    const updatedSkills = userData.skills.map(skill => {
      if (skill.id === skillId) {
        const newXP = skill.xp + (minutes * (skill.focus / 10));
        return {
          ...skill,
          xp: newXP,
          level: Math.floor(newXP / 100) + 1,
          timeSpent: skill.timeSpent + minutes,
          lastTracked: new Date().toISOString(),
          progress: {
            ...skill.progress,
            daily: skill.progress.daily + minutes,
            total: skill.progress.total + minutes
          }
        };
      }
      return skill;
    });

    updateUserData(currentUser, { skills: updatedSkills });
  };

  return (
    <div className="skill-manager">
      <div className="add-skill">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Enter new skill..."
        />
        <button onClick={addSkill}>Add Skill</button>
      </div>

      <div className="skills-list">
        {userData.skills.map(skill => (
          <div key={skill.id} 
               className={`skill-card ${activeSkill === skill.id ? 'active' : ''}`}
               onClick={() => setActiveSkill(skill.id)}>
            <h3>{skill.name}</h3>
            <div className="skill-stats">
              <div>Level {skill.level}</div>
              <div>XP: {Math.floor(skill.xp)}</div>
              <div>Time Spent: {skill.timeSpent} minutes</div>
            </div>
            <div className="progress-tracking">
              <button onClick={() => trackProgress(skill.id, 15)}>
                Track 15m
              </button>
              <button onClick={() => trackProgress(skill.id, 30)}>
                Track 30m
              </button>
              <button onClick={() => trackProgress(skill.id, 60)}>
                Track 1h
              </button>
            </div>
            <div className="focus-control">
              <label>Focus Level: {skill.focus}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={skill.focus}
                onChange={(e) => {
                  const updatedSkills = userData.skills.map(s =>
                    s.id === skill.id ? { ...s, focus: Number(e.target.value) } : s
                  );
                  updateUserData(currentUser, { skills: updatedSkills });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 