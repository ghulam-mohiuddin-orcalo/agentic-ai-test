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

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      }));

      router.push('/chat');
    } catch (err: any) {
      setError(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(formData.password), text: 'One number' },
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
            Create your account
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
              Full Name
            </Typography>
            <TextField
              fullWidth
              placeholder="John Doe"
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
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="you@example.com"
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
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
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
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
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
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>

          {/* Login Link */}
          <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text2)' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              style={{
                color: '#C8622A',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
