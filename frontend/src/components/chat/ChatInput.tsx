'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Send,
  AttachFile,
  Mic,
  AutoFixHigh,
  Search,
  FlashOn,
  Add,
} from '@mui/icons-material';

const TOOL_CHIPS = [
  { icon: AutoFixHigh, label: 'Use cases' },
  { icon: Search, label: 'Monitor the situation' },
  { icon: Add, label: 'Create a prototype' },
  { icon: FlashOn, label: 'Build a business plan' },
  { icon: AutoFixHigh, label: 'Create content' },
  { icon: Search, label: 'Analyse & research' },
  { icon: AutoFixHigh, label: 'Learn something' },
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
      {/* Tool suggestion chips */}
      <Box
        sx={{
          display: 'flex',
          gap: 0.75,
          mb: 1.5,
          overflowX: 'auto',
          pb: 0.5,
          '&::-webkit-scrollbar': { height: 0 },
        }}
      >
        {TOOL_CHIPS.map(({ icon: Icon, label }) => (
          <Chip
            key={label}
            icon={<Icon sx={{ fontSize: 14 }} />}
            label={label}
            size="small"
            onClick={() => setValue((v) => v + (v ? ' ' : '') + label)}
            sx={{
              height: 28,
              borderRadius: '8px',
              bgcolor: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text2)',
              fontSize: '0.75rem',
              fontWeight: 500,
              flexShrink: 0,
              cursor: 'pointer',
              '& .MuiChip-icon': { color: 'var(--text3)', ml: 0.5 },
              '&:hover': {
                bgcolor: 'var(--bg2)',
                borderColor: 'var(--border2)',
              },
            }}
          />
        ))}
      </Box>

      {/* Input box */}
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
        <TextField
          multiline
          minRows={2}
          maxRows={6}
          fullWidth
          placeholder="Describe your project, ask a question, or just say hi — I'm here to help..."
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

        {/* Bottom bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Attach file">
              <IconButton size="small" sx={{ color: 'var(--text3)', '&:hover': { color: 'var(--text2)' } }}>
                <AttachFile sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Voice input">
              <IconButton size="small" sx={{ color: 'var(--text3)', '&:hover': { color: 'var(--text2)' } }}>
                <Mic sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
              {selectedModel}
            </Typography>
            <Tooltip title={isStreaming ? 'Generating...' : 'Send (Enter)'}>
              <span>
                <IconButton
                  onClick={handleSend}
                  disabled={!value.trim() || isStreaming}
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: value.trim() && !isStreaming ? 'var(--accent)' : 'var(--bg3)',
                    color: value.trim() && !isStreaming ? '#fff' : 'var(--text3)',
                    borderRadius: '8px',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: value.trim() && !isStreaming ? 'var(--accent2)' : 'var(--bg3)',
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

      {/* Suggestions below input */}
      <Box sx={{ mt: 1.5 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {[
            '💡 Help me find the best AI model for my project',
            '🌐 I want to build an AI chatbot for my website',
            '📄 Analyse documents and extract key information',
            '🎙️ Add voice and speech recognition to my app',
          ].map((suggestion) => (
            <Box
              key={suggestion}
              onClick={() => setValue(suggestion.replace(/^[^\s]+\s/, ''))}
              sx={{
                fontSize: '0.75rem',
                color: 'var(--text2)',
                bgcolor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                px: 1.25,
                py: 0.5,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: 'var(--bg2)',
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                },
              }}
            >
              {suggestion}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
