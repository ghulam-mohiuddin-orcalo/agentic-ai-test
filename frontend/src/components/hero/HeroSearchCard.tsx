'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Tooltip, Typography, Snackbar, Alert, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
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
  Cameraswitch,
  Replay,
} from '@mui/icons-material';
import { useAppDispatch } from '@/store/hooks';
import { setAttachedFile, setInitialPrompt, type AttachedFile as AttachedFileType } from '@/store/slices/chatSlice';
import { useSpeechRecognition, type SpeechCaptureResult } from '@/hooks/useSpeechRecognition';
import { useScreenRecorder } from '@/hooks/useScreenRecorder';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { setPendingVoiceMessage } from '@/lib/pendingVoiceMessage';
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
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const screenPreviewRef = useRef<HTMLVideoElement>(null);
  const recordedScreenRef = useRef<HTMLVideoElement>(null);

  const onSpeechTypingResult = useCallback(({ transcript }: SpeechCaptureResult) => {
    if (transcript) {
      setQuery((prev) => (prev ? prev + ' ' + transcript : transcript));
    }
  }, []);

  const onVoiceMessageResult = useCallback((result: SpeechCaptureResult) => {
    if (!result.audioFile) {
      return;
    }

    setFile(result.audioFile);
    setToast({ message: 'Voice message ready. Opening chat...', severity: 'success' });
    setPendingVoiceMessage(result.audioFile);
    router.push('/chat');
  }, [router]);

  const {
    isListening: isVoiceRecording,
    isSupported: isVoiceInputSupported,
    error: voiceInputError,
    startListening: startVoiceRecording,
    stopListening: stopVoiceRecording,
  } = useSpeechRecognition(onVoiceMessageResult, 'record');

  const {
    isListening: isVoiceTyping,
    isSupported: isSpeechSupported,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition(onSpeechTypingResult, 'dictation');
  const {
    isSupported: isVideoSupported,
    isRecording: isVideoRecording,
    isCameraOpen,
    previewStream,
    recordedVideo,
    elapsedSeconds,
    error: videoError,
    openCamera,
    startRecording,
    stopRecording,
    closeRecorder,
    retakeRecording,
    switchCamera,
  } = useVideoRecorder();
  const {
    isSupported: isScreenSupported,
    isRecording: isScreenRecording,
    isPickerOpen: isScreenPickerOpen,
    previewStream: screenPreviewStream,
    recordedVideo: recordedScreen,
    elapsedSeconds: screenElapsedSeconds,
    error: screenError,
    startRecording: startScreenRecording,
    stopRecording: stopScreenRecording,
    retakeRecording: retakeScreenRecording,
    closeRecorder: closeScreenRecorder,
  } = useScreenRecorder();
  const isAnyVoiceActive = isVoiceRecording || isVoiceTyping;
  const recorderError = voiceInputError || speechError || videoError || screenError;

  useEffect(() => {
    if (!isCameraOpen || !videoPreviewRef.current) {
      return;
    }

    videoPreviewRef.current.srcObject = previewStream;
    if (previewStream) {
      videoPreviewRef.current.onloadedmetadata = () => {
        void videoPreviewRef.current?.play().catch(() => {});
      };
      void videoPreviewRef.current.play().catch(() => {});
    }
  }, [isCameraOpen, previewStream]);

  const setVideoPreviewNode = useCallback((node: HTMLVideoElement | null) => {
    videoPreviewRef.current = node;

    if (!node) {
      return;
    }

    node.muted = true;
    node.autoplay = true;
    node.playsInline = true;
    node.srcObject = previewStream;

    if (previewStream) {
      node.onloadedmetadata = () => {
        void node.play().catch(() => {});
      };
      void node.play().catch(() => {});
    }
  }, [previewStream]);

  useEffect(() => {
    if (recordedVideoRef.current && recordedVideo?.dataUrl) {
      recordedVideoRef.current.load();
      void recordedVideoRef.current.play().catch(() => {});
    }
  }, [recordedVideo]);

  useEffect(() => {
    if (!isScreenPickerOpen || !screenPreviewRef.current) {
      return;
    }

    screenPreviewRef.current.srcObject = screenPreviewStream;
    if (screenPreviewStream) {
      screenPreviewRef.current.onloadedmetadata = () => {
        void screenPreviewRef.current?.play().catch(() => {});
      };
      void screenPreviewRef.current.play().catch(() => {});
    }
  }, [isScreenPickerOpen, screenPreviewStream]);

  const setScreenPreviewNode = useCallback((node: HTMLVideoElement | null) => {
    screenPreviewRef.current = node;

    if (!node) {
      return;
    }

    node.muted = true;
    node.autoplay = true;
    node.playsInline = true;
    node.srcObject = screenPreviewStream;

    if (screenPreviewStream) {
      node.onloadedmetadata = () => {
        void node.play().catch(() => {});
      };
      void node.play().catch(() => {});
    }
  }, [screenPreviewStream]);

  useEffect(() => {
    if (recordedScreenRef.current && recordedScreen?.dataUrl) {
      recordedScreenRef.current.load();
      void recordedScreenRef.current.play().catch(() => {});
    }
  }, [recordedScreen]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const handleVoiceInputClick = () => {
    if (!isVoiceInputSupported) {
      setToast({ message: t('home.search.voiceNotSupported'), severity: 'error' });
      return;
    }

    if (isVoiceTyping) {
      stopListening();
    }

    if (isVoiceRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const handleVoiceTypingClick = () => {
    if (!isSpeechSupported) {
      setToast({ message: t('home.search.voiceNotSupported'), severity: 'error' });
      return;
    }

    if (isVoiceRecording) {
      stopVoiceRecording();
    }

    if (isVoiceTyping) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleVideoClick = async () => {
    if (!isVideoSupported) {
      setToast({ message: 'Webcam recording is not supported in this browser.', severity: 'error' });
      return;
    }

    if (!isCameraOpen) {
      const opened = await openCamera();
      if (opened) {
        await startRecording();
      }
      return;
    }

    if (isVideoRecording) {
      await stopRecording();
      return;
    }

    if (!isVideoRecording && !recordedVideo) {
      await startRecording();
    }
  };

  const handleScreenShareClick = async () => {
    if (!isScreenSupported) {
      setToast({ message: 'Screen recording is not supported in this browser.', severity: 'error' });
      return;
    }

    if (!isScreenPickerOpen) {
      await startScreenRecording();
    }
  };

  const handleAttachRecordedVideo = () => {
    if (!recordedVideo) return;

    setFile(recordedVideo);
    if (!query.trim()) {
      setQuery(t('home.search.promptVideo', { filename: recordedVideo.name }));
    }
    setToast({ message: 'Video attached from webcam.', severity: 'success' });
    closeRecorder();
  };

  const handleAttachRecordedScreen = () => {
    if (!recordedScreen) return;

    setFile(recordedScreen);
    if (!query.trim()) {
      setQuery(t('home.search.promptVideo', { filename: recordedScreen.name }));
    }
    setToast({ message: 'Screen recording attached.', severity: 'success' });
    closeScreenRecorder();
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
        source: 'upload',
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
        handleVoiceInputClick();
        break;
      case t('home.search.tooltipVoiceTyping'):
        handleVoiceTypingClick();
        break;
      case t('home.search.tooltipFile'):
        fileInputRef.current?.click();
        break;
      case t('home.search.tooltipImage'):
        imageInputRef.current?.click();
        break;
      case t('home.search.tooltipVideo'):
        void handleVideoClick();
        break;
      case t('home.search.tooltipScreen'):
        void handleScreenShareClick();
        break;
    }
  };

  const ICON_BUTTONS = [
    { icon: isVoiceRecording ? <MicOff sx={{ fontSize: 15 }} /> : <Mic sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipVoice'), color: '#7C3AED', bg: isVoiceRecording ? '#7C3AED' : '#F3EEFF', border: 'rgba(124,58,237,0.25)', activeColor: isVoiceRecording ? '#fff' : undefined },
    { icon: <AttachFile sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipFile'), color: '#D97706', bg: '#FFFBEB', border: 'rgba(217,119,6,0.25)' },
    { icon: <ImageIcon sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipImage'), color: '#2563EB', bg: '#EFF6FF', border: 'rgba(37,99,235,0.25)' },
    { icon: <Keyboard sx={{ fontSize: 15 }} />, tip: t('home.search.tooltipVoiceTyping'), color: '#0891B2', bg: isVoiceTyping ? '#0891B2' : '#E0F7FA', border: 'rgba(8,145,178,0.25)', activeColor: isVoiceTyping ? '#fff' : undefined },
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
      <Box
        sx={{
          width: '100%',
          maxWidth: 720,
          mx: 'auto',
          bgcolor: '#fff',
          border: '1.5px solid',
          borderColor: isAnyVoiceActive ? 'rgba(124,58,237,0.5)' : 'rgba(0,0,0,0.1)',
          borderRadius: '20px',
          boxShadow: isAnyVoiceActive ? '0 0 0 3px rgba(124,58,237,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          '&:focus-within': {
            borderColor: isAnyVoiceActive ? 'rgba(124,58,237,0.5)' : 'rgba(200,98,42,0.35)',
            boxShadow: isAnyVoiceActive ? '0 0 0 3px rgba(124,58,237,0.15)' : '0 4px 24px rgba(200,98,42,0.1)',
          },
        }}
      >
        {/* Top Row: Textarea + avatar icons */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, px: '18px', pt: '14px', pb: '6px' }}>
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isVoiceTyping ? t('home.search.listening') : isVoiceRecording ? 'Recording voice message...' : t('home.search.placeholder')}
            rows={1}
            style={{
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
              padding: 0,
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
        {isAnyVoiceActive && (
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
              {isVoiceRecording ? 'Recording voice message' : t('home.search.listeningIndicator')}
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
        open={!!recorderError || !!toast}
        autoHideDuration={4000}
        onClose={() => { setToast(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast?.severity || 'error'}
          onClose={() => setToast(null)}
          sx={{ width: '100%' }}
        >
          {toast?.message || recorderError}
        </Alert>
      </Snackbar>

      <Dialog open={isCameraOpen} onClose={closeRecorder} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 2, bgcolor: '#111', color: '#fff' }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 1.5 }}>
            {recordedVideo ? 'Preview webcam video' : isVideoRecording ? 'Recording webcam video...' : 'Camera ready'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)' }}>
              {isVideoRecording ? `Recording ${formatDuration(elapsedSeconds)}` : recordedVideo ? 'Ready to attach' : 'Tap record to start'}
            </Typography>
            <Button
              onClick={() => {
                void switchCamera();
              }}
              startIcon={<Cameraswitch />}
              disabled={isVideoRecording}
              sx={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Switch
            </Button>
          </Box>
          {recordedVideo ? (
            <video
              ref={recordedVideoRef}
              controls
              src={recordedVideo.dataUrl}
              style={{
                width: '100%',
                minHeight: '280px',
                borderRadius: '14px',
                backgroundColor: '#000',
              }}
            />
          ) : (
            <video
              ref={setVideoPreviewNode}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                minHeight: '280px',
                borderRadius: '14px',
                backgroundColor: '#000',
                objectFit: 'cover',
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, bgcolor: '#111' }}>
          <Button onClick={closeRecorder} sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Cancel
          </Button>
          {recordedVideo && (
            <Button
              onClick={() => {
                void retakeRecording();
              }}
              startIcon={<Replay />}
              sx={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Retake
            </Button>
          )}
          <Button
            onClick={() => {
              if (recordedVideo) {
                handleAttachRecordedVideo();
              } else {
                void handleVideoClick();
              }
            }}
            variant="contained"
            color="error"
          >
            {isVideoRecording ? 'Stop' : recordedVideo ? 'Attach video' : 'Record'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isScreenPickerOpen} onClose={closeScreenRecorder} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 2, bgcolor: '#111', color: '#fff' }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 1.5 }}>
            {recordedScreen ? 'Preview screen recording' : isScreenRecording ? 'Recording shared screen...' : 'Screen ready'}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)', mb: 1.5 }}>
            {isScreenRecording
              ? `Recording ${formatDuration(screenElapsedSeconds)}`
              : recordedScreen
                ? 'Ready to attach'
                : 'Choose an area or window to record'}
          </Typography>
          {recordedScreen ? (
            <video
              ref={recordedScreenRef}
              controls
              src={recordedScreen.dataUrl}
              style={{
                width: '100%',
                minHeight: '280px',
                borderRadius: '14px',
                backgroundColor: '#000',
              }}
            />
          ) : (
            <video
              ref={setScreenPreviewNode}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                minHeight: '280px',
                borderRadius: '14px',
                backgroundColor: '#000',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, bgcolor: '#111' }}>
          <Button onClick={closeScreenRecorder} sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Cancel
          </Button>
          {recordedScreen && (
            <Button
              onClick={() => {
                void retakeScreenRecording();
              }}
              startIcon={<Replay />}
              sx={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Retake
            </Button>
          )}
          <Button
            onClick={() => {
              if (isScreenRecording) {
                void stopScreenRecording();
              } else if (recordedScreen) {
                handleAttachRecordedScreen();
              } else {
                void handleScreenShareClick();
              }
            }}
            variant="contained"
            color="success"
          >
            {isScreenRecording ? 'Stop' : recordedScreen ? 'Attach recording' : 'Start'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
