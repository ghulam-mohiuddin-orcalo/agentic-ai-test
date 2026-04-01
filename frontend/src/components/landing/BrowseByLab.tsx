'use client';

import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AI_LABS } from '@/lib/constants';

export default function BrowseByLab() {
  return (
    <Box sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
          Browse by AI Lab
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            fontSize: '0.875rem',
            '&:hover': { bgcolor: 'primary.light' },
          }}
          href="/marketplace"
        >
          All labs
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            sm: 'repeat(5, 1fr)',
            md: 'repeat(8, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {AI_LABS.map((lab) => (
          <Box
            key={lab.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
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
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: '0.6875rem',
                color: 'text.secondary',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              {lab.name.split(' ')[0]}
            </Typography>
          </Box>
        ))}

        {/* Browse All card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            p: 2,
            borderRadius: 2,
            bgcolor: 'primary.light',
            border: '1px solid',
            borderColor: 'rgba(200,98,42,0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
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
              borderRadius: '12px',
              bgcolor: 'rgba(200,98,42,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.375rem',
            }}
          >
            🌐
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              fontSize: '0.6875rem',
              color: 'primary.main',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            All 28 Labs
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
