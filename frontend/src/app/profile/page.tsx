'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  Snackbar,
  Divider,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility,
  VisibilityOff,
  Key as KeyIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useGetApiKeysQuery,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
} from '@/store/api/usersApi';

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isHydrated } = useAuth();
  const { t } = useTranslation();

  const { data: profile, isLoading: profileLoading } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: apiKeys = [], isLoading: keysLoading } = useGetApiKeysQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [createApiKey, { isLoading: creatingKey }] = useCreateApiKeyMutation();
  const [deleteApiKey] = useDeleteApiKeyMutation();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState('');
  const [showCreatedKey, setShowCreatedKey] = useState(false);

  if (!isHydrated) return null;

  if (!isAuthenticated) {
    router.push('/login?redirect=/profile');
    return null;
  }

  const displayName = profile?.name || user?.name || '';
  const displayEmail = profile?.email || user?.email || '';
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleEdit = () => {
    setName(displayName);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await updateProfile({ name: name.trim() }).unwrap();
      dispatch(updateUser({ name: name.trim() }));
      setEditing(false);
      setSnack({ open: true, message: 'Profile updated successfully', severity: 'success' });
    } catch (err: any) {
      setSnack({ open: true, message: err?.data?.message || 'Failed to update profile', severity: 'error' });
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    try {
      const result = await createApiKey({ name: newKeyName.trim() }).unwrap();
      setCreatedKey(result.key);
      setShowCreatedKey(true);
      setNewKeyName('');
    } catch (err: any) {
      setSnack({ open: true, message: err?.data?.message || 'Failed to create API key', severity: 'error' });
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      await deleteApiKey(keyId).unwrap();
      setSnack({ open: true, message: 'API key deleted', severity: 'success' });
    } catch (err: any) {
      setSnack({ open: true, message: err?.data?.message || 'Failed to delete API key', severity: 'error' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnack({ open: true, message: 'Copied to clipboard', severity: 'success' });
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
          Profile
        </Typography>

        {/* Profile Card */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#C8622A',
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              {editing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  <IconButton onClick={handleSave} disabled={updating} size="small" sx={{ color: 'var(--accent)' }}>
                    <SaveIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => setEditing(false)} size="small" sx={{ color: 'var(--text2)' }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 600,
                      fontSize: '1.25rem',
                      color: 'var(--text)',
                    }}
                  >
                    {displayName}
                  </Typography>
                  <IconButton onClick={handleEdit} size="small" sx={{ color: 'var(--text2)' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)', mt: 0.25 }}>
                {displayEmail}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'var(--border)', mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>
                Role
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: 'var(--text)', textTransform: 'capitalize' }}>
                {profile?.role || 'User'}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 600, mb: 0.5 }}>
                Member Since
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: 'var(--text)' }}>
                {memberSince}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* API Keys Card */}
        <Box
          sx={{
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            p: 3,
            boxShadow: 'var(--shadow)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <KeyIcon sx={{ fontSize: '1.125rem', color: 'var(--accent)' }} />
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  color: 'var(--text)',
                }}
              >
                API Keys
              </Typography>
            </Box>
            <Button
              onClick={() => setKeyDialogOpen(true)}
              startIcon={<AddIcon />}
              size="small"
              sx={{
                textTransform: 'none',
                fontSize: '0.8125rem',
                color: 'var(--accent)',
                '&:hover': { bgcolor: 'var(--accent-lt)' },
              }}
            >
              Create Key
            </Button>
          </Box>

          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)', mb: 2 }}>
            Manage your API keys for programmatic access.
          </Typography>

          {/* Newly Created Key Banner */}
          {showCreatedKey && createdKey && (
            <Alert
              severity="warning"
              icon={false}
              sx={{
                mb: 2,
                borderRadius: '8px',
                '& .MuiAlert-message': { width: '100%' },
              }}
            >
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, mb: 0.5 }}>
                Copy your API key now. You won&apos;t be able to see it again.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  value={createdKey}
                  size="small"
                  type={showCreatedKey ? 'text' : 'password'}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontFamily: 'monospace',
                    },
                  }}
                  slotProps={{
                    input: {
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => copyToClipboard(createdKey)} size="small">
                            <CopyIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => setShowCreatedKey(false)} size="small">
                            <VisibilityOff fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </Alert>
          )}

          {keysLoading ? (
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text3)' }}>Loading keys...</Typography>
          ) : apiKeys.length === 0 ? (
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
                border: '1px dashed var(--border2)',
                borderRadius: '8px',
              }}
            >
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--text3)' }}>
                No API keys yet. Create one to get started.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {apiKeys.map((key) => (
                <Box
                  key={key.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text)' }}>
                      {key.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                      Created {new Date(key.createdAt).toLocaleDateString()}
                      {key.lastUsed && ` · Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleDeleteKey(key.id)}
                    size="small"
                    sx={{ color: 'var(--text3)', '&:hover': { color: '#d32f2f' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Create Key Dialog */}
      <Dialog
        open={keyDialogOpen}
        onClose={() => {
          setKeyDialogOpen(false);
          setNewKeyName('');
        }}
        PaperProps={{
          sx: { borderRadius: '12px', maxWidth: 420, width: '100%' },
        }}
      >
        <DialogTitle sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
          Create API Key
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)', mb: 2 }}>
            Give your key a descriptive name to identify it later.
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g., Production, Development"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': { borderColor: 'var(--border)' },
                '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setKeyDialogOpen(false);
              setNewKeyName('');
            }}
            sx={{ textTransform: 'none', color: 'var(--text2)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateKey}
            disabled={!newKeyName.trim() || creatingKey}
            variant="contained"
            disableElevation
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              bgcolor: 'var(--accent)',
              '&:hover': { bgcolor: 'var(--accent2)' },
            }}
          >
            {creatingKey ? 'Creating...' : 'Create'}
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
