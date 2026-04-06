'use client';

import { Box, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

const AGENTS = [
  { emoji: '💻', name: 'Code Assistant', desc: 'Write, debug, and review code' },
  { emoji: '📝', name: 'Content Writer', desc: 'Articles, blogs, and copy' },
  { emoji: '📊', name: 'Data Analyst', desc: 'Analyze and visualize data' },
  { emoji: '🔬', name: 'Research Agent', desc: 'Deep research and summaries' },
];

export default function AgentPanel() {
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
        Popular agents
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
            key={agent.name}
            onClick={() => router.push('/agents?template=' + encodeURIComponent(agent.name))}
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
              {agent.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: 'block', fontSize: '0.625rem', color: 'text.secondary', mt: 0.25 }}
            >
              {agent.desc}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
