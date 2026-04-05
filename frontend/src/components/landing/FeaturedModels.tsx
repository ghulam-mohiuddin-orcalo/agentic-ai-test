'use client';

import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ModelCard from '@/components/models/ModelCard';
import { FEATURED_MODELS } from '@/lib/constants';

export default function FeaturedModels() {
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
          Featured Models
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
          Browse all 525 <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {FEATURED_MODELS.map((model) => (
          <ModelCard key={model.id} model={model} variant="compact" />
        ))}
      </Box>
    </Box>
  );
}
