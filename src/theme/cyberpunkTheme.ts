import { createTheme } from '@mui/material/styles';

export const matrixColors = {
  neonGreen: '#00ff41',
  darkGreen: '#003b00',
  matrixBlack: '#0c0c0c',
  neonBlue: '#0ff',
  neonPink: '#ff00ff',
  darkGray: '#1a1a1a',
};

export const cyberpunkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: matrixColors.neonGreen,
      dark: matrixColors.darkGreen,
    },
    secondary: {
      main: matrixColors.neonBlue,
    },
    background: {
      default: matrixColors.matrixBlack,
      paper: matrixColors.darkGray,
    },
  },
  typography: {
    fontFamily: '"Press Start 2P", "Roboto Mono", monospace',
    h1: {
      fontSize: '2.5rem',
      textShadow: `0 0 10px ${matrixColors.neonGreen}`,
    },
    h2: {
      fontSize: '2rem',
      textShadow: `0 0 8px ${matrixColors.neonGreen}`,
    },
    h3: {
      fontSize: '1.75rem',
      textShadow: `0 0 6px ${matrixColors.neonGreen}`,
    },
    body1: {
      fontFamily: '"Roboto Mono", monospace',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Press Start 2P", cursive',
          textTransform: 'none',
          borderRadius: 0,
          border: `2px solid ${matrixColors.neonGreen}`,
          '&:hover': {
            boxShadow: `0 0 10px ${matrixColors.neonGreen}`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(12, 12, 12, 0.8)',
          borderRadius: 0,
          border: `1px solid ${matrixColors.neonGreen}`,
          boxShadow: `0 0 10px ${matrixColors.darkGreen}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderColor: matrixColors.neonGreen,
            },
            '&:hover fieldset': {
              borderColor: matrixColors.neonBlue,
            },
            '&.Mui-focused fieldset': {
              borderColor: matrixColors.neonGreen,
              boxShadow: `0 0 5px ${matrixColors.neonGreen}`,
            },
          },
        },
      },
    },
  },
});

export default cyberpunkTheme; 