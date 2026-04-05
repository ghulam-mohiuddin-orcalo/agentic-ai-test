'use client';

import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const STATS = [
  { value: '525+', label: 'AI Models' },
  { value: '82K', label: 'Builders' },
  { value: '28', label: 'AI Labs' },
  { value: '4.8', label: 'Avg Rating', hasIcon: true },
];

export default function StatsBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 0, md: 0 },
        py: 2,
        flexWrap: 'wrap',
      }}
    >
      {STATS.map((stat, i) => (
        <Box
          key={stat.label}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 2, md: 3 },
            '&:not(:last-child)::after': {
              content: '""',
              display: { xs: 'none', md: 'block' },
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: 'text.disabled',
              opacity: 0.5,
              mx: { xs: 2, md: 3 },
            },
          }}
        >
          <Box sx={{ textAlign: 'center', px: { xs: 2, md: 3 } }}>
            <Typography
              sx={{
                display: 'block',
                fontFamily: "'Syne', sans-serif",
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              {stat.value}
              {stat.hasIcon && (
                <StarIcon
                  sx={{
                    fontSize: 18,
                    color: (t) => t.palette.custom.star,
                    verticalAlign: 'middle',
                    ml: 0.5,
                    mb: '-2px',
                  }}
                />
              )}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.78rem',
                color: 'text.disabled',
                mt: 0.25,
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
