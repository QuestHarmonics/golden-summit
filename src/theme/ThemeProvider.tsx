import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import cyberpunkTheme from './cyberpunkTheme';
import MatrixRain from '../components/effects/MatrixRain';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MuiThemeProvider theme={cyberpunkTheme}>
      <CssBaseline />
      <MatrixRain />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider; 