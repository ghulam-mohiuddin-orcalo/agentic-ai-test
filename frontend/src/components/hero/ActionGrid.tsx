'use client';

import { Box, Typography } from '@mui/material';

interface Action {
  emoji: string;
  label: string;
  prompt: string;
}

const ACTIONS: Action[] = [
  { emoji: '🎨', label: 'Create image', prompt: 'Create an image of' },
  { emoji: '🎵', label: 'Generate Audio', prompt: 'Generate audio for' },
  { emoji: '🎬', label: 'Create video', prompt: 'Create a video of' },
  { emoji: '📊', label: 'Create slides', prompt: 'Create a presentation about' },
  { emoji: '📈', label: 'Create Infographs', prompt: 'Create an infographic about' },
  { emoji: '❓', label: 'Create quiz', prompt: 'Create a quiz about' },
  { emoji: '🗂️', label: 'Create Flashcards', prompt: 'Create flashcards for' },
  { emoji: '🧠', label: 'Create Mind map', prompt: 'Create a mind map for' },
  { emoji: '📉', label: 'Analyze Data', prompt: 'Analyze this data:' },
  { emoji: '✍️', label: 'Write content', prompt: 'Write content about' },
  { emoji: '💻', label: 'Code Generation', prompt: 'Generate code for' },
  { emoji: '📄', label: 'Document Analysis', prompt: 'Analyze this document:' },
  { emoji: '🌐', label: 'Translate', prompt: 'Translate this to' },
  { emoji: '🔭', label: 'Just Exploring', prompt: 'I want to explore what AI can do' },
];

interface ActionGridProps {
  onActionClick: (prompt: string) => void;
}

export default function ActionGrid({ onActionClick }: ActionGridProps) {
  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(4, 1fr)',
            sm: 'repeat(7, 1fr)',
          },
          gap: '10px',
          maxWidth: 900,
          mx: 'auto',
          px: 1,
        }}
      >
        {ACTIONS.map((action, index) => {
          const isLast = index === ACTIONS.length - 1;
          return (
            <Box
              key={index}
              onClick={() => onActionClick(action.prompt)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                bgcolor: isLast ? 'background.default' : 'background.paper',
                border: isLast ? '1.5px dashed' : '1.5px solid',
                borderColor: (t) => t.palette.custom.border2,
                borderRadius: '20px',
                p: '0.85rem 0.6rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: isLast ? 0 : 1,
                '&:hover': {
                  bgcolor: 'primary.light',
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 18px rgba(200,98,42,0.14)',
                  '& .action-label': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <Box sx={{ fontSize: '1.4rem', lineHeight: 1 }}>
                {action.emoji}
              </Box>
              <Box
                className="action-label"
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  transition: 'color 0.15s',
                }}
              >
                {action.label}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
