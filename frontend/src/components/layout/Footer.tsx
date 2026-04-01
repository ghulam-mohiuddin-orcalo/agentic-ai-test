'use client';

import { Box, Container, Typography } from '@mui/material';

const FOOTER_LINKS = ['Models', 'Research', 'API', 'Privacy', 'Terms'];

export default function Footer() {
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
            NexusAI Model Marketplace
          </Typography>

          {/* Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {FOOTER_LINKS.map((link) => (
              <Typography
                key={link}
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: '#fff' },
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
