'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  Chip,
} from '@mui/material';
import {
  Search,
  ManageSearch,
  Psychology,
  Brush,
  Computer,
  Mic,
  Send,
} from '@mui/icons-material';

const TOOL_BUTTONS = [
  {
    icon: Search,
    label: 'Search',
    color: '#7C3AED',
    bg: '#F3EEFF',
  },
  {
    icon: ManageSearch,
    label: 'DeepSearch',
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    icon: Psychology,
    label: 'Think',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: Brush,
    label: 'Create',
    color: '#0A5E49',
    bg: '#E2F5EF',
  },
  {
    icon: Computer,
    label: 'Computer Use',
    color: '#9B2042',
    bg: '#FDEDF1',
  },
];

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  selectedModel: string;
}

export default function ChatInput({ onSend, isStreaming, selectedModel }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        borderTop: '1px solid var(--border)',
        bgcolor: 'var(--card)',
        px: 2.5,
        pt: 1.5,
        pb: 2,
      }}
    >
      {/* Input container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus-within': {
            borderColor: 'var(--accent)',
            boxShadow: '0 0 0 3px var(--accent-border)',
          },
        }}
      >
        {/* Textarea */}
        <TextField
          multiline
          minRows={2}
          maxRows={6}
          fullWidth
          placeholder="Describe your project, ask a question, or just say hi..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          inputRef={textareaRef}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{
            px: 2,
            pt: 1.5,
            pb: 0.5,
            '& .MuiInputBase-root': {
              fontSize: '0.9375rem',
              color: 'var(--text)',
              lineHeight: 1.6,
              bgcolor: 'transparent',
              alignItems: 'flex-start',
            },
            '& textarea::placeholder': {
              color: 'var(--text3)',
              opacity: 1,
            },
          }}
        />

        {/* Bottom toolbar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            pb: 1.25,
            pt: 0.5,
          }}
        >
          {/* Left: colorful icon buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {TOOL_BUTTONS.map(({ icon: Icon, label, color, bg }) => (
              <Tooltip key={label} title={label}>
                <IconButton
                  size="small"
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '8px',
                    bgcolor: bg,
                    color: color,
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      bgcolor: color,
                      color: '#fff',
                      transform: 'translateY(-1px)',
                      boxShadow: `0 3px 8px ${color}33`,
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            ))}
          </Box>

          {/* Right: model pill, mic, send */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Model selector pill */}
            <Chip
              label={selectedModel || 'GPT-5.4'}
              size="small"
              onClick={() => {}}
              sx={{
                height: 28,
                borderRadius: '14px',
                bgcolor: 'var(--bg2)',
                border: '1px solid var(--border)',
                color: 'var(--text2)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                '& .MuiChip-label': { px: 1.25 },
                '&:hover': {
                  bgcolor: 'var(--bg3)',
                  borderColor: 'var(--border2)',
                },
              }}
            />

            {/* Mic button */}
            <Tooltip title="Voice input">
              <IconButton
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '8px',
                  color: 'var(--text3)',
                  '&:hover': {
                    color: 'var(--text)',
                    bgcolor: 'var(--bg2)',
                  },
                }}
              >
                <Mic sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Send button */}
            <Tooltip title={isStreaming ? 'Generating...' : 'Send (Enter)'}>
              <span>
                <IconButton
                  onClick={handleSend}
                  disabled={!value.trim() || isStreaming}
                  size="small"
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: value.trim() && !isStreaming ? 'var(--accent)' : 'var(--bg3)',
                    color: value.trim() && !isStreaming ? '#fff' : 'var(--text3)',
                    borderRadius: '10px',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: value.trim() && !isStreaming ? 'var(--accent2)' : 'var(--bg3)',
                      transform: value.trim() && !isStreaming ? 'scale(1.05)' : 'none',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'var(--bg3)',
                      color: 'var(--text3)',
                    },
                  }}
                >
                  {isStreaming ? (
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        border: '2px solid var(--text3)',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                  ) : (
                    <Send sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
