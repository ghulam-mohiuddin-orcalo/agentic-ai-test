import { createTheme } from '@mui/material/styles';

// Custom MUI theme matching the NexusAI demo design
// Reference: ai-model-hub-v12 (2).html
export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F4F2EE',      // --bg (warm beige)
      paper: '#FFFFFF',         // --card
    },
    text: {
      primary: '#1C1A16',       // --text (dark brown)
      secondary: '#5A5750',     // --text2 (medium brown)
      disabled: '#9E9B93',      // --text3 (light brown)
    },
    primary: {
      main: '#C8622A',          // --accent (terracotta)
      dark: '#A34D1E',          // --accent2
      light: '#FDF1EB',         // --accent-lt
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1E4DA8',          // --blue
      light: '#EBF0FC',         // --blue-lt
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#0A5E49',          // --teal
      light: '#E2F5EF',         // --teal-lt
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#8A5A00',          // --amber
      light: '#FDF5E0',         // --amber-lt
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#9B2042',          // --rose
      light: '#FDEDF1',         // --rose-lt
      contrastText: '#FFFFFF',
    },
    divider: 'rgba(0,0,0,0.08)',
  },
  typography: {
    fontFamily: "'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 700,
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 700,
      fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    h6: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
      fontSize: '0.75rem',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,           // --radius
  },
  shadows: [
    'none',
    '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
    '0 2px 12px rgba(0,0,0,0.09), 0 8px 32px rgba(0,0,0,0.05)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 8px 40px rgba(0,0,0,0.13)',
    '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
    '0 2px 12px rgba(0,0,0,0.09), 0 8px 32px rgba(0,0,0,0.05)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 8px 40px rgba(0,0,0,0.13)',
    '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
    '0 2px 12px rgba(0,0,0,0.09), 0 8px 32px rgba(0,0,0,0.05)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 8px 40px rgba(0,0,0,0.13)',
    '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
    '0 2px 12px rgba(0,0,0,0.09), 0 8px 32px rgba(0,0,0,0.05)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 8px 40px rgba(0,0,0,0.13)',
    '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
    '0 2px 12px rgba(0,0,0,0.09), 0 8px 32px rgba(0,0,0,0.05)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 8px 40px rgba(0,0,0,0.13)',
    '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
    '0 2px 12px rgba(0,0,0,0.09), 0 8px 32px rgba(0,0,0,0.05)',
    '0 4px 24px rgba(0,0,0,0.08)',
    '0 8px 40px rgba(0,0,0,0.13)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          padding: '0.5rem 1.25rem',
          transition: 'all 0.18s ease',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: '0 3px 12px rgba(200,98,42,0.25)',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(200,98,42,0.28)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(0,0,0,0.08)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 26px rgba(0,0,0,0.08)',
            borderColor: 'rgba(200,98,42,0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '2rem',
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(200,98,42,0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#C8622A',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        },
      },
    },
  },
});

// Custom CSS variables for additional styling
export const customStyles = {
  radiusSm: '8px',
  radius: '12px',
  radiusLg: '20px',
  radiusXl: '28px',
  shadow: '0 2px 14px rgba(0,0,0,0.07)',
  shadowMd: '0 4px 24px rgba(0,0,0,0.08)',
  border: 'rgba(0,0,0,0.08)',
  border2: 'rgba(0,0,0,0.12)',
  bg2: '#ECEAE4',
  bg3: '#E4E1D8',
};
