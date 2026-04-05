'use client';

import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { BROWSE_BY_LAB_DATA } from '@/lib/constants';

export default function BrowseByLab() {
  const totalLabs = BROWSE_BY_LAB_DATA.length;

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
          Browse by AI Lab
        </Typography>
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
          See all labs <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {BROWSE_BY_LAB_DATA.map((lab) => (
          <Box
            key={lab.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.75,
              p: 2,
              borderRadius: '20px',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'all 0.22s',
              boxShadow: 1,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
                borderColor: (t: any) => t.palette.custom.border2,
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '11px',
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              {lab.icon}
            </Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                color: 'text.primary',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              {lab.name}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.625rem',
                color: 'text.disabled',
                lineHeight: 1.3,
                textAlign: 'center',
              }}
            >
              {lab.modelCount} models · {lab.upcoming}
            </Typography>
          </Box>
        ))}

        {/* All Labs card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.75,
            p: 2,
            borderRadius: '20px',
            bgcolor: 'primary.light',
            border: '1.5px dashed',
            borderColor: (t: any) => t.palette.custom.accentBorder,
            cursor: 'pointer',
            transition: 'all 0.22s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 2,
            },
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '11px',
              bgcolor: 'rgba(200,98,42,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.375rem',
            }}
          >
            🌐
          </Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              color: 'primary.main',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            All {totalLabs} Labs
          </Typography>
          <Typography
            sx={{
              fontSize: '0.625rem',
              color: 'primary.main',
              lineHeight: 1.3,
              textAlign: 'center',
              opacity: 0.7,
            }}
          >
            Explore all
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
