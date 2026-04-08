'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Popover, Typography } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { SUPPORTED_LANGUAGES, persistLanguage } from '@/i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    persistLanguage(code);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size="small"
        sx={{
          textTransform: 'none',
          color: 'var(--text2)',
          fontSize: '0.8125rem',
          minWidth: 'auto',
          px: 1,
          '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
        }}
        endIcon={<KeyboardArrowDown sx={{ fontSize: '1rem !important' }} />}
      >
        {currentLang.nativeLabel}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              border: '1px solid var(--border)',
              minWidth: 160,
              p: 0.5,
            },
          },
        }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Typography
            key={lang.code}
            component="button"
            onClick={() => handleSelect(lang.code)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: '100%',
              px: 1.5,
              py: 1,
              borderRadius: '8px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              border: 'none',
              bgcolor: lang.code === i18n.language ? 'rgba(200,98,42,0.08)' : 'transparent',
              color: lang.code === i18n.language ? '#C8622A' : 'var(--text)',
              fontWeight: lang.code === i18n.language ? 600 : 400,
              textAlign: 'left',
              fontFamily: 'inherit',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: '0.75rem',
                color: 'var(--text3)',
                fontWeight: 500,
                minWidth: 28,
                textAlign: 'center',
                px: 0.5,
                py: 0.25,
                borderRadius: '4px',
                bgcolor: 'rgba(0,0,0,0.04)',
              }}
            >
              {lang.code.toUpperCase()}
            </Box>
            <span>{lang.nativeLabel}</span>
          </Typography>
        ))}
      </Popover>
    </>
  );
}
