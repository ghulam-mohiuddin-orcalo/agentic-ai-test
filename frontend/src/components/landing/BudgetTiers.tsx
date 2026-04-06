'use client';

import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { BUDGET_TIERS } from '@/lib/constants';

export default function BudgetTiers() {
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
          {t('landing.budget.title')}
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{ color: 'primary.main', fontWeight: 500, fontSize: '0.875rem', '&:hover': { bgcolor: 'primary.light' } }}
          href="/marketplace"
        >
          {t('landing.budget.explorePricing')}
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {BUDGET_TIERS.map((tier, i) => (
          <Box
            key={i}
            sx={{
              bgcolor: tier.bg,
              borderRadius: 3,
              border: '1px solid',
              borderColor: tier.color + '33',
              p: 2.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 2,
              },
            }}
          >
            <Box
              sx={{
                fontSize: '1.75rem',
                mb: 1,
                display: 'block',
              }}
            >
              {tier.icon}
            </Box>
            <Typography variant="h4" sx={{ color: tier.color, mb: 0.5 }}>
              {tier.label}
            </Typography>
            <Typography variant="caption" sx={{ color: tier.color + 'CC', display: 'block', mb: 2 }}>
              {tier.desc}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {tier.models.map((m) => (
                <Box
                  key={m}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: tier.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: tier.color, fontWeight: 500 }}>
                    {m}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
