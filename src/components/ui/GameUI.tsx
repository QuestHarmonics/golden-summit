// Basic UI components for the game
interface StatusBarProps {
  current: number;
  max: number;
  type?: 'xp' | 'health' | 'mana';
}

export const StatusBar = ({ current, max, type = 'xp' }: StatusBarProps) => {
  const percentage = (current / max) * 100;
  return (
    <div className={`status-bar ${type}-bar`}>
      <div 
        className="status-bar-fill"
        style={{ width: `${percentage}%` }}
      />
      <span className="status-text">
        {current}/{max}
      </span>
    </div>
  );
};

export const XPBar = (props: Omit<StatusBarProps, 'type'>) => (
  <StatusBar {...props} type="xp" />
);

export const HealthBar = (props: Omit<StatusBarProps, 'type'>) => (
  <StatusBar {...props} type="health" />
); 