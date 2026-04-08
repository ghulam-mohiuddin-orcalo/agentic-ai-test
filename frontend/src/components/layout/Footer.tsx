'use client';

import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const FOOTER_LINKS = [
  { labelKey: 'footer.models', href: '/marketplace' },
  { labelKey: 'footer.research', href: '/discover' },
  { labelKey: 'footer.api', href: '/chat' },
  { labelKey: 'footer.privacy', href: '#' },
  { labelKey: 'footer.terms', href: '#' },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1C1A16',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        py: 2.25,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          {/* Brand */}
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            {t('footer.brand')}
          </Typography>

          {/* Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {FOOTER_LINKS.map((link) => (
              <Typography
                key={link.labelKey}
                component={Link}
                href={link.href}
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: '#fff' },
                }}
              >
                {t(link.labelKey)}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
