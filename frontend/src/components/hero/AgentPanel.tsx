'use client';

import { Box, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const AGENTS = [
  { emoji: '\uD83D\uDCBB', nameKey: 'home.agentPanel.codeAssistant', descKey: 'home.agentPanel.codeAssistantDesc' },
  { emoji: '\uD83D\uDCDD', nameKey: 'home.agentPanel.contentWriter', descKey: 'home.agentPanel.contentWriterDesc' },
  { emoji: '\uD83D\uDCCA', nameKey: 'home.agentPanel.dataAnalyst', descKey: 'home.agentPanel.dataAnalystDesc' },
  { emoji: '\uD83D\uDD2C', nameKey: 'home.agentPanel.researchAgent', descKey: 'home.agentPanel.researchAgentDesc' },
];

export default function AgentPanel() {
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
        {t('home.agentPanel.title')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: 1.5,
        }}
      >
        {AGENTS.map((agent) => (
          <Paper
            key={agent.nameKey}
            onClick={() => router.push('/agents?template=' + encodeURIComponent(t(agent.nameKey)))}
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
            <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{agent.emoji}</Typography>
            <Typography
              variant="caption"
              sx={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: 'text.primary' }}
            >
              {t(agent.nameKey)}
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: 'block', fontSize: '0.625rem', color: 'text.secondary', mt: 0.25 }}
            >
              {t(agent.descKey)}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
