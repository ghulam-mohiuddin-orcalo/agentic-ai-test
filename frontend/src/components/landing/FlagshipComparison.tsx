'use client';

import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FLAGSHIP_MODELS, SpeedType } from '@/lib/constants';

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  hot: { bg: 'linear-gradient(135deg,#FF6B6B,#FF4757)', color: '#fff' },
  new: { bg: '#E2F5EF', color: '#0A5E49' },
  open: { bg: '#EBF0FC', color: '#1E4DA8' },
};

const SPEED_CONFIG: Record<SpeedType, { color: string; label: string }> = {
  fastest: { color: '#0A5E49', label: 'Fastest' },
  fast: { color: '#1E4DA8', label: 'Fast' },
  moderate: { color: '#8A5A00', label: 'Moderate' },
  slow: { color: '#9B2042', label: 'Slow' },
};

const COLUMNS = '2fr 1fr 1fr 1fr 1fr 80px 1fr 1.5fr';

export default function FlagshipComparison() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '2rem' }}>
        <Box>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.9rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              mb: 0.5,
            }}
          >
            Flagship Model Comparison
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
            Side-by-side view of the leading models across all major labs. Input/Output prices per 1M tokens.
          </Typography>
        </Box>
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
          Compare all <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '20px',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          boxShadow: 1,
        }}
      >
        {/* Horizontally scrollable container for mobile */}
        <Box sx={{ overflowX: 'auto' }}>
          {/* Table header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: COLUMNS,
              gap: 0,
              px: 2.5,
              py: 1.5,
              bgcolor: 'background.default',
              borderBottom: '1px solid',
              borderColor: 'divider',
              minWidth: 900,
            }}
          >
            {['Model', 'Lab', 'Context', 'Input $/1M', 'Output $/1M', 'Multimodal', 'Speed', 'Best For'].map((h) => (
              <Typography key={h} variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {h}
              </Typography>
            ))}
          </Box>

          {/* Table rows */}
          {FLAGSHIP_MODELS.map((model, i) => {
            const speedCfg = SPEED_CONFIG[model.speed];
            return (
              <Box
                key={i}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: COLUMNS,
                  gap: 0,
                  px: 2.5,
                  py: 1.5,
                  borderBottom: i < FLAGSHIP_MODELS.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'bgcolor 0.15s ease',
                  '&:hover': { bgcolor: 'background.default' },
                  minWidth: 900,
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

                {/* Lab */}
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                  {model.lab}
                </Typography>

                {/* Context */}
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                  {model.context}
                </Typography>

                {/* Input Price */}
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    fontSize: '0.8125rem',
                    color: model.inputPrice === 'Free' ? 'success.main' : 'text.primary',
                  }}
                >
                  {model.inputPrice}
                </Typography>

                {/* Output Price */}
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    fontSize: '0.8125rem',
                    color: model.outputPrice === 'Free' ? 'success.main' : 'text.primary',
                  }}
                >
                  {model.outputPrice}
                </Typography>

                {/* Multimodal */}
                <Box>
                  {model.multimodal
                    ? <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                    : <CancelIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  }
                </Box>

                {/* Speed dot + label */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: speedCfg.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                    {speedCfg.label}
                  </Typography>
                </Box>

                {/* Best For */}
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                  {model.bestFor}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Footnote */}
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ display: 'block', mt: 1.5, px: 0.5, fontSize: '0.6875rem', lineHeight: 1.5 }}
      >
        Prices shown are approximate. Free self-hosted models exclude infrastructure costs. Beta pricing may change.
      </Typography>
    </Box>
  );
}
