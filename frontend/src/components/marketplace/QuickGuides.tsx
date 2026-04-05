'use client';

import { useState } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { QUICK_GUIDES } from '@/lib/quickGuides';

export default function QuickGuides() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
        {QUICK_GUIDES.map((guide) => {
          const isExpanded = expandedId === guide.id;
          return (
            <Box
              key={guide.id}
              sx={{
                bgcolor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'var(--accent-border)',
                },
              }}
            >
              <Box
                onClick={() => toggle(guide.id)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    bgcolor: guide.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  {guide.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: guide.color,
                      lineHeight: 1.3,
                      mb: 0.25,
                    }}
                  >
                    {guide.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: 'var(--text2)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {guide.description}
                  </Typography>
                </Box>
                <IconButton size="small" sx={{ mt: 0.5, color: 'var(--text3)' }}>
                  {isExpanded ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                </IconButton>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ px: 2, pb: 2, pt: 0 }}>
                  {guide.sections.map((section, i) => (
                    <Box key={i} sx={{ mb: i < guide.sections.length - 1 ? 2 : 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text)', mb: 0.75 }}>
                        {section.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.6, mb: 1 }}>
                        {section.content}
                      </Typography>
                      {section.tips && (
                        <Box sx={{ mb: 1 }}>
                          {section.tips.map((tip, j) => (
                            <Box key={j} sx={{ display: 'flex', gap: 0.75, mb: 0.5 }}>
                              <Typography sx={{ color: guide.color, fontSize: '0.75rem', lineHeight: 1.5 }}>
                                ✓
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                                {tip}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      {section.code && (
                        <Box
                          sx={{
                            bgcolor: '#1E1E2E',
                            borderRadius: '8px',
                            p: 1.5,
                            '& pre': {
                              margin: 0,
                              fontFamily: "'Fira Code', monospace",
                              fontSize: '0.6875rem',
                              lineHeight: 1.5,
                              color: '#CDD6F4',
                              whiteSpace: 'pre-wrap',
                            },
                          }}
                        >
                          <pre>{section.code}</pre>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
