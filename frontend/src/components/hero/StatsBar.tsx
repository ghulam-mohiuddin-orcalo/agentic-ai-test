'use client';

import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useTranslation } from 'react-i18next';

export default function StatsBar() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 3, md: 5 },
        px: { xs: 3, md: 5 },
        py: 2,
        flexWrap: 'wrap',
      }}
    >
      {/* Models */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexDirection: 'column' }}>
        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
          {t('home.stats.models')}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {t('home.stats.modelsLabel')}
        </Typography>
      </Box>

      <Box sx={{ width: '1px', height: 30, bgcolor: 'divider' }} />

      {/* Labs */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexDirection: 'column' }}>
        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
          {t('home.stats.labs')}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {t('home.stats.labsLabel')}
        </Typography>
      </Box>

      <Box sx={{ width: '1px', height: 30, bgcolor: 'divider' }} />

      {/* Rating */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexDirection: 'column' }}>

        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
          {t('home.stats.rating')} <StarIcon sx={{ fontSize: 20, color: '#F5A623' }} />
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {t('home.stats.ratingLabel')}
        </Typography>
      </Box>

      <Box sx={{ width: '1px', height: 30, bgcolor: 'divider' }} />

      {/* Users */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexDirection: 'column' }}>
        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
          {t('home.stats.users')}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {t('home.stats.usersLabel')}
        </Typography>
      </Box>
    </Box>
  );
}
