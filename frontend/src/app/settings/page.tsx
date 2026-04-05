'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Notifications,
  Language,
  Security,
  Save,
} from '@mui/icons-material';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
          Settings
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)', mb: 4 }}>
          Manage your account preferences and configurations
        </Typography>

        {/* Appearance */}
        <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid var(--border)', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'var(--bg2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              {darkMode ? <DarkMode sx={{ fontSize: 20 }} /> : <LightMode sx={{ fontSize: 20 }} />}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
              Appearance
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>Dark Mode</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Switch between light and dark theme</Typography>
              </Box>
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-thumb': { bgcolor: 'var(--accent)' } }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Notifications */}
        <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid var(--border)', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'var(--bg2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <Notifications sx={{ fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
              Notifications
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>Push Notifications</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Get notified about new features and updates</Typography>
              </Box>
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-thumb': { bgcolor: 'var(--accent)' } }}
              />
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>Email Notifications</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Receive weekly digest and important alerts</Typography>
              </Box>
              <Switch
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-thumb': { bgcolor: 'var(--accent)' } }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Security */}
        <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid var(--border)', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'var(--bg2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <Security sx={{ fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
              Security
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                borderColor: 'var(--border)',
                color: 'var(--text2)',
                justifyContent: 'flex-start',
                py: 1.25,
              }}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                borderColor: 'var(--border)',
                color: 'var(--text2)',
                justifyContent: 'flex-start',
                py: 1.25,
              }}
            >
              Manage API Keys
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                borderColor: 'var(--border)',
                color: 'var(--text2)',
                justifyContent: 'flex-start',
                py: 1.25,
              }}
            >
              Two-Factor Authentication
            </Button>
          </Box>
        </Paper>

        {/* Save Button */}
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
            Save Settings
          </Button>
        </Box>
      </Box>
    </Box>
  );
}