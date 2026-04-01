'use client';

import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FLAGSHIP_MODELS } from '@/lib/constants';

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  hot: { bg: 'linear-gradient(135deg,#FF6B6B,#FF4757)', color: '#fff' },
  new: { bg: '#E2F5EF', color: '#0A5E49' },
  open: { bg: '#EBF0FC', color: '#1E4DA8' },
};

export default function FlagshipComparison() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', mb: 0.5 }}>
            Flagship Model Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Side-by-side comparison of top models across key metrics
          </Typography>
        </Box>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{ color: 'primary.main', fontWeight: 500, fontSize: '0.875rem', '&:hover': { bgcolor: 'primary.light' } }}
          href="/marketplace"
        >
          Compare all
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {/* Table header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px',
            gap: 0,
            px: 2.5,
            py: 1.5,
            bgcolor: 'background.default',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {['Model', 'Context', 'Price /1M tk', 'Speed', 'Multimodal', 'Reasoning'].map((h) => (
            <Typography key={h} variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {h}
            </Typography>
          ))}
        </Box>

        {/* Table rows */}
        {FLAGSHIP_MODELS.map((model, i) => (
          <Box
            key={i}
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px',
              gap: 0,
              px: 2.5,
              py: 1.5,
              borderBottom: i < FLAGSHIP_MODELS.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'bgcolor 0.15s ease',
              '&:hover': { bgcolor: 'background.default' },
            }}
          >
            {/* Model name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: 'background.default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {model.icon}
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
                    {model.name}
                  </Typography>
                  {model.badge && (
                    <Box
                      sx={{
                        px: 0.75,
                        py: 0.125,
                        borderRadius: '2rem',
                        background: BADGE_STYLES[model.badge].bg,
                        color: BADGE_STYLES[model.badge].color,
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        lineHeight: 1.6,
                      }}
                    >
                      {model.badge === 'hot' ? '🔥 Hot' : model.badge === 'new' ? '✨ New' : '🌐 Open'}
                    </Box>
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">{model.org}</Typography>
              </Box>
            </Box>

            {/* Context */}
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
              {model.context}
            </Typography>

            {/* Price */}
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{
                fontSize: '0.8125rem',
                color: model.price === 'Free' ? 'success.main' : 'text.primary',
              }}
            >
              {model.price}
            </Typography>

            {/* Speed */}
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              {model.speed}
            </Typography>

            {/* Multimodal */}
            <Box>
              {model.multimodal
                ? <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                : <CancelIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              }
            </Box>

            {/* Reasoning */}
            <Box>
              {model.reasoning
                ? <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                : <CancelIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              }
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
