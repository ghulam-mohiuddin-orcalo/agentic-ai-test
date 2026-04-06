'use client';

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Send,
  EmojiEmotions,
  AttachFile,
  AddReaction,
  Lightbulb,
  Visibility,
  AutoFixHigh,
  BusinessCenter,
  Create,
  Science,
  School,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useGetModelsQuery, findModelInfo } from '@/store/api/modelsApi';

const ACTION_CHIP_KEYS = [
  { icon: Lightbulb, labelKey: 'chat.input.useCases', color: '#059669', bg: '#ECFDF5', border: '#BBF7D0' },
  { icon: Visibility, labelKey: 'chat.input.monitorSituation', color: '#7C3AED', bg: '#F3EEFF', border: '#DDD6FE' },
  { icon: AutoFixHigh, labelKey: 'chat.input.createPrototype', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { icon: BusinessCenter, labelKey: 'chat.input.buildBusinessPlan', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { icon: Create, labelKey: 'chat.input.createContent', color: '#0A5E49', bg: '#E2F5EF', border: '#A7F3D0' },
  { icon: Science, labelKey: 'chat.input.analyzeResearch', color: '#9B2042', bg: '#FDEDF1', border: '#FECDD3' },
  { icon: School, labelKey: 'chat.input.learnSomething', color: '#0891B2', bg: '#E0F7FA', border: '#A5F3FC' },
];

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  selectedModel: string;
}

export default function ChatInput({ onSend, isStreaming, selectedModel }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { data: models } = useGetModelsQuery();
  const modelInfo = findModelInfo(models, selectedModel);

  const onSpeechResult = useCallback((transcript: string) => {
    setValue((prev) => (prev ? prev + ' ' + transcript : transcript));
  }, []);

  const { isListening, isSupported, error: speechError, startListening, stopListening } =
    useSpeechRecognition(onSpeechResult);

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

  const handleMicClick = () => {
    if (!isSupported) {
      setToast(t('chat.input.voiceNotSupported'));
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleChipClick = (label: string) => {
    const prompt = `I'd like to: ${label}`;
    onSend(prompt);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue((prev) => prev ? `${prev}\n[Attached: ${file.name}]` : `[Attached: ${file.name}]`);
      setToast(`Attached: ${file.name}`);
    }
    e.target.value = '';
  };

  return (
    <Box
      sx={{
        borderTop: '1px solid var(--border)',
        bgcolor: 'var(--card)',
        px: 2.5,
        pt: 1.5,
        pb: 1.5,
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.csv,.json,.md,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Input container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'var(--bg)',
          border: '1px solid',
          borderColor: isListening ? '#7C3AED' : 'var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus-within': {
            borderColor: isListening ? '#7C3AED' : 'var(--accent)',
            boxShadow: isListening ? '0 0 0 3px rgba(124,58,237,0.15)' : '0 0 0 3px var(--accent-border)',
          },
        }}
      >
        {/* Textarea */}
        <TextField
          multiline
          minRows={2}
          maxRows={6}
          fullWidth
          placeholder={isListening ? t('chat.input.listening') : t('chat.input.placeholder')}
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
              color: isListening ? '#7C3AED' : 'var(--text3)',
              opacity: 1,
            },
          }}
        />

        {/* Listening indicator */}
        {isListening && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pb: 0.5 }}>
            <Box
              sx={{
                width: 6, height: 6, borderRadius: '50%',
                bgcolor: '#7C3AED',
                animation: 'pulse 1.2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(0.8)' },
                },
              }}
            />
            <Typography sx={{ fontSize: '0.7rem', color: '#7C3AED', fontWeight: 500 }}>
              {t('chat.input.listeningIndicator')}
            </Typography>
          </Box>
        )}

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
          {/* Left: small icon buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={t('chat.input.tooltipEmoji')}>
              <IconButton
                size="small"
                sx={{
                  width: 28, height: 28, borderRadius: '8px',
                  color: 'var(--text3)',
                  '&:hover': { color: '#D97706', bgcolor: '#FFFBEB' },
                }}
              >
                <EmojiEmotions sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('chat.input.tooltipFile')}>
              <IconButton
                size="small"
                onClick={handleFileClick}
                sx={{
                  width: 28, height: 28, borderRadius: '8px',
                  color: 'var(--text3)',
                  '&:hover': { color: '#2563EB', bgcolor: '#EFF6FF' },
                }}
              >
                <AttachFile sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('chat.input.tooltipReactions')}>
              <IconButton
                size="small"
                sx={{
                  width: 28, height: 28, borderRadius: '8px',
                  color: 'var(--text3)',
                  '&:hover': { color: '#7C3AED', bgcolor: '#F3EEFF' },
                }}
              >
                <AddReaction sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Right: model pill, mic, send */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Model selector pill */}
            <Chip
              label={modelInfo?.name ?? selectedModel}
              size="small"
              onClick={() => {}}
              sx={{
                height: 26,
                borderRadius: '13px',
                bgcolor: 'var(--bg2)',
                border: '1px solid var(--border)',
                color: 'var(--text2)',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                '& .MuiChip-label': { px: 1 },
                '&:hover': {
                  bgcolor: 'var(--bg3)',
                  borderColor: 'var(--border2)',
                },
              }}
            />

            {/* Mic button */}
            <Tooltip title={isListening ? t('chat.input.tooltipStopListening') : t('chat.input.tooltipVoice')}>
              <IconButton
                size="small"
                onClick={handleMicClick}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  color: isListening ? '#fff' : 'var(--text3)',
                  bgcolor: isListening ? '#7C3AED' : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    color: isListening ? '#fff' : 'var(--text)',
                    bgcolor: isListening ? '#6D28D9' : 'var(--bg2)',
                  },
                }}
              >
                {isListening ? <MicOff sx={{ fontSize: 16 }} /> : <Mic sx={{ fontSize: 16 }} />}
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
                    width: 32,
                    height: 32,
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
                    <Send sx={{ fontSize: 14 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Action chips row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          mt: 1,
          overflowX: 'auto',
          pb: 0.5,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {ACTION_CHIP_KEYS.map(({ icon: Icon, labelKey, color, bg, border }) => (
          <Chip
            key={labelKey}
            icon={<Icon sx={{ fontSize: '14px !important', color: `${color} !important` }} />}
            label={t(labelKey)}
            size="small"
            onClick={() => handleChipClick(t(labelKey))}
            sx={{
              height: 28,
              borderRadius: '14px',
              bgcolor: bg,
              border: `1px solid ${border}`,
              color,
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
              '& .MuiChip-label': { px: 0.75 },
              '& .MuiChip-icon': { ml: 0.75 },
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: color,
                color: '#fff',
                borderColor: color,
                '& .MuiChip-icon': { color: '#fff !important' },
                transform: 'translateY(-1px)',
                boxShadow: `0 3px 8px ${color}33`,
              },
            }}
          />
        ))}
      </Box>

      {/* Speech error toast */}
      <Snackbar
        open={!!speechError || !!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast?.startsWith('Attached') ? 'success' : 'error'} onClose={() => setToast(null)} sx={{ width: '100%' }}>
          {toast || speechError}
        </Alert>
      </Snackbar>
    </Box>
  );
}
