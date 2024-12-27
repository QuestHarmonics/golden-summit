import { useState } from 'react';
import { Registration } from './Registration';

export function Introduction() {
  const [showRegistration, setShowRegistration] = useState(false);

  if (showRegistration) {
    return <Registration />;
  }

  return (
    <div className="introduction">
      <h1>Welcome to Golden Summit</h1>
      <p>Your journey to self-improvement begins here.</p>
      <button 
        onClick={() => setShowRegistration(true)}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Get Started
      </button>
    </div>
  );
} 