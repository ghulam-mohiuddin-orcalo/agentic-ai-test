'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  Chip,
  Divider,
} from '@mui/material';
import { Search } from '@mui/icons-material';

const MODELS = [
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', badge: null },
  { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', badge: null },
  { id: 'gpt-5-turbo', name: 'GPT-5 Turbo', provider: 'OpenAI', badge: null },
  { id: 'gpt-4.5', name: 'GPT-4.5', provider: 'OpenAI', badge: null },
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', badge: null },
  { id: 'gpt-4.1-mini', name: 'GPT-4.1-mini', provider: 'OpenAI', badge: null },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', badge: null },
  { id: 'gpt-4o-mini', name: 'GPT-4o-mini', provider: 'OpenAI', badge: null },
  { id: 'o3', name: 'o3', provider: 'OpenAI', badge: null },
  { id: 'd3-mini', name: 'd3-mini', provider: 'OpenAI', badge: null },
  { id: 'o4-mini', name: 'o4-mini', provider: 'OpenAI', badge: null },
  { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', badge: null },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', badge: null },
  { id: 'claude-opus-4', name: 'Claude Opus 4', provider: 'Anthropic', badge: null },
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', badge: null },
  { id: 'claude-sonnet-4-5-b', name: 'Claude Sonnet 4.5', provider: 'Anthropic', badge: null },
];

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: '#10A37F',
  Anthropic: '#C8622A',
  Google: '#1E4DA8',
};

interface ModelsSidebarProps {
  selectedModel: string;
  onSelectModel: (id: string) => void;
}

export default function ModelsSidebar({ selectedModel, onSelectModel }: ModelsSidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = MODELS.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

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
          MODELS
        </Typography>
        <TextField
          size="small"
          placeholder="Search 325 models..."
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

      {/* Model List */}
      <List sx={{ flex: 1, overflow: 'auto', py: 0.5, px: 0.5 }}>
        {filtered.map((model) => {
          const isSelected = selectedModel === model.id;
          const providerColor = PROVIDER_COLORS[model.provider] ?? '#9E9B93';

          return (
            <ListItemButton
              key={model.id}
              selected={isSelected}
              onClick={() => onSelectModel(model.id)}
              sx={{
                borderRadius: '8px',
                px: 1.5,
                py: 0.875,
                mb: 0.25,
                '&.Mui-selected': {
                  bgcolor: 'var(--accent-lt)',
                  '&:hover': { bgcolor: 'var(--accent-lt)' },
                },
                '&:hover': { bgcolor: 'var(--bg)' },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      bgcolor: providerColor,
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)', lineHeight: 1 }}>
                    {model.provider}
                  </Typography>
                </Box>
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
