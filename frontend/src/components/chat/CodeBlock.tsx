'use client';

import { useState, useCallback } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';

interface CodeBlockProps {
  language?: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <Box
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        my: 1.5,
        border: '1px solid var(--border2)',
        bgcolor: '#1e1e2e',
      }}
    >
      {/* Header bar with language + copy */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 0.75,
          bgcolor: 'rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {language || 'code'}
        </Typography>
        <Tooltip title={copied ? 'Copied!' : 'Copy code'} arrow placement="top">
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{
              color: copied ? '#4CAF50' : 'rgba(255,255,255,0.5)',
              '&:hover': { color: copied ? '#4CAF50' : 'rgba(255,255,255,0.8)' },
              p: 0.5,
            }}
          >
            {copied ? <Check sx={{ fontSize: 16 }} /> : <ContentCopy sx={{ fontSize: 16 }} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Code content */}
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: 2,
          },
        }}
      >
        <Typography
          component="code"
          sx={{
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace",
            fontSize: '0.8125rem',
            lineHeight: 1.7,
            color: '#cdd6f4',
            whiteSpace: 'pre',
            display: 'block',
          }}
        >
          {code}
        </Typography>
      </Box>
    </Box>
  );
}
