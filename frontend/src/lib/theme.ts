import { createTheme } from '@mui/material/styles';

// ─── Module augmentation ────────────────────────────────────────────
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      bg2: string;
      bg3: string;
      border2: string;
      accentBorder: string;
      star: string;
      green: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      bg2: string;
      bg3: string;
      border2: string;
      accentBorder: string;
      star: string;
      green: string;
    };
  }
}

// ─── Theme creation ─────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F4F2EE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1A16',
      secondary: '#5A5750',
      disabled: '#9E9B93',
    },
    primary: {
      main: '#C8622A',
      dark: '#A34D1E',
      light: '#FDF1EB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1E4DA8',
      light: '#EBF0FC',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#0A5E49',
      light: '#E2F5EF',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#8A5A00',
      light: '#FDF5E0',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#9B2042',
      light: '#FDEDF1',
      contrastText: '#FFFFFF',
    },
    divider: 'rgba(0,0,0,0.08)',
    custom: {
      bg2: '#ECEAE4',
      bg3: '#E4E1D8',
      border2: 'rgba(0,0,0,0.14)',
      accentBorder: 'rgba(200,98,42,0.25)',
      star: '#E8A020',
      green: '#2E9E5B',
    },
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
    borderRadius: 12,
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
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 2,
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

export { theme };
export default theme;
