'use client';

import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import ModelCard from '@/components/models/ModelCard';
import { FEATURED_MODELS } from '@/lib/constants';

export default function FeaturedModels() {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 6 }}>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
          {t('landing.featured.title')}
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            fontSize: '0.875rem',
            '&:hover': { bgcolor: 'primary.light' },
          }}
          href="/marketplace"
        >
          {t('landing.featured.viewAll')}
        </Button>
      </Box>

      {/* Model Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {FEATURED_MODELS.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </Box>
    </Box>
  );
}
