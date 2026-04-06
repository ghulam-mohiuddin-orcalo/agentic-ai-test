'use client';

import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';

export default function NewsletterCTA() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        bgcolor: '#1C1A16',
        color: '#fff',
        textAlign: 'center',
        py: { xs: 7, md: 9 },
        px: { xs: 3, md: 4 },
        // Full-width bleed — handled by removing Container in page.tsx for this section
      }}
    >
      {/* Tag */}
      <Box
        sx={{
          display: 'inline-block',
          px: 1.75,
          py: 0.5,
          mb: 3,
          borderRadius: '2rem',
          bgcolor: 'rgba(200,98,42,0.18)',
          border: '1px solid rgba(200,98,42,0.35)',
          color: '#C8622A',
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {t('landing.newsletter.title')}
      </Box>

      {/* Heading */}
      <Typography
        variant="h2"
        sx={{
          color: '#fff',
          fontSize: { xs: '2rem', md: '2.75rem' },
          lineHeight: 1.15,
          mb: 2,
          fontWeight: 700,
        }}
      >
        {t('landing.newsletter.subtitle1')}
        <br />
        {t('landing.newsletter.subtitle2')}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255,255,255,0.55)',
          mb: 4,
          maxWidth: 520,
          mx: 'auto',
          lineHeight: 1.65,
          fontSize: '0.9375rem',
        }}
      >
        {t('landing.newsletter.description')}
      </Typography>

      {/* Form */}
      <Box
        component="form"
        sx={{
          display: 'flex',
          gap: 0,
          maxWidth: 480,
          mx: 'auto',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.15)',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <TextField
          type="email"
          placeholder={t('landing.newsletter.emailPlaceholder')}
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255,255,255,0.06)',
              borderRadius: { xs: '12px 12px 0 0', sm: '12px 0 0 12px' },
              color: '#fff',
              height: 50,
              '& fieldset': { border: 'none' },
            },
            '& .MuiOutlinedInput-input': {
              px: 2,
              py: 1.5,
              fontSize: '0.9375rem',
              '&::placeholder': {
                color: 'rgba(255,255,255,0.35)',
                opacity: 1,
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />}
          sx={{
            whiteSpace: 'nowrap',
            px: 3,
            py: 1.5,
            fontSize: '0.9375rem',
            fontWeight: 600,
            borderRadius: { xs: '0 0 12px 12px', sm: '0 12px 12px 0' },
            flexShrink: 0,
            height: 50,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              transform: 'none',
              bgcolor: 'primary.dark',
            },
          }}
        >
          {t('landing.newsletter.subscribe')}
        </Button>
      </Box>

      {/* Trust line */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 2,
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.8125rem',
        }}
      >
        {t('landing.newsletter.disclaimer')}
      </Typography>
    </Box>
  );
}
