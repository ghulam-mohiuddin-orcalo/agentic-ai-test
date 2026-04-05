'use client';

import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { USE_CASES } from '@/lib/constants';

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Language: { bg: '#EBF0FC', color: '#1E4DA8' },
  Vision: { bg: '#EBF0FC', color: '#1E4DA8' },
  Code: { bg: '#E2F5EF', color: '#0A5E49' },
  Audio: { bg: '#FDF5E0', color: '#8A5A00' },
  Analysis: { bg: '#E2F5EF', color: '#0A5E49' },
  'Open Source': { bg: '#E2F5EF', color: '#0A5E49' },
  Multilingual: { bg: '#FDF5E0', color: '#8A5A00' },
  Reasoning: { bg: '#FDEDF1', color: '#9B2042' },
  default: { bg: '#ECEAE4', color: '#5A5750' },
};

export default function UseCases() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '2rem' }}>
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.9rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
          }}
        >
          Quick-Start by Use Case
        </Typography>
        <Box
          component="a"
          href="/marketplace"
          sx={{
            fontSize: '0.85rem',
            color: 'primary.main',
            fontWeight: 500,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View all use cases <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {USE_CASES.map((uc, i) => (
          <Box
            key={i}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '20px',
              p: 2.5,
              cursor: 'pointer',
              transition: 'all 0.22s',
              boxShadow: 1,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 2,
                borderColor: (t: any) => t.palette.custom.accentBorder,
              },
            }}
          >
            <Box sx={{ fontSize: '2rem', mb: 1.5, display: 'block' }}>
              {uc.icon}
            </Box>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.95rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                mb: 1,
              }}
            >
              {uc.label}
            </Typography>

            {/* Model name chips */}
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
              {uc.models.slice(0, 3).map((modelName) => {
                const tc = TAG_COLORS[modelName] || TAG_COLORS.default;
                return (
                  <Box
                    key={modelName}
                    sx={{
                      px: 0.75,
                      py: 0.25,
                      borderRadius: '2rem',
                      bgcolor: tc.bg,
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: tc.color,
                    }}
                  >
                    {modelName}
                  </Box>
                );
              })}
            </Box>

            {/* Action link */}
            <Box
              component="a"
              href="/chat"
              sx={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'primary.main',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {uc.actionLabel} →
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
