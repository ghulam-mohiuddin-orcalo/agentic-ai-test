'use client';

import { Box, Typography, Grid } from '@mui/material';
import {
  EditNote,
  Image,
  Construction,
  AutoFixHigh,
  BarChart,
  Explore,
  ChatBubbleOutline,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const PROMPTS = [
  {
    icon: EditNote,
    titleKey: 'chat.welcome.writeContent',
    subtitleKey: 'chat.welcome.writeContentDesc',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: Image,
    titleKey: 'chat.welcome.createImages',
    subtitleKey: 'chat.welcome.createImagesDesc',
    color: '#0A5E49',
    bg: '#E2F5EF',
  },
  {
    icon: Construction,
    titleKey: 'chat.welcome.buildSomething',
    subtitleKey: 'chat.welcome.buildSomethingDesc',
    color: '#7C3AED',
    bg: '#F3EEFF',
  },
  {
    icon: AutoFixHigh,
    titleKey: 'chat.welcome.automateWork',
    subtitleKey: 'chat.welcome.automateWorkDesc',
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    icon: BarChart,
    titleKey: 'chat.welcome.analyseData',
    subtitleKey: 'chat.welcome.analyseDataDesc',
    color: '#9B2042',
    bg: '#FDEDF1',
  },
  {
    icon: Explore,
    titleKey: 'chat.welcome.justExploring',
    subtitleKey: 'chat.welcome.justExploringDesc',
    color: '#0891B2',
    bg: '#E0F7FA',
  },
];

const SUGGESTION_KEYS = [
  'chat.welcome.prompt1',
  'chat.welcome.prompt2',
  'chat.welcome.prompt3',
  'chat.welcome.prompt4',
  'chat.welcome.prompt5',
  'chat.welcome.prompt6',
];

interface WelcomeScreenProps {
  onActionClick: (title: string) => void;
}

export default function WelcomeScreen({ onActionClick }: WelcomeScreenProps) {
  const { t } = useTranslation();

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
        maxWidth: 680,
        mx: 'auto',
        width: '100%',
        animation: 'fadeUp 0.4s ease',
      }}
    >
      {/* Chat bubble icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '14px',
          bgcolor: 'var(--bg2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <ChatBubbleOutline sx={{ fontSize: 24, color: 'var(--text3)' }} />
      </Box>

      {/* Heading */}
      <Typography
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: '1.75rem',
          color: 'var(--text)',
          textAlign: 'center',
          mb: 1,
          lineHeight: 1.2,
        }}
      >
        {t('chat.welcome.title')}{' '}
        <Box component="span" sx={{ fontSize: '1.6rem' }}>
          {'\uD83D\uDC4B'}
        </Box>
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          fontSize: '0.9375rem',
          color: 'var(--text2)',
          textAlign: 'center',
          mb: 3.5,
          lineHeight: 1.6,
          maxWidth: 500,
        }}
      >
        {t('chat.welcome.subtitle')}
      </Typography>

      {/* Section label */}
      <Typography
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: 'var(--text3)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          mb: 2,
        }}
      >
        {t('chat.welcome.question')}
      </Typography>

      {/* 3x2 Grid of cards */}
      <Grid container spacing={1.5} sx={{ width: '100%', mb: 3 }}>
        {PROMPTS.map(({ icon: Icon, titleKey, subtitleKey, color, bg }) => (
          <Grid item xs={6} sm={4} key={titleKey}>
            <Box
              onClick={() => onActionClick(t(titleKey))}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.75,
                p: 2,
                borderRadius: '12px',
                bgcolor: 'var(--card)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: 100,
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
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  bgcolor: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon sx={{ fontSize: 20, color }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    lineHeight: 1.2,
                  }}
                >
                  {t(titleKey)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    color: 'var(--text3)',
                    lineHeight: 1.4,
                    mt: 0.25,
                  }}
                >
                  {t(subtitleKey)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Footer text */}
      <Typography
        sx={{
          fontSize: '0.8125rem',
          color: 'var(--text3)',
          textAlign: 'center',
          mb: 2.5,
        }}
      >
        {t('chat.welcome.orType')}{' '}
        <Box component="span" sx={{ fontSize: '0.9rem' }}>{'\u2728'}</Box>
      </Typography>

      {/* Suggestion chips */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          width: '100%',
        }}
      >
        {SUGGESTION_KEYS.map((key, idx) => (
          <Box
            key={idx}
            onClick={() => onActionClick(t(key))}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.875,
              borderRadius: '10px',
              bgcolor: 'var(--card)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                borderColor: 'var(--accent)',
                bgcolor: 'var(--accent-lt)',
              },
            }}
          >
            <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>
              {'\u2022'}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: 'var(--text2)',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {t(key)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
