'use client';

import { Box, Typography, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const SUGGESTION_KEYS = [
  'home.suggestedQuestions.q1',
  'home.suggestedQuestions.q2',
  'home.suggestedQuestions.q3',
  'home.suggestedQuestions.q4',
  'home.suggestedQuestions.q5',
  'home.suggestedQuestions.q6',
];

export default function SuggestedQuestionsPanel() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="body2"
        sx={{
          mb: 1.5,
          color: 'text.secondary',
          fontSize: '0.8125rem',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {t('home.suggestedQuestions.title')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        {SUGGESTION_KEYS.map((key) => (
          <Chip
            key={key}
            label={t(key)}
            onClick={() => router.push('/chat?q=' + encodeURIComponent(t(key)))}
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              borderColor: 'divider',
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'rgba(200,98,42,0.04)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
