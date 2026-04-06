'use client';

import { Box, Typography, Grid } from '@mui/material';
import {
  EditNote,
  Image,
  Code,
  AutoFixHigh,
  BarChart,
  Explore,
} from '@mui/icons-material';

const PROMPTS = [
  {
    icon: EditNote,
    title: 'Write content',
    subtitle: 'Blog posts, emails, marketing copy',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: Image,
    title: 'Generate images',
    subtitle: 'Art, photos, illustrations, logos',
    color: '#0A5E49',
    bg: '#E2F5EF',
  },
  {
    icon: Code,
    title: 'Write code',
    subtitle: 'Apps, scripts, debugging, reviews',
    color: '#7C3AED',
    bg: '#F3EEFF',
  },
  {
    icon: AutoFixHigh,
    title: 'Automate tasks',
    subtitle: 'Workflows, scheduling, agents',
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    icon: BarChart,
    title: 'Analyse data',
    subtitle: 'PDFs, spreadsheets, reports',
    color: '#9B2042',
    bg: '#FDEDF1',
  },
  {
    icon: Explore,
    title: 'Just exploring',
    subtitle: "Show me what AI can do",
    color: '#0A5E49',
    bg: '#E2F5EF',
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
        maxWidth: 640,
        mx: 'auto',
        width: '100%',
        animation: 'fadeUp 0.4s ease',
      }}
    >
      {/* Greeting */}
      <Typography
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: '2rem',
          color: 'var(--text)',
          textAlign: 'center',
          mb: 1,
          lineHeight: 1.2,
        }}
      >
        What would you like to explore?
      </Typography>

      <Typography
        sx={{
          fontSize: '1rem',
          color: 'var(--text2)',
          textAlign: 'center',
          mb: 4,
          lineHeight: 1.6,
          maxWidth: 480,
        }}
      >
        Choose a starting point below, or type anything in the chat to get started.
      </Typography>

      {/* 2x3 Grid of prompt cards */}
      <Grid container spacing={1.5} sx={{ width: '100%' }}>
        {PROMPTS.map(({ icon: Icon, title, subtitle, color, bg }) => (
          <Grid item xs={6} sm={4} key={title}>
            <Box
              onClick={() => onActionClick(title)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                p: 2,
                borderRadius: '12px',
                bgcolor: 'var(--card)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: 120,
                justifyContent: 'center',
                '&:hover': {
                  borderColor: color,
                  transform: 'translateY(-3px)',
                  boxShadow: `0 6px 16px ${color}18`,
                },
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  bgcolor: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon sx={{ fontSize: 22, color }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'var(--text3)',
                    lineHeight: 1.4,
                    mt: 0.25,
                  }}
                >
                  {subtitle}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
