'use client';

import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import { TRENDING_MODELS } from '@/lib/constants';

export default function TrendingModels() {
  return (
    <Box sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
          🔥 Trending This Week
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{ color: 'primary.main', fontWeight: 500, fontSize: '0.875rem', '&:hover': { bgcolor: 'primary.light' } }}
        >
          See all
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: 2,
        }}
      >
        {TRENDING_MODELS.map((model) => (
          <Box
            key={model.id}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              p: 2.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
                borderColor: 'rgba(200,98,42,0.2)',
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
                <Typography variant="h4" sx={{ fontSize: '0.9375rem', mb: 0 }}>
                  {model.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {model.org}
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '0.8125rem',
              }}
            >
              {model.desc}
            </Typography>

            {/* Footer */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ fontSize: 13, color: '#F5A623' }} />
                <Typography variant="caption" fontWeight={600}>{model.rating}</Typography>
              </Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                {model.price}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
