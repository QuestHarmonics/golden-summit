import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c3e50',
      light: '#34495e',
      dark: '#1a252f',
      contrastText: '#ecf0f1'
    },
    secondary: {
      main: '#c0392b',
      light: '#e74c3c',
      dark: '#962d22',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d'
    },
    success: {
      main: '#27ae60',
      light: '#2ecc71',
      dark: '#219a52'
    },
    warning: {
      main: '#f39c12',
      light: '#f1c40f',
      dark: '#d35400'
    }
  },
  typography: {
    fontFamily: [
      'Courier Prime',
      'Courier New',
      'monospace'
    ].join(','),
    h1: {
      fontFamily: 'IMFellEnglishSC, serif',
      fontWeight: 600,
      letterSpacing: '0.02em'
    },
    h2: {
      fontFamily: 'IMFellEnglishSC, serif',
      fontWeight: 600
    },
    h3: {
      fontFamily: 'IMFellEnglishSC, serif',
      fontWeight: 600
    },
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    body1: {
      fontFamily: 'Courier Prime, Courier New, monospace',
      lineHeight: 1.8
    },
    body2: {
      fontFamily: 'Courier Prime, Courier New, monospace',
      lineHeight: 1.6
    }
  },
  shape: {
    borderRadius: 4
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '2px solid #2c3e50',
          boxShadow: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #2c3e50',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 0 0 2px #34495e'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          fontFamily: 'Courier Prime, Courier New, monospace',
          border: '2px solid transparent',
          '&:hover': {
            border: '2px solid currentColor'
          }
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            fontFamily: 'Courier Prime, Courier New, monospace',
            '& fieldset': {
              borderWidth: 2
            },
            '&:hover fieldset': {
              borderWidth: 2
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2
            }
          }
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #2c3e50',
          backgroundColor: 'transparent'
        }
      }
    }
  }
}); 