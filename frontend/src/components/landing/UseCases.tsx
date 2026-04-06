'use client';

import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { USE_CASES } from '@/lib/constants';

export default function UseCases() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
          {t('landing.useCases.title')}
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{ color: 'primary.main', fontWeight: 500, fontSize: '0.875rem', '&:hover': { bgcolor: 'primary.light' } }}
        >
          {t('landing.useCases.viewAll')}
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {USE_CASES.map((uc, i) => (
          <Box
            key={i}
            onClick={() => router.push('/chat?q=' + encodeURIComponent(uc.label))}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              p: 2.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-3px)',
                boxShadow: 2,
              },
            }}
          >
            <Typography sx={{ fontSize: '2rem', mb: 1.5, display: 'block' }}>
              {uc.icon}
            </Typography>
            <Typography variant="h4" sx={{ mb: 1, fontSize: '0.9375rem' }}>
              {uc.label}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
              {uc.tags.map((tag) => (
                <Box
                  key={tag}
                  sx={{
                    px: 0.75,
                    py: 0.25,
                    borderRadius: '2rem',
                    bgcolor: 'background.default',
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    color: 'text.secondary',
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {uc.action}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
