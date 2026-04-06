'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Tooltip, Typography, Snackbar, Alert } from '@mui/material';
import {
  Mic,
  MicOff,
  AttachFile,
  Image as ImageIcon,
  Keyboard,
  Videocam,
  ScreenShare,
  Search,
  Computer,
  Close,
  InsertDriveFile,
} from '@mui/icons-material';
import { useAppDispatch } from '@/store/hooks';
import { setInitialPrompt, setAttachedFile, type AttachedFile as AttachedFileType } from '@/store/slices/chatSlice';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTranslation } from 'react-i18next';

const ACCEPTED_FILE_TYPES = {
  attach: '.pdf,.txt,.csv,.json,.md,.doc,.docx',
  image: '.png,.jpg,.jpeg,.gif,.webp,.svg',
  video: '.mp4,.mov,.webm,.avi,.mkv',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function HeroSearchCard() {
  const [query, setQuery] = useState('');
  const [file, setFile] = useState<AttachedFileType | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: 'error' | 'info' | 'success' } | null>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const onSpeechResult = useCallback((transcript: string) => {
    setQuery((prev) => (prev ? prev + ' ' + transcript : transcript));
  }, []);

  const { isListening, isSupported: isSpeechSupported, error: speechError, startListening, stopListening } =
    useSpeechRecognition(onSpeechResult);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed && !file) {
      textareaRef.current?.focus();
      return;
    }

    // Auto-generate prompt if user attached a file but typed nothing
    let prompt = trimmed;
    if (!prompt && file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (isVideo) {
        prompt = t('home.search.promptVideo', { filename: file.name });
      } else if (isImage) {
        prompt = t('home.search.promptImage', { filename: file.name });
      } else {
        prompt = t('home.search.promptFile', { filename: file.name });
      }
    }

    dispatch(setInitialPrompt(prompt));
    if (file) {
      dispatch(setAttachedFile(file));
    }

    router.push('/chat');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = () => {
    if (!isSpeechSupported) {
      setToast({ message: t('home.search.voiceNotSupported'), severity: 'error' });
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setToast({ message: t('home.search.fileTooLarge'), severity: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const attachedFile: AttachedFileType = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        dataUrl: reader.result as string,
      };
      setFile(attachedFile);

      // Auto-fill search with context-aware prompt if textarea is empty
      if (!query.trim()) {
        const isImage = selectedFile.type.startsWith('image/');
        const isVideo = selectedFile.type.startsWith('video/');
        let autoPrompt: string;
        if (isVideo) {
          autoPrompt = t('home.search.promptVideo', { filename: selectedFile.name });
        } else if (isImage) {
          autoPrompt = t('home.search.promptImage', { filename: selectedFile.name });
        } else {
          autoPrompt = t('home.search.promptFile', { filename: selectedFile.name });
        }
        setQuery(autoPrompt);
      }

      setToast({ message: t('home.search.attached', { filename: selectedFile.name }), severity: 'success' });
    };
    reader.onerror = () => {
      setToast({ message: t('home.search.fileReadError'), severity: 'error' });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
    e.target.value = '';
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleIconClick = (tip: string) => {
    switch (tip) {
      case t('home.search.tooltipVoice'):
        handleMicClick();
        break;
      case t('home.search.tooltipFile'):
        fileInputRef.current?.click();
        break;
      case t('home.search.tooltipImage'):
        imageInputRef.current?.click();
        break;
      case t('home.search.tooltipVoiceTyping'):
        handleMicClick();
        break;
      case t('home.search.tooltipVideo'):
        videoInputRef.current?.click();
        break;
      case t('home.search.tooltipScreen'):
        setToast({ message: t('home.search.screenShareComingSoon'), severity: 'info' });
        break;
    }
  };

  const ICON_BUTTONS = [
    { icon: isListening ? <MicOff sx={{ fontSize: 15 }} /> : <Mic sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipVoice'), color: '#7C3AED', bg: isListening ? '#7C3AED' : '#F3EEFF', border: 'rgba(124,58,237,0.25)', activeColor: isListening ? '#fff' : undefined },
    { icon: <AttachFile sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipFile'), color: '#D97706', bg: '#FFFBEB', border: 'rgba(217,119,6,0.25)' },
    { icon: <ImageIcon sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipImage'), color: '#2563EB', bg: '#EFF6FF', border: 'rgba(37,99,235,0.25)' },
    { icon: <Keyboard sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipVoiceTyping'), color: '#0891B2', bg: '#E0F7FA', border: 'rgba(8,145,178,0.25)' },
    { icon: <Videocam sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipVideo'), color: '#DC2626', bg: '#FEF2F2', border: 'rgba(220,38,38,0.22)' },
    { icon: <ScreenShare sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipScreen'), color: '#059669', bg: '#ECFDF5', border: 'rgba(5,150,105,0.25)' },
  ];

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.attach}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.image}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.video}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Box
        sx={{
          width: '100%',
          maxWidth: 720,
          mx: 'auto',
          bgcolor: '#fff',
          border: '1.5px solid',
          borderColor: isListening ? 'rgba(124,58,237,0.5)' : 'rgba(0,0,0,0.1)',
          borderRadius: '20px',
          boxShadow: isListening ? '0 0 0 3px rgba(124,58,237,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          '&:focus-within': {
            borderColor: isListening ? 'rgba(124,58,237,0.5)' : 'rgba(200,98,42,0.35)',
            boxShadow: isListening ? '0 0 0 3px rgba(124,58,237,0.15)' : '0 4px 24px rgba(200,98,42,0.1)',
          },
        }}
      >
        {/* Top Row: Textarea + avatar icons */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, px: '18px', pt: '14px', pb: '6px' }}>
          <Box
            component="textarea"
            ref={textareaRef}
            value={query}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? t('home.search.listening') : t('home.search.placeholder')}
            rows={1}
            sx={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '1rem',
              color: 'var(--text, #1C1A16)',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.55,
              minHeight: '26px',
              overflow: 'hidden',
              p: 0,
              '&::placeholder': {
                color: isListening ? '#7C3AED' : 'rgba(0,0,0,0.4)',
                fontSize: '0.95rem',
              },
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0, mt: '2px' }}>
            <Box
              sx={{
                width: 26, height: 26, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                cursor: 'pointer', transition: 'transform 0.15s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                '&:hover': { transform: 'scale(1.1)' },
              }}
              title={t('home.search.labelAssistant')}
            >
              <Box component="svg" viewBox="0 0 24 24" fill="white" sx={{ width: 13, height: 13 }}>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </Box>
            </Box>
            <Box
              sx={{
                width: 26, height: 26, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                cursor: 'pointer', transition: 'transform 0.15s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                '&:hover': { transform: 'scale(1.1)' },
              }}
              title={t('home.search.labelExtension')}
            >
              <Box component="svg" viewBox="0 0 24 24" fill="white" sx={{ width: 13, height: 13 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* File preview */}
        {file && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mx: '18px',
              mb: '4px',
              px: 1.5,
              py: 0.75,
              bgcolor: 'rgba(0,0,0,0.03)',
              borderRadius: '10px',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            {file.type.startsWith('image/') ? (
              <Box
                component="img"
                src={file.dataUrl}
                alt={file.name}
                sx={{ width: 28, height: 28, borderRadius: '6px', objectFit: 'cover' }}
              />
            ) : file.type.startsWith('video/') ? (
              <Videocam sx={{ fontSize: 18, color: '#DC2626' }} />
            ) : (
              <InsertDriveFile sx={{ fontSize: 18, color: '#D97706' }} />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {file.name}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                {formatFileSize(file.size)}
              </Typography>
            </Box>
            <Box
              component="button"
              onClick={removeFile}
              sx={{
                width: 20, height: 20, borderRadius: '50%',
                border: 'none', bgcolor: 'rgba(0,0,0,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, p: 0,
                color: 'text.secondary',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.15)', color: 'text.primary' },
              }}
            >
              <Close sx={{ fontSize: 12 }} />
            </Box>
          </Box>
        )}

        {/* Listening indicator */}
        {isListening && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mx: '18px',
              mb: '4px',
              px: 1.5,
              py: 0.5,
            }}
          >
            <Box
              sx={{
                width: 8, height: 8, borderRadius: '50%',
                bgcolor: '#7C3AED',
                animation: 'pulse 1.2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(0.8)' },
                },
              }}
            />
            <Typography sx={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: 500 }}>
              {t('home.search.listeningIndicator')}
            </Typography>
          </Box>
        )}

        {/* Bottom Bar: Icon boxes + separator + Agent chip + spacer + Go */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', px: '10px', pt: '6px', pb: '8px' }}>
          {ICON_BUTTONS.map((btn) => (
            <Tooltip key={btn.tip} title={btn.tip} arrow placement="top">
              <Box
                component="button"
                onClick={() => handleIconClick(btn.tip)}
                sx={{
                  width: 36, height: 36,
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: btn.border,
                  bgcolor: btn.bg,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  p: 0, flexShrink: 0,
                  color: btn.activeColor || btn.color,
                  transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                  '&:hover': {
                    transform: 'translateY(-2px) scale(1.06)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                    bgcolor: btn.color,
                    borderColor: btn.color,
                    color: '#fff',
                  },
                  '&:active': { transform: 'scale(0.95)' },
                }}
              >
                {btn.icon}
              </Box>
            </Tooltip>
          ))}

          {/* Separator */}
          <Box sx={{ width: '1px', height: 22, bgcolor: 'rgba(0,0,0,0.1)', flexShrink: 0, mx: '2px' }} />

          {/* Agent chip */}
          <Box
            component="button"
            onClick={() => router.push('/agents')}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              px: '12px', py: '5px',
              bgcolor: 'rgba(0,0,0,0.04)',
              border: '1.5px solid rgba(0,0,0,0.1)',
              borderRadius: '2rem',
              cursor: 'pointer',
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '0.78rem', fontWeight: 600,
              color: 'rgba(0,0,0,0.6)',
              transition: 'all 0.15s',
              flexShrink: 0, whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: '#C8622A',
                color: '#C8622A',
                bgcolor: 'rgba(200,98,42,0.06)',
              },
            }}
          >
            <Computer sx={{ fontSize: 13 }} />
            {t('home.search.labelAgent')}
            <Box component="span" sx={{ fontSize: '0.7rem', opacity: 0.6 }}>+</Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Go button */}
          <Box
            component="button"
            onClick={handleSubmit}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              px: '16px', py: '7px',
              bgcolor: (query.trim() || file) ? '#C8622A' : 'rgba(200,98,42,0.5)',
              border: 'none',
              borderRadius: '2rem',
              cursor: (query.trim() || file) ? 'pointer' : 'default',
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: '0.82rem', fontWeight: 600,
              color: '#fff',
              transition: 'all 0.15s',
              flexShrink: 0, whiteSpace: 'nowrap',
              '&:hover': (query.trim() || file) ? {
                bgcolor: '#b5561f',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(200,98,42,0.3)',
              } : {},
            }}
          >
            <Search sx={{ fontSize: 14 }} />
            {t('home.search.letsGo')}
          </Box>
        </Box>
      </Box>

      {/* Speech error toast */}
      <Snackbar
        open={!!speechError || !!toast}
        autoHideDuration={4000}
        onClose={() => { setToast(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast?.severity || 'error'}
          onClose={() => setToast(null)}
          sx={{ width: '100%' }}
        >
          {toast?.message || speechError}
        </Alert>
      </Snackbar>
    </>
  );
}
