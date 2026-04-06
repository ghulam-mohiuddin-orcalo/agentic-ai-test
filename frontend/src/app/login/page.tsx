'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = t('auth.login.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('auth.login.emailInvalid');
    }

    if (!formData.password) {
      errors.password = t('auth.login.passwordRequired');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials({
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      }));

      // Redirect to the page they were trying to access, or chat
      const redirectTo = searchParams.get('redirect') || '/chat';
      router.push(redirectTo);
    } catch (err: any) {
      setError(err?.data?.message || t('auth.login.error'));
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'rememberMe') {
      setFormData(prev => ({ ...prev, [field]: e.target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      if (fieldErrors[field]) {
        setFieldErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'var(--bg)',
        py: 4,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          mx: 2,
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '2rem',
              color: 'var(--text)',
              mb: 1,
            }}
          >
            Nexus<span style={{ color: '#C8622A' }}>AI</span>
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: 'var(--text2)' }}>
            {t('auth.login.title')}
          </Typography>
        </Box>

        {/* Form Card */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            p: 3,
            boxShadow: 'var(--shadow)',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          {/* Email */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
              {t('auth.login.email')}
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder={t('auth.login.emailPlaceholder')}
              value={formData.email}
              onChange={handleChange('email')}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  '& fieldset': { borderColor: 'var(--border)' },
                  '&:hover fieldset': { borderColor: 'var(--border2)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                },
              }}
            />
          </Box>

          {/* Password */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
              {t('auth.login.password')}
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.register.passwordPlaceholder')}
              value={formData.password}
              onChange={handleChange('password')}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  '& fieldset': { borderColor: 'var(--border)' },
                  '&:hover fieldset': { borderColor: 'var(--border2)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                },
              }}
            />
          </Box>

          {/* Remember Me & Forgot Password */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={handleChange('rememberMe')}
                  size="small"
                  sx={{
                    color: 'var(--border2)',
                    '&.Mui-checked': { color: 'var(--accent)' },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)' }}>
                  {t('auth.login.rememberMe')}
                </Typography>
              }
            />
            <Link
              href="/forgot-password"
              style={{
                fontSize: '0.875rem',
                color: '#C8622A',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {t('auth.login.forgotPassword')}
            </Link>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            disableElevation
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.9375rem',
              py: 1.25,
              borderRadius: '8px',
              bgcolor: 'var(--accent)',
              '&:hover': { bgcolor: 'var(--accent2)' },
              mb: 2,
            }}
          >
            {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>

          {/* Register Link */}
          <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text2)' }}>
            {t('auth.login.noAccount')}{' '}
            <Link
              href="/register"
              style={{
                color: '#C8622A',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {t('auth.login.createAccount')}
            </Link>
          </Typography>
        </Box>

        {/* Guest Access */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text3)', mb: 1 }}>
            {t('auth.login.guestContinue')}
          </Typography>
          <Button
            onClick={() => router.push('/chat')}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              borderRadius: '8px',
              borderColor: 'var(--border2)',
              color: 'var(--text2)',
              '&:hover': {
                borderColor: 'var(--accent)',
                bgcolor: 'var(--accent-lt)',
              },
            }}
          >
            {t('auth.login.guestButton')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
