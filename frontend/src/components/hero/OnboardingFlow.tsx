'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface Option {
  emoji: string;
  label: string;
  desc: string;
}

const OPTIONS: Option[] = [
  { emoji: '✍️', label: 'Write content', desc: 'Emails, posts, stories' },
  { emoji: '🎨', label: 'Create images', desc: 'Art, photos, designs' },
  { emoji: '🛠️', label: 'Build something', desc: 'Apps, tools, websites' },
  { emoji: '⚡', label: 'Automate work', desc: 'Save hours every week' },
  { emoji: '📊', label: 'Analyse data', desc: 'PDFs, sheets, reports' },
  { emoji: '🔍', label: 'Just exploring', desc: 'Show me what\'s possible' },
];

type Stage = 1 | 2 | 3;

export default function OnboardingFlow() {
  const [stage, setStage] = useState<Stage>(1);
  const [progress, setProgress] = useState(0);
  const [preparing, setPreparing] = useState(true);

  // Stage 1: "Preparing your questions..." auto-resolve
  useEffect(() => {
    if (stage !== 1) return;
    const timer = setTimeout(() => setPreparing(false), 1800);
    return () => clearTimeout(timer);
  }, [stage]);

  // Stage 3: progress bar auto-complete
  useEffect(() => {
    if (stage !== 3) return;
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 50;
      const pct = Math.min((elapsed / 2000) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [stage]);

  const handleStart = () => setStage(2);

  const handleSelectOption = () => setStage(3);

  const handleSkip = () => setStage(3);

  return (
    <Box>
      {/* Stage 1: Welcome */}
      {stage === 1 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography
            sx={{
              fontSize: '1.75rem',
              mb: 1,
            }}
          >
            ✨👋✨
          </Typography>

          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              color: 'text.primary',
              mb: 1.5,
            }}
          >
            Welcome! You&apos;re in the right place.
          </Typography>

          <Typography
            sx={{
              fontSize: '0.9375rem',
              color: 'text.secondary',
              lineHeight: 1.7,
              maxWidth: 480,
              mx: 'auto',
              mb: 3,
            }}
          >
            You&apos;re in a place where AI can help you explore ideas, solve
            problems, and create things faster — even if you&apos;ve never used
            AI before.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
              maxWidth: 400,
              mx: 'auto',
              mb: 3,
              textAlign: 'left',
            }}
          >
            {[
              { emoji: '🧩', text: 'No tech knowledge needed' },
              { emoji: '💬', text: 'Just answer a few simple questions' },
              { emoji: '🚀', text: "We'll build your first AI request together" },
            ].map((item) => (
              <Box
                key={item.emoji}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
              >
                <Box
                  component="span"
                  sx={{ fontSize: '1.125rem', flexShrink: 0 }}
                >
                  {item.emoji}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    color: 'text.secondary',
                    lineHeight: 1.5,
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>

          {preparing && (
            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: 'text.disabled',
                mb: 2,
              }}
            >
              Preparing your questions…
            </Typography>
          )}

          <Button
            onClick={handleStart}
            disabled={preparing}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              bgcolor: 'primary.main',
              color: '#fff',
              borderRadius: '12px',
              px: 4,
              py: 1.25,
              mb: 1.5,
              boxShadow: 'none',
              '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
              '&:disabled': { bgcolor: 'action.disabledBackground', color: 'text.disabled' },
            }}
          >
            ✨ Let&apos;s get started
          </Button>

          <Box>
            <Typography
              onClick={handleSkip}
              sx={{
                fontSize: '0.8125rem',
                color: 'text.disabled',
                cursor: 'pointer',
                '&:hover': { color: 'text.secondary' },
              }}
            >
              Skip — search directly
            </Typography>
          </Box>
        </Box>
      )}

      {/* Stage 2: Question */}
      {stage === 2 && (
        <Box sx={{ py: 2 }}>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              color: 'text.primary',
              mb: 3,
              textAlign: 'center',
            }}
          >
            ✨ What would you like to do today?
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
              gap: 1.5,
              mb: 3,
            }}
          >
            {OPTIONS.map((option) => (
              <Box
                key={option.label}
                onClick={handleSelectOption}
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  border: '1px solid',
                  borderColor: (t) => t.palette.custom.border2,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(200,98,42,0.12)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>
                  {option.emoji}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.25,
                  }}
                >
                  {option.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                  }}
                >
                  {option.desc}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: 'text.disabled',
              textAlign: 'center',
              mb: 1.5,
            }}
          >
            Or type anything below — there are no wrong answers ↓
          </Typography>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              onClick={handleSkip}
              sx={{
                fontSize: '0.8125rem',
                color: 'text.disabled',
                cursor: 'pointer',
                '&:hover': { color: 'text.secondary' },
              }}
            >
              Not sure, skip →
            </Typography>
          </Box>
        </Box>
      )}

      {/* Stage 3: Completion */}
      {stage === 3 && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography sx={{ fontSize: '2rem', mb: 1 }}>✨</Typography>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'text.primary',
              mb: 0.75,
            }}
          >
            Building your personalised query…
          </Typography>
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              mb: 4,
            }}
          >
            Taking you to the Hub right away
          </Typography>
          <Box
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: (t) => t.palette.custom.bg2,
              overflow: 'hidden',
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: '100%',
                borderRadius: 3,
                bgcolor: 'transparent',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #C8622A 0%, #A34D1E 100%)',
                },
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
