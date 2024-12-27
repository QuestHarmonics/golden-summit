export function TimeDisplay() {
  return (
    <div className="time-display">
      {new Date().toLocaleTimeString()}
    </div>
  );
} 