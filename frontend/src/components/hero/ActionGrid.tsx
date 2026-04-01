'use client';

import { Box, Paper, Typography } from '@mui/material';

interface Action {
  emoji: string;
  label: string;
  prompt: string;
}

const ACTIONS: Action[] = [
  {
    emoji: '✍️',
    label: 'Write an article',
    prompt: 'Help me write a professional article about',
  },
  {
    emoji: '💻',
    label: 'Debug code',
    prompt: 'Help me debug this code:',
  },
  {
    emoji: '🎨',
    label: 'Generate image',
    prompt: 'Create an image of',
  },
  {
    emoji: '📊',
    label: 'Analyze data',
    prompt: 'Analyze this data and provide insights:',
  },
  {
    emoji: '🔍',
    label: 'Research topic',
    prompt: 'Research and summarize information about',
  },
  {
    emoji: '💡',
    label: 'Brainstorm ideas',
    prompt: 'Help me brainstorm ideas for',
  },
  {
    emoji: '📝',
    label: 'Summarize text',
    prompt: 'Summarize this text:',
  },
  {
    emoji: '🌐',
    label: 'Translate',
    prompt: 'Translate this to',
  },
  {
    emoji: '🎯',
    label: 'Create plan',
    prompt: 'Create a detailed plan for',
  },
  {
    emoji: '📧',
    label: 'Write email',
    prompt: 'Help me write a professional email about',
  },
  {
    emoji: '🤖',
    label: 'Build agent',
    prompt: 'Help me build an AI agent that can',
  },
  {
    emoji: '📚',
    label: 'Explain concept',
    prompt: 'Explain this concept in simple terms:',
  },
  {
    emoji: '🔧',
    label: 'Fix bug',
    prompt: 'Help me fix this bug:',
  },
  {
    emoji: '🎓',
    label: 'Learn skill',
    prompt: 'Teach me how to',
  },
];

interface ActionGridProps {
  onActionClick: (prompt: string) => void;
}

export default function ActionGrid({ onActionClick }: ActionGridProps) {
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
            onClick={() => onActionClick(action.prompt)}
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
