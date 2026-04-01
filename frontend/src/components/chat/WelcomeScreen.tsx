'use client';

import { Box, Typography, Grid } from '@mui/material';
import {
  EditNote,
  Image,
  Build,
  AutoFixHigh,
  BarChart,
  Explore,
} from '@mui/icons-material';

const ACTIONS = [
  {
    icon: EditNote,
    title: 'Write content',
    subtitle: 'Emails, posts, stories',
    color: 'var(--blue)',
    bg: 'var(--blue-lt)',
  },
  {
    icon: Image,
    title: 'Create images',
    subtitle: 'Art, photos, designs',
    color: 'var(--teal)',
    bg: 'var(--teal-lt)',
  },
  {
    icon: Build,
    title: 'Build something',
    subtitle: 'Apps, tools, websites',
    color: 'var(--accent)',
    bg: 'var(--accent-lt)',
  },
  {
    icon: AutoFixHigh,
    title: 'Automate work',
    subtitle: 'Save hours every week',
    color: 'var(--blue)',
    bg: 'var(--blue-lt)',
  },
  {
    icon: BarChart,
    title: 'Analyse data',
    subtitle: 'PDFs, sheets, reports',
    color: 'var(--amber)',
    bg: 'var(--amber-lt)',
  },
  {
    icon: Explore,
    title: 'Just exploring',
    subtitle: "Show me what's possible",
    color: 'var(--teal)',
    bg: 'var(--teal-lt)',
  },
];

interface WelcomeScreenProps {
  onActionClick: (title: string) => void;
}

export default function WelcomeScreen({ onActionClick }: WelcomeScreenProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 4,
        maxWidth: 560,
        mx: 'auto',
        width: '100%',
        animation: 'fadeUp 0.4s ease',
      }}
    >
      {/* Robot emoji / icon */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'var(--accent-lt)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          fontSize: '2rem',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        🤖
      </Box>

      <Typography
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: '1.625rem',
          color: 'var(--text)',
          textAlign: 'center',
          mb: 1,
          lineHeight: 1.2,
        }}
      >
        Welcome! I'm here to help you 👋
      </Typography>

      <Typography
        sx={{
          fontSize: '0.9375rem',
          color: 'var(--text2)',
          textAlign: 'center',
          mb: 3,
          lineHeight: 1.6,
        }}
      >
        No tech background needed. Tell me what you'd like to{' '}
        <Box component="span" sx={{ color: 'var(--accent)', fontStyle: 'italic' }}>
          achieve
        </Box>{' '}
        — I'll help you discover what's possible, step by step.
      </Typography>

      {/* "What would you like to do today?" prompt */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'var(--bg)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          p: 2,
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text2)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            mb: 1.5,
            textAlign: 'center',
          }}
        >
          WHAT WOULD YOU LIKE TO DO TODAY?
        </Typography>

        <Grid container spacing={1}>
          {ACTIONS.map(({ icon: Icon, title, subtitle, color, bg }) => (
            <Grid item xs={6} key={title}>
              <Box
                onClick={() => onActionClick(title)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  p: 1.5,
                  borderRadius: 'var(--radius-sm)',
                  bgcolor: 'var(--card)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  '&:hover': {
                    borderColor: color,
                    transform: 'translateY(-2px)',
                    boxShadow: 'var(--shadow)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    bgcolor: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: 18, color }} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)', lineHeight: 1.3, mt: 0.25 }}>
                    {subtitle}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text3)', textAlign: 'center' }}>
        Or type anything below — there are no wrong answers ✦
      </Typography>
    </Box>
  );
}
