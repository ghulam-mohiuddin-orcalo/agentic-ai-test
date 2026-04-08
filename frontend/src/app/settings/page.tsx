'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  Divider,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Warning as WarningIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Lock as LockIcon,
  DeleteForever as DeleteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme, setLanguage } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import {
  useGetUserProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} from '@/store/api/usersApi';

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isHydrated } = useAuth();
  const ui = useAppSelector((state) => state.ui);
  const { t } = useTranslation();

  const { data: profile } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();

  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Password state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Delete account dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');

  if (!isHydrated) return null;

  if (!isAuthenticated) {
    router.push('/login?redirect=/settings');
    return null;
  }

  const displayEmail = profile?.email || user?.email || '';

  const handleThemeChange = async (_: any, newTheme: string | null) => {
    if (newTheme && newTheme !== ui.theme) {
      dispatch(setTheme(newTheme as 'light' | 'dark'));
      try {
        await updateProfile({
          preferences: { ...(profile?.preferences || {}), theme: newTheme },
        }).unwrap();
      } catch {
        // Preferences update is best-effort
      }
    }
  };

  const handleLanguageChange = async (newLang: string) => {
    if (newLang !== ui.language) {
      dispatch(setLanguage(newLang));
      try {
        await updateProfile({
          preferences: { ...(profile?.preferences || {}), language: newLang },
        }).unwrap();
      } catch {
        // Preferences update is best-effort
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwords.new !== passwords.confirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (!/(?=.*[A-Z])(?=.*\d)/.test(passwords.new)) {
      setPasswordError('Password must contain at least one uppercase letter and one number');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      }).unwrap();
      setPasswords({ current: '', new: '', confirm: '' });
      setSnack({ open: true, message: 'Password changed successfully', severity: 'success' });
    } catch (err: any) {
      setPasswordError(err?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== displayEmail) return;
    try {
      await deleteAccount().unwrap();
      dispatch(logout());
      router.push('/');
    } catch (err: any) {
      setSnack({ open: true, message: err?.data?.message || 'Failed to delete account', severity: 'error' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg)', pt: 10, pb: 6 }}>
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '1.75rem',
            color: 'var(--text)',
            mb: 4,
          }}
        >
          Settings
        </Typography>

        {/* Appearance Card */}
        <Box
          sx={{
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            p: 3,
            boxShadow: 'var(--shadow)',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <PaletteIcon sx={{ fontSize: '1.125rem', color: 'var(--accent)' }} />
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: '1.125rem',
                color: 'var(--text)',
              }}
            >
              Appearance
            </Typography>
          </Box>

          {/* Theme */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
              Theme
            </Typography>
            <ToggleButtonGroup
              value={ui.theme}
              exclusive
              onChange={handleThemeChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2.5,
                  py: 0.75,
                  fontSize: '0.875rem',
                  border: '1px solid var(--border)',
                  color: 'var(--text2)',
                  '&.Mui-selected': {
                    bgcolor: 'var(--accent-lt)',
                    color: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    '&:hover': { bgcolor: 'var(--accent-lt)' },
                  },
                },
              }}
            >
              <ToggleButton value="light">
                <LightModeIcon sx={{ mr: 0.75, fontSize: '1rem' }} />
                Light
              </ToggleButton>
              <ToggleButton value="dark">
                <DarkModeIcon sx={{ mr: 0.75, fontSize: '1rem' }} />
                Dark
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Language */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <LanguageIcon sx={{ fontSize: '1rem', color: 'var(--text2)' }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
                Language
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={ui.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                sx={{
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border2)' },
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Espa&ntilde;ol</MenuItem>
                <MenuItem value="fr">Fran&ccedil;ais</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
                <MenuItem value="zh">中文</MenuItem>
                <MenuItem value="ja">日本語</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Security Card */}
        <Box
          sx={{
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            p: 3,
            boxShadow: 'var(--shadow)',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <LockIcon sx={{ fontSize: '1.125rem', color: 'var(--accent)' }} />
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: '1.125rem',
                color: 'var(--text)',
              }}
            >
              Security
            </Typography>
          </Box>

          {passwordError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
              {passwordError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleChangePassword}>
            {/* Current Password */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                Current Password
              </Typography>
              <TextField
                fullWidth
                type={showCurrent ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowCurrent(!showCurrent)} size="small" edge="end">
                        {showCurrent ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    '& fieldset': { borderColor: 'var(--border)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                  },
                }}
              />
            </Box>

            {/* New Password */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                New Password
              </Typography>
              <TextField
                fullWidth
                type={showNew ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                size="small"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNew(!showNew)} size="small" edge="end">
                        {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    '& fieldset': { borderColor: 'var(--border)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                  },
                }}
              />
            </Box>

            {/* Confirm Password */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                Confirm New Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    '& fieldset': { borderColor: 'var(--border)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={changingPassword || !passwords.current || !passwords.new || !passwords.confirm}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9375rem',
                borderRadius: '8px',
                bgcolor: 'var(--accent)',
                '&:hover': { bgcolor: 'var(--accent2)' },
                '&:disabled': { bgcolor: 'var(--border)', color: 'var(--text3)' },
              }}
            >
              {changingPassword ? 'Updating...' : 'Change Password'}
            </Button>
          </Box>
        </Box>

        {/* Danger Zone Card */}
        <Box
          sx={{
            bgcolor: 'var(--card)',
            border: '1px solid #e8c0c0',
            borderRadius: 'var(--radius)',
            p: 3,
            boxShadow: 'var(--shadow)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <WarningIcon sx={{ fontSize: '1.125rem', color: '#d32f2f' }} />
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: '1.125rem',
                color: '#d32f2f',
              }}
            >
              Danger Zone
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)', mb: 2 }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </Typography>
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="outlined"
            startIcon={<DeleteIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '8px',
              borderColor: '#d32f2f',
              color: '#d32f2f',
              '&:hover': { bgcolor: '#fef0f0', borderColor: '#d32f2f' },
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteConfirmEmail('');
        }}
        PaperProps={{
          sx: { borderRadius: '12px', maxWidth: 440, width: '100%' },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: '#d32f2f' }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            This will permanently delete your account, all conversations, agents, and API keys.
          </Alert>
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text)', mb: 2 }}>
            Type <strong>{displayEmail}</strong> to confirm.
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your email"
            value={deleteConfirmEmail}
            onChange={(e) => setDeleteConfirmEmail(e.target.value)}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': { borderColor: 'var(--border)' },
                '&.Mui-focused fieldset': { borderColor: '#d32f2f', borderWidth: 1.5 },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteConfirmEmail('');
            }}
            sx={{ textTransform: 'none', color: 'var(--text2)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={deleteConfirmEmail !== displayEmail || deleting}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
          >
            {deleting ? 'Deleting...' : 'Delete Forever'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: '8px' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
