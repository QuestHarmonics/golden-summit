import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import './RetroCalendar.css';

type ViewType = 'day' | 'week' | 'month';

interface QuestEvent {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  skillId?: string;
  requiredLevel?: number;
  isSecret?: boolean;
}

export const RetroCalendar = () => {
  const [currentView, setCurrentView] = useState<ViewType>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { currentUser, users } = useGameStore();
  
  const userData = currentUser ? users[currentUser].data : null;
  const userLevel = userData?.level || 1;
  const quests: QuestEvent[] = userData?.quests || [];

  const getQuestVisibility = (quest: QuestEvent) => {
    if (quest.isSecret && quest.requiredLevel) {
      return userLevel >= quest.requiredLevel;
    }
    return true;
  };

  const renderQuestIndicator = (quest: QuestEvent) => {
    if (!getQuestVisibility(quest)) return null;
    
    return (
      <div 
        className={`quest-indicator ${quest.completed ? 'completed' : ''} ${quest.isSecret ? 'secret' : ''}`}
        title={quest.title}
      />
    );
  };

  const renderDayView = () => {
    return (
      <div className="retro-day-view">
        <div className="time-slots">
          {Array.from({ length: 24 }).map((_, hour) => (
            <div key={hour} className="time-slot">
              <span className="hour">{`${hour.toString().padStart(2, '0')}:00`}</span>
              {quests
                .filter(quest => new Date(quest.date).getHours() === hour)
                .map(quest => renderQuestIndicator(quest))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="retro-week-view">
        <div className="week-header">
          {days.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        <div className="week-grid">
          {/* Week grid implementation */}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();

    return (
      <div className="retro-month-view">
        <div className="month-grid">
          {Array.from({ length: daysInMonth }).map((_, i) => (
            <div key={i} className="day-cell">
              <span className="day-number">{i + 1}</span>
              {/* Quest indicators */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="retro-calendar">
      <div className="calendar-header">
        <h2 className="pixel-text">Quest Calendar</h2>
        <div className="date-controls">
          <button 
            className="pixel-button"
            onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
          >
            ◀
          </button>
          <span>{selectedDate.toLocaleDateString()}</span>
          <button 
            className="pixel-button"
            onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
          >
            ▶
          </button>
        </div>
        <div className="view-controls">
          <button 
            className={`pixel-button ${currentView === 'day' ? 'active' : ''}`}
            onClick={() => setCurrentView('day')}
          >
            Day
          </button>
          <button 
            className={`pixel-button ${currentView === 'week' ? 'active' : ''}`}
            onClick={() => setCurrentView('week')}
          >
            Week
          </button>
          <button 
            className={`pixel-button ${currentView === 'month' ? 'active' : ''}`}
            onClick={() => setCurrentView('month')}
          >
            Month
          </button>
        </div>
      </div>

      <div className="calendar-content">
        {currentView === 'day' && renderDayView()}
        {currentView === 'week' && renderWeekView()}
        {currentView === 'month' && renderMonthView()}
      </div>
    </div>
  );
}; 