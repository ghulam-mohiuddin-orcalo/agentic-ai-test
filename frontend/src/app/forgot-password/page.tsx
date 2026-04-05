'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setSubmitted(true);
    setError('');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, md: 4 } }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'var(--text)',
                letterSpacing: '-0.02em',
              }}
            >
              Nexus<span style={{ color: '#C8622A' }}>AI</span>
            </Typography>
          </Link>
        </Box>

        {submitted ? (
          <Paper
            sx={{
              p: 3,
              borderRadius: '12px',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                bgcolor: '#E2F5EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                mx: 'auto',
                mb: 2,
              }}
            >
              ✉️
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text)', mb: 1 }}>
              Check your email
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)', mb: 2 }}>
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </Typography>
            <Alert severity="info" sx={{ borderRadius: '10px', textAlign: 'left', mb: 2 }}>
              Didn&apos;t receive the email? Check your spam folder or try again with a different email address.
            </Alert>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => setSubmitted(false)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                borderColor: 'var(--border)',
                color: 'var(--text2)',
              }}
            >
              Try again
            </Button>
          </Paper>
        ) : (
          <Paper
            sx={{
              p: 3,
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)', mb: 0.5 }}>
                Reset your password
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)' }}>
                Enter your email and we&apos;ll send you a reset link
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '& fieldset': { borderColor: 'var(--border)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                startIcon={<Email />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '10px',
                  py: 1.25,
                  bgcolor: '#C8622A',
                  '&:hover': { bgcolor: '#A5501F' },
                }}
              >
                Send Reset Link
              </Button>
            </form>

            <Box sx={{ mt: 2.5, textAlign: 'center' }}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)', '&:hover': { color: 'var(--accent)' } }}>
                  ← Back to login
                </Typography>
              </Link>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
