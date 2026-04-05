'use client';

import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import { ModelData } from '@/components/models/ModelCard';

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Language: { bg: '#EBF0FC', color: '#1E4DA8' },
  Vision: { bg: '#EBF0FC', color: '#1E4DA8' },
  Code: { bg: '#E2F5EF', color: '#0A5E49' },
  Audio: { bg: '#FDF5E0', color: '#8A5A00' },
  Analysis: { bg: '#E2F5EF', color: '#0A5E49' },
  'Open Source': { bg: '#E2F5EF', color: '#0A5E49' },
  Multilingual: { bg: '#FDF5E0', color: '#8A5A00' },
  Reasoning: { bg: '#FDEDF1', color: '#9B2042' },
  Multimodal: { bg: '#FDF1EB', color: '#C8622A' },
  Fast: { bg: '#E2F5EF', color: '#0A5E49' },
  default: { bg: '#ECEAE4', color: '#5A5750' },
};

const BADGE_CONFIG = {
  hot: { label: '🔥 Hot', bg: 'linear-gradient(135deg, #FF6B6B, #FF4757)', color: '#fff' },
  new: { label: '✨ New', bg: '#E2F5EF', color: '#0A5E49' },
  open: { label: '🌐 Open', bg: '#EBF0FC', color: '#1E4DA8' },
};

interface Props {
  model: ModelData;
  onClick?: (model: ModelData) => void;
}

export default function MarketplaceModelCard({ model, onClick }: Props) {
  return (
    <Box
      onClick={() => onClick?.(model)}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '20px',
        p: 2,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        transition: 'all 0.22s',
        boxShadow: 1,
        '&:hover': {
          borderColor: (t) => t.palette.custom.border2,
          boxShadow: 2,
          transform: 'translateY(-3px)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: model.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              flexShrink: 0,
            }}
          >
            {model.icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'text.primary',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {model.name}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: 'text.disabled', lineHeight: 1.3 }}>
              {model.org}
            </Typography>
          </Box>
        </Box>
        {model.badge && (
          <Box
            sx={{
              px: 0.875,
              py: 0.25,
              borderRadius: '2rem',
              background: BADGE_CONFIG[model.badge].bg,
              color: BADGE_CONFIG[model.badge].color,
              fontSize: '0.625rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {BADGE_CONFIG[model.badge].label}
          </Box>
        )}
      </Box>

      {/* Description */}
      <Typography
        sx={{
          fontSize: '0.8125rem',
          color: 'text.secondary',
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {model.desc}
      </Typography>

      {/* Tags */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {model.tags.slice(0, 3).map((tag) => {
          const tc = TAG_COLORS[tag] ?? TAG_COLORS.default;
          return (
            <Box
              key={tag}
              sx={{
                px: 0.875,
                py: 0.25,
                borderRadius: '2rem',
                bgcolor: tc.bg,
                color: tc.color,
                fontSize: '0.625rem',
                fontWeight: 500,
              }}
            >
              {tag}
            </Box>
          );
        })}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 0.5,
          borderTop: '1px solid',
          borderTopColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.375 }}>
          <Star sx={{ fontSize: 12, color: (t: any) => t.palette.custom.star }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary' }}>
            {model.rating.toFixed(1)}
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.disabled' }}>
            ({model.reviews.toLocaleString()})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: model.price === 'Free' ? 'success.main' : 'text.primary',
            }}
          >
            {model.price}
          </Typography>
          <Box
            component="a"
            href="/chat"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            sx={{
              px: 1,
              py: 0.375,
              borderRadius: '6px',
              bgcolor: 'primary.main',
              color: '#fff',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            How to Use →
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
