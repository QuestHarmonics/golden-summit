import React from 'react';
import { useAuthStateListener } from '../hooks/useAuthStateListener';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize auth state listener
  useAuthStateListener();

  return <>{children}</>;
}; 