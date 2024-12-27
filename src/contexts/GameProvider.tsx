import { ReactNode, FC } from 'react';

export const GameProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
}; 