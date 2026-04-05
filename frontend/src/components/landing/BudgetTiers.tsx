'use client';

import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { BUDGET_TIERS } from '@/lib/constants';

export default function BudgetTiers() {
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
          Find Models by Budget
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
          Explore pricing <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Box>
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
              bgcolor: 'background.paper',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'divider',
              borderLeft: `4px solid ${tier.color}`,
              p: 2.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 1,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 2,
                borderColor: (t: any) => t.palette.custom.border2,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ fontSize: '1.25rem' }}>{tier.icon}</Box>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: tier.color,
                }}
              >
                {tier.label}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mb: 1.5 }}>
              {tier.desc}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {tier.models.map((m) => (
                <Box key={m} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: tier.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {m}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              component="a"
              href="/marketplace"
              sx={{
                mt: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                color: tier.color,
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {tier.modelCount} models →
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
