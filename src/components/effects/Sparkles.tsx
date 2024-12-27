export const Sparkles = () => {
  return (
    <div className="sparkles">
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i} 
          className="sparkle"
          style={{
            '--delay': `${Math.random() * 2}s`,
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}; 