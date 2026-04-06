'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useRegisterMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = t('auth.register.nameRequired');
    }

    if (!formData.email.trim()) {
      errors.email = t('auth.register.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('auth.register.emailInvalid');
    }

    if (!formData.password) {
      errors.password = t('auth.register.passwordRequired');
    } else if (formData.password.length < 8) {
      errors.password = t('auth.register.passwordMinLength');
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = t('auth.register.passwordUppercase');
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = t('auth.register.passwordNumber');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('auth.register.passwordMismatch');
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
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials({
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      }));

      router.push('/chat');
    } catch (err: any) {
      setError(err?.data?.message || t('auth.register.error'));
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: t('auth.register.reqLength') },
    { met: /[A-Z]/.test(formData.password), text: t('auth.register.reqUppercase') },
    { met: /[0-9]/.test(formData.password), text: t('auth.register.reqNumber') },
  ];

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
            {t('auth.register.title')}
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

          {/* Name */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
              {t('auth.register.name')}
            </Typography>
            <TextField
              fullWidth
              placeholder={t('auth.register.namePlaceholder')}
              value={formData.name}
              onChange={handleChange('name')}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
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

          {/* Email */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
              {t('auth.register.email')}
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder={t('auth.register.emailPlaceholder')}
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
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
              {t('auth.register.password')}
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
            {formData.password && (
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {passwordRequirements.map((req, idx) => (
                  <Typography
                    key={idx}
                    sx={{
                      fontSize: '0.75rem',
                      color: req.met ? '#0A5E49' : 'var(--text3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <span>{req.met ? '✓' : '○'}</span> {req.text}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>

          {/* Confirm Password */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
              {t('auth.register.confirmPassword')}
            </Typography>
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('auth.register.passwordPlaceholder')}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
            {isLoading ? t('auth.register.submitting') : t('auth.register.submit')}
          </Button>

          {/* Login Link */}
          <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text2)' }}>
            {t('auth.register.hasAccount')}{' '}
            <Link
              href="/login"
              style={{
                color: '#C8622A',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {t('auth.register.signIn')}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
