'use client';

import { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Divider, Dialog, DialogContent } from '@mui/material';
import { Close, Google, GitHub } from '@mui/icons-material';
import { useLoginMutation, useRegisterMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const result = await login({ email, password }).unwrap();
        dispatch(setCredentials({ token: result.accessToken, refreshToken: result.refreshToken, user: result.user }));
      } else {
        const result = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ token: result.accessToken, refreshToken: result.refreshToken, user: result.user }));
      }
      onClose();
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      setError(apiError?.data?.message || 'Authentication failed');
    }
  };

  const isLoading = isLoginLoading || isRegisterLoading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          p: 0,
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem' }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Social buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              sx={{ textTransform: 'none', borderRadius: '10px', py: 1.2, borderColor: 'rgba(0,0,0,0.15)', color: 'text.primary' }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              sx={{ textTransform: 'none', borderRadius: '10px', py: 1.2, borderColor: 'rgba(0,0,0,0.15)', color: 'text.primary' }}
            >
              GitHub
            </Button>
          </Box>

          <Divider sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>or</Typography>
          </Divider>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />

            {error && (
              <Typography sx={{ fontSize: '0.8rem', color: '#DC2626' }}>{error}</Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={isLoading}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                py: 1.5,
                fontSize: '0.95rem',
              }}
            >
              {isLoading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
            </Button>
          </Box>

          {/* Toggle */}
          <Typography sx={{ mt: 2.5, textAlign: 'center', fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Box
              component="span"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              sx={{ color: '#C8622A', cursor: 'pointer', fontWeight: 600 }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Box>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
