'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save, Person } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getInitials = (n: string) =>
    n
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg)', py: 4, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'var(--text)',
            mb: 0.5,
          }}
        >
          Profile
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)', mb: 4 }}>
          Manage your account information and preferences
        </Typography>

        {/* Avatar Section */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#C8622A',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {user ? getInitials(user.name) : 'U'}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text)', mb: 0.25 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text3)', mb: 1.5 }}>
                {user?.email || 'user@example.com'}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Person />}
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  borderColor: 'var(--border)',
                  color: 'var(--text2)',
                }}
              >
                Change avatar
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Profile Form */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            mb: 3,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)', mb: 2.5 }}>
            Personal Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '& fieldset': { borderColor: 'var(--border)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
                  },
                }}
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                type="email"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '& fieldset': { borderColor: 'var(--border)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
                  },
                }}
              />
            </Box>
            <TextField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Tell us about yourself..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': { borderColor: 'var(--border)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                px: 3,
                bgcolor: '#C8622A',
                '&:hover': { bgcolor: '#A5501F' },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Paper>

        {/* Account Stats */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)', mb: 2 }}>
            Account Stats
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
            {[
              { label: 'Conversations', value: '0' },
              { label: 'Messages Sent', value: '0' },
              { label: 'Agents Created', value: '0' },
              { label: 'Member Since', value: 'Today' },
            ].map((stat) => (
              <Box key={stat.label} sx={{ textAlign: 'center', p: 1.5, bgcolor: 'var(--bg2)', borderRadius: '12px' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)', mb: 0.25 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>{stat.label}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)}>
        <Alert severity="success" sx={{ borderRadius: '10px' }}>
          Profile updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
