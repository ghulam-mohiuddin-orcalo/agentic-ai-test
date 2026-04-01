'use client';

import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function StatsBar() {
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
          525+
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          models
        </Typography>
      </Box>

      <Box sx={{ height: 20, bgcolor: 'divider' }} />

      {/* Labs */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexDirection: 'column' }}>
        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
          28
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          AI labs
        </Typography>
      </Box>

      <Box sx={{ height: 20, bgcolor: 'divider' }} />

      {/* Rating */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexDirection: 'column' }}>

        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
          4.8 <StarIcon sx={{ fontSize: 20, color: '#F5A623' }} />
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          rating
        </Typography>
      </Box>

      <Box sx={{ height: 20, bgcolor: 'divider' }} />

      {/* Users */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexDirection: 'column' }}>
        <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
          82K+
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          users
        </Typography>
      </Box>
    </Box>
  );
}
