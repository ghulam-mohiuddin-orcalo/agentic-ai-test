'use client';

import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export interface ModelData {
  id: string;
  icon: string;
  bg: string;
  name: string;
  lab: string;
  org: string;
  desc: string;
  tags: string[];
  badge?: 'hot' | 'new' | 'open' | null;
  rating: number;
  reviews: number;
  price: string;
  priceStart: number;
  types: string[];
}

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Language: { bg: '#EBF0FC', color: '#1E4DA8' },
  Vision: { bg: '#EBF0FC', color: '#1E4DA8' },
  Code: { bg: '#E2F5EF', color: '#0A5E49' },
  Audio: { bg: '#FDF5E0', color: '#8A5A00' },
  Analysis: { bg: '#E2F5EF', color: '#0A5E49' },
  'Open Source': { bg: '#E2F5EF', color: '#0A5E49' },
  Multilingual: { bg: '#FDF5E0', color: '#8A5A00' },
  default: { bg: '#ECEAE4', color: '#5A5750' },
};

const BADGE_CONFIG = {
  hot: { label: '🔥 Hot', bg: 'linear-gradient(135deg, #FF6B6B, #FF4757)', color: '#fff' },
  new: { label: '✨ New', bg: '#E2F5EF', color: '#0A5E49' },
  open: { label: '🌐 Open', bg: '#EBF0FC', color: '#1E4DA8' },
};

interface ModelCardProps {
  model: ModelData;
  onClick?: (model: ModelData) => void;
  variant?: 'default' | 'compact';
}

function CompactModelCard({ model, onClick }: Omit<ModelCardProps, 'variant'>) {
  return (
    <Box
      onClick={() => onClick?.(model)}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '20px',
        p: 1.5,
        cursor: 'pointer',
        transition: 'all 0.22s',
        boxShadow: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 2,
          borderColor: (t) => t.palette.custom.border2,
        },
      }}
    >
      {/* Header row: icon + name/org + badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          <Box>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.9375rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                mb: 0.125,
              }}
            >
              {model.name}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: 'text.disabled' }}>
              {model.org}
            </Typography>
          </Box>
        </Box>
        {model.badge && (
          <Box
            sx={{
              px: 0.75,
              py: 0.25,
              borderRadius: '2rem',
              background: BADGE_CONFIG[model.badge].bg,
              color: BADGE_CONFIG[model.badge].color,
              fontSize: '0.625rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {BADGE_CONFIG[model.badge].label}
          </Box>
        )}
      </Box>

      {/* Tags as small chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.375, mb: 1 }}>
        {model.tags.map((tag) => {
          const tc = TAG_COLORS[tag] || TAG_COLORS.default;
          return (
            <Box
              key={tag}
              sx={{
                px: 0.75,
                py: 0.125,
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

      {/* Footer: price + try button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: model.price.toLowerCase().includes('free') ? 'success.main' : 'text.primary',
          }}
        >
          {model.price}
        </Typography>
        <Box
          component="a"
          href="/chat"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'primary.main',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Try →
        </Box>
      </Box>
    </Box>
  );
}

export default function ModelCard({ model, onClick, variant = 'default' }: ModelCardProps) {
  if (variant === 'compact') {
    return <CompactModelCard model={model} onClick={onClick} />;
  }

  return (
    <Box
      onClick={() => onClick?.(model)}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '20px',
        p: 2.5,
        cursor: 'pointer',
        transition: 'all 0.22s',
        boxShadow: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 2,
          borderColor: (t) => t.palette.custom.border2,
        },
      }}
    >
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '11px',
              bgcolor: model.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.375rem',
              flexShrink: 0,
            }}
          >
            {model.icon}
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                mb: 0.25,
              }}
            >
              {model.name}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
              {model.org}
            </Typography>
          </Box>
        </Box>
        {model.badge && (
          <Box
            sx={{
              px: 1,
              py: 0.375,
              borderRadius: '2rem',
              background: BADGE_CONFIG[model.badge].bg,
              color: BADGE_CONFIG[model.badge].color,
              fontSize: '0.6875rem',
              fontWeight: 600,
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

      {/* Tags */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
        {model.tags.map((tag) => {
          const tc = TAG_COLORS[tag] || TAG_COLORS.default;
          return (
            <Box
              key={tag}
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '2rem',
                bgcolor: tc.bg,
                color: tc.color,
                fontSize: '0.6875rem',
                fontWeight: 500,
              }}
            >
              {tag}
            </Box>
          );
        })}
      </Box>

      {/* Footer row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 1,
          borderTop: '1px solid',
          borderTopColor: 'divider',
          mt: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StarIcon sx={{ fontSize: 14, color: (t: any) => t.palette.custom.star }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.primary' }}>
            {model.rating.toFixed(1)}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
            ({model.reviews.toLocaleString()})
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '0.78rem',
            fontWeight: 500,
            color: model.price === 'Free' ? 'success.main' : 'text.primary',
          }}
        >
          {model.price}
        </Typography>
      </Box>
    </Box>
  );
}
