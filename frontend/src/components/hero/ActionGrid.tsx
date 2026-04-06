'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Action {
  emoji: string;
  label: string;
}

const ACTIONS: Action[] = [
  { emoji: '🎨', label: 'Create image' },
  { emoji: '🎵', label: 'Generate Audio' },
  { emoji: '📝', label: 'Summarize text' },
  { emoji: '💻', label: 'Write code' },
  { emoji: '📊', label: 'Analyze data' },
  { emoji: '🌐', label: 'Translate' },
  { emoji: '🔍', label: 'Research topic' },
  { emoji: '✈️', label: 'Plan trip' },
  { emoji: '📧', label: 'Draft email' },
  { emoji: '🐛', label: 'Debug code' },
  { emoji: '🖌️', label: 'Design UI' },
  { emoji: '📖', label: 'Write story' },
  { emoji: '📚', label: 'Learn concept' },
  { emoji: '⚖️', label: 'Compare options' },
];

interface ActionGridProps {
  onActionClick?: (prompt: string) => void;
}

export default function ActionGrid({ onActionClick }: ActionGridProps) {
  const router = useRouter();
  return (
    <Box>
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontSize: { xs: '1.125rem', md: '1.25rem' },
          color: 'text.secondary',
        }}
      >
        Or try one of these
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(7, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {ACTIONS.map((action, index) => (
          <Paper
            key={index}
            onClick={() => {
              if (onActionClick) onActionClick(action.label);
              router.push('/chat?q=' + encodeURIComponent(action.label));
            }}
            sx={{
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: '1.75rem',
                mb: 0.5,
                display: 'block',
              }}
            >
              {action.emoji}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              {action.label}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
