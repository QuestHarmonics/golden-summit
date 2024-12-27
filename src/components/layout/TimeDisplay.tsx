export function TimeDisplay() {
  return (
    <div className="time-display">
      <div>{new Date().toLocaleTimeString()}</div>
    </div>
  );
} 