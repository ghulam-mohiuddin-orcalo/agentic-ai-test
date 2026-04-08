'use client';

import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BUILDER_FEATURES } from '@/lib/constants';

export default function BuiltForBuilders() {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: '1.5rem', mb: 1 }}>
        {t('landing.builders.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('landing.builders.subtitle')}
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
          <Box key={i}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                mb: 1.5,
              }}
            >
              {feature.icon}
            </Box>
            <Typography variant="h4" sx={{ mb: 0.75 }}>
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {feature.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
