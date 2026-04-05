'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Backdrop,
  Fade,
  Paper,
  Box,
  Typography,
  Button,
  LinearProgress,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface QuestionOption {
  label: string;
}

interface Question {
  title: string;
  options: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    title: 'What would you like to do?',
    options: [
      { label: 'Write content' },
      { label: 'Create images' },
      { label: 'Build something' },
      { label: 'Automate work' },
      { label: 'Analyse data' },
      { label: 'Just exploring' },
    ],
  },
  {
    title: 'How experienced are you with AI?',
    options: [
      { label: 'Complete beginner' },
      { label: 'Used ChatGPT a few times' },
      { label: 'Use AI regularly' },
      { label: "I'm a developer" },
      { label: 'I build AI products' },
    ],
  },
  {
    title: 'What matters most to you?',
    options: [
      { label: 'Ease of use' },
      { label: 'Quality of output' },
      { label: 'Speed' },
      { label: 'Cost' },
      { label: 'Privacy' },
    ],
  },
];

const WELCOME_SEEN_KEY = 'nexusai-welcome-seen';

export default function WelcomeOverlay() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    setOpen(false);
  }, []);

  // Stage 3 progress bar auto-dismiss
  useEffect(() => {
    if (stage !== 3) return;

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 50;
      const pct = Math.min((elapsed / 2000) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        dismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [stage, dismiss]);

  const handleStart = () => {
    setStage(2);
  };

  const handleSelectOption = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setStage(3);
    }
  };

  const handleSkipQuestion = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setStage(3);
    }
  };

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 9999,
        bgcolor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            maxWidth: 520,
            width: '90%',
            mx: 'auto',
            borderRadius: '20px',
            p: { xs: 3, sm: 4 },
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {/* Stage 1: Welcome */}
          {stage === 1 && (
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  color: 'text.primary',
                  mb: 1.5,
                }}
              >
                Welcome to NexusAI{' '}
                <Box component="span" sx={{ fontSize: 'inherit' }}>
                  &#x1F44B;
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                Think of this as your personal guide to the world of AI.
              </Typography>

              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  mb: 3,
                }}
              >
                You don&apos;t need to be a tech expert — or even know what AI is.
                We&apos;ll walk you through everything, one simple step at a time,
                and help you find exactly what you need.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3.5 }}>
                {[
                  'No tech knowledge needed — we\'ll explain everything in plain language',
                  'Just answer a few simple questions about what you\'d like to do',
                  'We\'ll build your first AI request together — step by step',
                ].map((text) => (
                  <Box key={text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <CheckIcon
                      sx={{
                        fontSize: 20,
                        color: 'primary.main',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '0.9375rem',
                        color: 'text.secondary',
                        lineHeight: 1.5,
                      }}
                    >
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                onClick={handleStart}
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  borderRadius: '12px',
                  py: 1.5,
                  mb: 1.5,
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Let&apos;s get started &rarr;
              </Button>

              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: 'text.disabled',
                  textAlign: 'center',
                  mb: 1.5,
                }}
              >
                Ready? It only takes a minute. &#x1F680;
              </Typography>

              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  onClick={dismiss}
                  sx={{
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  Skip for now
                </Typography>
              </Box>
            </Box>
          )}

          {/* Stage 2: Questions */}
          {stage === 2 && (
            <Box>
              {/* Progress indicator */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'text.secondary',
                    }}
                  >
                    Question {questionIndex + 1} of {QUESTIONS.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%`,
                    }}
                  />
                </Box>
              </Box>

              {/* Question title */}
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                {QUESTIONS[questionIndex].title}
              </Typography>

              {/* Option cards */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 1.5,
                  mb: 3,
                }}
              >
                {QUESTIONS[questionIndex].options.map((option) => (
                  <Box
                    key={option.label}
                    onClick={handleSelectOption}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(200,98,42,0.12)',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'text.primary',
                        textAlign: 'center',
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Skip link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  onClick={handleSkipQuestion}
                  sx={{
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  Skip this question &rarr;
                </Typography>
              </Box>
            </Box>
          )}

          {/* Stage 3: Complete */}
          {stage === 3 && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography
                sx={{
                  fontSize: '2rem',
                  mb: 1,
                }}
              >
                &#x1F389;
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                You&apos;re all set!
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  color: 'text.secondary',
                  mb: 4,
                }}
              >
                Taking you to your personalised hub&hellip;
              </Typography>
              <Box
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'rgba(0,0,0,0.06)',
                  overflow: 'hidden',
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
                      bgcolor: 'primary.main',
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </Paper>
      </Fade>
    </Backdrop>
  );
}
