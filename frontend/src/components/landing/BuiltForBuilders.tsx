'use client';

import { Box, Typography } from '@mui/material';
import { BUILDER_FEATURES } from '@/lib/constants';

export default function BuiltForBuilders() {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '1.9rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          mb: 1,
        }}
      >
        Built for every builder
      </Typography>
      <Typography sx={{ fontSize: '0.95rem', color: 'text.secondary', mb: '2rem' }}>
        Whether you're a solo developer or enterprise team
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2.5,
        }}
      >
        {BUILDER_FEATURES.map((feature, i) => (
          <Box
            key={i}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '20px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.22s',
              boxShadow: 1,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 2,
                borderColor: (t: any) => t.palette.custom.border2,
              },
            }}
          >
            <Box sx={{ fontSize: '2rem', mb: 1.25, display: 'block' }}>
              {feature.icon}
            </Box>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                mb: 0.5,
              }}
            >
              {feature.title}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.83rem',
                color: 'text.secondary',
                lineHeight: 1.55,
              }}
            >
              {feature.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
