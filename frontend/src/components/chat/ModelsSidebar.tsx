'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  Divider,
  Skeleton,
} from '@mui/material';
import { Search, ErrorOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGetModelsQuery, PROVIDER_COLORS } from '@/store/api/modelsApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedModel } from '@/store/slices/chatSlice';

export default function ModelsSidebar() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const selectedModel = useAppSelector((state) => state.chat.selectedModel);
  const { data: models, isLoading, isError, refetch } = useGetModelsQuery();

  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!models) return [];
    const query = search.toLowerCase();
    return models.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.provider.toLowerCase().includes(query)
    );
  }, [models, search]);

  // Group filtered models by provider
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const model of filtered) {
      if (!groups[model.provider]) {
        groups[model.provider] = [];
      }
      groups[model.provider].push(model);
    }
    return groups;
  }, [filtered]);

  const handleSelectModel = (id: string) => {
    dispatch(setSelectedModel(id));
  };

  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'var(--card)',
        borderRight: '1px solid var(--border)',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '0.8125rem',
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            mb: 1.5,
          }}
        >
          {t('chat.modelsSidebar.title')}
        </Typography>
        <TextField
          size="small"
          placeholder={t('chat.modelsSidebar.searchPlaceholder', { count: models?.length ?? '...' })}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 16, color: 'var(--text3)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              bgcolor: 'var(--bg)',
              fontSize: '0.8125rem',
              '& fieldset': { borderColor: 'var(--border)' },
              '&:hover fieldset': { borderColor: 'var(--border2)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
            },
            '& .MuiInputBase-input': {
              py: 0.875,
              color: 'var(--text)',
              '&::placeholder': { color: 'var(--text3)', opacity: 1 },
            },
          }}
        />
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* Loading state */}
      {isLoading && (
        <Box sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={120} height={20} />
            </Box>
          ))}
        </Box>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
          <ErrorOutline sx={{ fontSize: 28, color: 'var(--text3)', mb: 1 }} />
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text3)', mb: 1 }}>
            {t('chat.modelsSidebar.failedToLoad')}
          </Typography>
          <Typography
            onClick={() => refetch()}
            sx={{
              fontSize: '0.75rem',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('common.retry')}
          </Typography>
        </Box>
      )}

      {/* Grouped Model List */}
      {!isLoading && !isError && (
        <Box sx={{ flex: 1, overflow: 'auto', py: 0.5, px: 0.5 }}>
          {Object.entries(grouped).map(([provider, providerModels]) => {
            const providerColor = PROVIDER_COLORS[provider] ?? '#9E9B93';

            return (
              <Box key={provider} sx={{ mb: 0.5 }}>
                {/* Provider group header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.5,
                    pt: 1.25,
                    pb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: providerColor,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: 'var(--text3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {provider}
                  </Typography>
                </Box>

                <List sx={{ py: 0 }}>
                  {providerModels.map((model) => {
                    const isSelected = selectedModel === model.id;

                    return (
                      <ListItemButton
                        key={model.id}
                        selected={isSelected}
                        onClick={() => handleSelectModel(model.id)}
                        sx={{
                          borderRadius: '8px',
                          px: 1.5,
                          py: 0.75,
                          mb: 0.25,
                          '&.Mui-selected': {
                            bgcolor: 'var(--accent-lt)',
                            '&:hover': { bgcolor: 'var(--accent-lt)' },
                          },
                          '&:hover': { bgcolor: 'var(--bg)' },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <Typography sx={{ fontSize: '0.875rem', lineHeight: 1 }}>
                            {model.icon}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.8125rem',
                              fontWeight: isSelected ? 600 : 500,
                              color: isSelected ? 'var(--accent)' : 'var(--text)',
                              lineHeight: 1.3,
                            }}
                          >
                            {model.name}
                          </Typography>
                        </Box>
                      </ListItemButton>
                    );
                  })}
                </List>
              </Box>
            );
          })}

          {Object.keys(grouped).length === 0 && (
            <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text3)' }}>
                {t('chat.modelsSidebar.noModels')}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
