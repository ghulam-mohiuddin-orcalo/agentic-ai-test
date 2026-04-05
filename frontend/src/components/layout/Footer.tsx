'use client';

import { Box, Container, Typography, Button, Link } from '@mui/material';
import { FOOTER_MODEL_CATALOG } from '@/lib/constants';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1C1A16',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">


        {/* Bottom bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
            &copy; {new Date().getFullYear()} NexusAI. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2.5 }}>
            {['Twitter', 'GitHub', 'Discord', 'LinkedIn'].map((social) => (
              <Typography
                key={social}
                sx={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: 'rgba(255,255,255,0.7)' },
                }}
              >
                {social}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
