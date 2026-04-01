'use client';

import { Box, Card, CardContent, Typography, Chip, Rating } from '@mui/material';
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
}

export default function ModelCard({ model, onClick }: ModelCardProps) {
  return (
    <Card
      onClick={() => onClick?.(model)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
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
              <Typography variant="h4" sx={{ lineHeight: 1.2, mb: 0.25 }}>
                {model.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
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
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon sx={{ fontSize: 14, color: '#F5A623' }} />
            <Typography variant="caption" fontWeight={600} sx={{ color: 'text.primary' }}>
              {model.rating.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({model.reviews.toLocaleString()})
            </Typography>
          </Box>
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{ color: model.price === 'Free' ? 'success.main' : 'text.primary' }}
          >
            {model.price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
