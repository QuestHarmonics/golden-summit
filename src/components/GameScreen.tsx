import { ReactNode } from 'react';
import { XPAccumulator } from './XPAccumulator';

interface GameScreenProps {
  children?: ReactNode;
}

export const GameScreen = ({ children }: GameScreenProps) => {
  return (
    <div className="game-screen">
      <XPAccumulator />
      {children}
    </div>
  );
}; 