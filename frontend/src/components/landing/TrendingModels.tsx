'use client';

import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import { TRENDING_MODELS } from '@/lib/constants';

export default function TrendingModels() {
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
          🔥 Trending This Week
        </Typography>
        <Box
          component="a"
          href="/discover"
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
          View research feed <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      </Box>

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
        {TRENDING_MODELS.map((model) => (
          <Box
            key={model.id}
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
                borderColor: (t: any) => t.palette.custom.border2,
              },
            }}
          >
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                px: 1,
                py: 0.375,
                borderRadius: '2rem',
                bgcolor: model.badgeColor + '1A',
                color: model.badgeColor,
                fontSize: '0.6875rem',
                fontWeight: 600,
                mb: 1.5,
              }}
            >
              {model.badge}
            </Box>

            {/* Icon + Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: model.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}
              >
                {model.icon}
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    mb: 0,
                  }}
                >
                  {model.name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
                  {model.org}
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Typography
              sx={{
                fontSize: '0.83rem',
                color: 'text.secondary',
                lineHeight: 1.55,
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {model.desc}
            </Typography>

            {/* Footer */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 1,
                borderTop: '1px solid',
                borderTopColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ fontSize: 13, color: (t: any) => t.palette.custom.star }} />
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.primary' }}>
                  {model.rating}
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: '0.78rem', fontWeight: 500, color: 'success.main' }}
              >
                {model.price}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
