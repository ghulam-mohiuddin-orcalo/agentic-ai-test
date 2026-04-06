'use client';

import { Box, Typography, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';

const SUGGESTED_QUESTIONS = [
  'What is the best AI model for coding?',
  'Compare GPT-5 vs Claude Opus 4.6',
  'Which free models support vision?',
  'Best model for document analysis?',
  'Cheapest model with 1M+ context?',
  'Which model is best for agents?',
];

export default function SuggestedQuestionsPanel() {
  const router = useRouter();

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
        Suggested questions
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        {SUGGESTED_QUESTIONS.map((question) => (
          <Chip
            key={question}
            label={question}
            onClick={() => router.push('/chat?q=' + encodeURIComponent(question))}
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
