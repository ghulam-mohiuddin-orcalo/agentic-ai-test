'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface Action {
  emoji: string;
  labelKey: string;
}

const ACTIONS: Action[] = [
  { emoji: '\uD83C\uDFA8', labelKey: 'home.actionGrid.createImage' },
  { emoji: '\uD83C\uDFB5', labelKey: 'home.actionGrid.generateAudio' },
  { emoji: '\uD83D\uDCDD', labelKey: 'home.actionGrid.summarizeText' },
  { emoji: '\uD83D\uDCBB', labelKey: 'home.actionGrid.writeCode' },
  { emoji: '\uD83D\uDCCA', labelKey: 'home.actionGrid.analyzeData' },
  { emoji: '\uD83C\uDF10', labelKey: 'home.actionGrid.translate' },
  { emoji: '\uD83D\uDD0D', labelKey: 'home.actionGrid.researchTopic' },
  { emoji: '\u2708\uFE0F', labelKey: 'home.actionGrid.planTrip' },
  { emoji: '\uD83D\uDCE7', labelKey: 'home.actionGrid.draftEmail' },
  { emoji: '\uD83D\uDC1B', labelKey: 'home.actionGrid.debugCode' },
  { emoji: '\uD83D\uDD8C\uFE0F', labelKey: 'home.actionGrid.designUI' },
  { emoji: '\uD83D\uDCD6', labelKey: 'home.actionGrid.writeStory' },
  { emoji: '\uD83D\uDCDA', labelKey: 'home.actionGrid.learnConcept' },
  { emoji: '\u2696\uFE0F', labelKey: 'home.actionGrid.compareOptions' },
];

interface ActionGridProps {
  onActionClick?: (prompt: string) => void;
}

export default function ActionGrid({ onActionClick }: ActionGridProps) {
  const router = useRouter();
  const { t } = useTranslation();

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
        {t('home.actionGrid.title')}
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
              const label = t(action.labelKey);
              if (onActionClick) onActionClick(label);
              router.push('/chat?q=' + encodeURIComponent(label));
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
              {t(action.labelKey)}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
