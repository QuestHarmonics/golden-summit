import { createContext } from 'react';
import { useStore } from './rootStore';
import type { StoreState } from './types';

const StoreContext = createContext<StoreState | null>(null);

function StoreProvider({ children }: { children: any }) {
  return (
    <StoreContext.Provider value={useStore()}>
      {children}
    </StoreContext.Provider>
  );
}

export { StoreProvider, StoreContext }; 