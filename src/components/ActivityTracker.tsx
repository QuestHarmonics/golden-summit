import React, { useState } from 'react';
import { useGameStore, addSkillActivity } from '../store/gameStore';

interface ActivityFormData {
  type: string;
  duration: number;
  description: string;
  metrics: Record<string, any>;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  focus: number;
  timeSpent: number;
  activities: { date: string; duration: number; description: string; }[];
  progress: { daily: number; weekly: number; total: number; };
  description: string;
  connections: string[];
  metrics?: {
    workoutCount?: number;
    totalDuration?: number;
    typesTracked?: Set<string>;
    totalNights?: number;
    averageDuration?: number;
  };
}

export const ActivityTracker: React.FC = () => {
  const { currentUser, users, updateUserData } = useGameStore();
  const [selectedSkill, setSelectedSkill] = useState<string>('workout-tracking');
  const [formData, setFormData] = useState<ActivityFormData>({
    type: '',
    duration: 0,
    description: '',
    metrics: {}
  });

  const userData = currentUser ? users[currentUser]?.data : null;
  const trackingSkills = (userData?.skills as Skill[] || []).filter(skill => skill.id.includes('tracking'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userData) return;

    const skill = userData.skills.find(s => s.id === selectedSkill) as Skill | undefined;
    if (!skill) return;

    addSkillActivity(skill, {
      ...formData,
      metrics: {
        ...formData.metrics,
        timeOfDay: new Date().getHours()
      }
    });

    updateUserData(currentUser, {
      ...userData,
      skills: userData.skills.map(s => s.id === selectedSkill ? skill : s)
    });

    // Reset form
    setFormData({
      type: '',
      duration: 0,
      description: '',
      metrics: {}
    });
  };

  const renderMetricsFields = () => {
    switch (selectedSkill) {
      case 'workout-tracking':
        return (
          <>
            <input
              type="text"
              placeholder="Exercise type"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="tracking-input"
            />
            <input
              type="number"
              placeholder="Sets"
              onChange={e => setFormData({
                ...formData,
                metrics: { ...formData.metrics, sets: parseInt(e.target.value) }
              })}
              className="tracking-input"
            />
            <input
              type="number"
              placeholder="Reps"
              onChange={e => setFormData({
                ...formData,
                metrics: { ...formData.metrics, reps: parseInt(e.target.value) }
              })}
              className="tracking-input"
            />
          </>
        );
      case 'sleep-tracking':
        return (
          <>
            <input
              type="number"
              placeholder="Quality (1-10)"
              onChange={e => setFormData({
                ...formData,
                metrics: { ...formData.metrics, quality: parseInt(e.target.value) }
              })}
              className="tracking-input"
            />
            <input
              type="time"
              placeholder="Bedtime"
              onChange={e => setFormData({
                ...formData,
                metrics: { ...formData.metrics, bedtime: e.target.value }
              })}
              className="tracking-input"
            />
          </>
        );
      // Add other tracking types
      default:
        return null;
    }
  };

  const renderAnalytics = () => {
    const skill = userData?.skills.find(s => s.id === selectedSkill) as Skill | undefined;
    if (!skill?.metrics) return null;

    return (
      <div className="analytics-container">
        <h3>Analytics</h3>
        {selectedSkill === 'workout-tracking' && (
          <>
            <p>Total Workouts: {skill.metrics.workoutCount}</p>
            <p>Total Duration: {skill.metrics.totalDuration} minutes</p>
            <p>Exercise Types: {Array.from(skill.metrics.typesTracked || new Set()).join(', ')}</p>
            <div className="chart">
              {/* Add visualization of preferred workout times */}
            </div>
          </>
        )}
        {selectedSkill === 'sleep-tracking' && (
          <>
            <p>Nights Tracked: {skill.metrics.totalNights}</p>
            <p>Average Duration: {skill.metrics.averageDuration?.toFixed(1) || '0'} hours</p>
            <div className="chart">
              {/* Add sleep pattern visualization */}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="activity-tracker">
      <h2>Activity Tracker</h2>
      <select
        value={selectedSkill}
        onChange={e => setSelectedSkill(e.target.value)}
        className="skill-select"
      >
        {trackingSkills.map(skill => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit} className="tracking-form">
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          className="tracking-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="tracking-input"
        />
        {renderMetricsFields()}
        <button type="submit" className="track-button">Track Activity</button>
      </form>

      {renderAnalytics()}
    </div>
  );
}; 