'use client';

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Pause,
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
  Close,
  Videocam,
  StopCircle,
  Cameraswitch,
  Replay,
  ScreenShare,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSpeechRecognition, type SpeechCaptureResult } from '@/hooks/useSpeechRecognition';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { useScreenRecorder } from '@/hooks/useScreenRecorder';
import { useGetModelsQuery, findModelInfo } from '@/store/api/modelsApi';
import type { AttachedFile } from '@/store/slices/chatSlice';

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
  onSend: (message: string, file?: AttachedFile | null) => void;
  onPause: () => void;
  isStreaming: boolean;
  selectedModel: string;
}

export default function ChatInput({ onSend, onPause, isStreaming, selectedModel }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const screenPreviewRef = useRef<HTMLVideoElement>(null);
  const recordedScreenRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();
  const { data: models } = useGetModelsQuery();
  const modelInfo = findModelInfo(models, selectedModel);

  const onSpeechResult = useCallback(({ audioFile }: SpeechCaptureResult) => {
    if (audioFile) {
      onSend('', audioFile);
      setToast('Voice message sent');
    }
  }, [onSend]);

  const { isListening, isSupported, error: speechError, startListening, stopListening } =
    useSpeechRecognition(onSpeechResult);
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

  const combinedError = speechError || videoError || screenError;

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

  const handleSend = () => {
    const trimmed = value.trim();
    if ((!trimmed && !attachedFile) || isStreaming) return;

    const message = trimmed || t('chat.input.voiceMessageFallback', { defaultValue: 'Voice message' });
    onSend(message, attachedFile);
    setValue('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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

  const handleVideoClick = async () => {
    if (!isVideoSupported) {
      setToast('Webcam recording is not supported in this browser.');
      return;
    }

    if (!isCameraOpen) {
      const opened = await openCamera();
      if (opened) {
        await startRecording();
      }
      return;
    }

    if (!isVideoRecording && !recordedVideo) {
      await startRecording();
    }
  };

  const handleScreenShareClick = async () => {
    if (!isScreenSupported) {
      setToast('Screen recording is not supported in this browser.');
      return;
    }

    if (!isScreenPickerOpen) {
      await startScreenRecording();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFile({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result as string,
          source: 'upload',
        });
        setToast(`Attached: ${file.name}`);
      };
      reader.onerror = () => {
        setToast('Could not read the selected file.');
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCloseVideoDialog = () => {
    closeRecorder();
  };

  const handleSendRecordedVideo = async () => {
    if (isProcessingVideo) {
      return;
    }

    if (!isVideoRecording && !recordedVideo) {
      await startRecording();
      return;
    }

    if (isVideoRecording) {
      setIsProcessingVideo(true);
      const stoppedVideo = await stopRecording();
      setIsProcessingVideo(false);
      if (!stoppedVideo) {
        setToast('Could not finish the video recording.');
      }
      return;
    }

    if (recordedVideo) {
      const videoToSend = recordedVideo;
      setIsProcessingVideo(true);
      onSend('', videoToSend);
      setToast('Video message sent');
      closeRecorder();
      setIsProcessingVideo(false);
    }
  };

  const handleSendRecordedScreen = async () => {
    if (isProcessingVideo) {
      return;
    }

    if (!isScreenRecording && !recordedScreen) {
      await startScreenRecording();
      return;
    }

    if (isScreenRecording) {
      setIsProcessingVideo(true);
      const stoppedScreen = await stopScreenRecording();
      setIsProcessingVideo(false);
      if (!stoppedScreen) {
        setToast('Could not finish the screen recording.');
      }
      return;
    }

    if (recordedScreen) {
      const screenToSend = recordedScreen;
      setIsProcessingVideo(true);
      onSend('', screenToSend);
      setToast('Screen recording sent');
      closeScreenRecorder();
      setIsProcessingVideo(false);
    }
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.csv,.json,.md,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp,.mp3,.wav,.m4a,.webm"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

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
        <textarea
          ref={textareaRef}
          rows={2}
          placeholder={isListening ? t('chat.input.listening') : t('chat.input.placeholder')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            color: 'var(--text)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            padding: '12px 16px 4px',
            minHeight: '68px',
            maxHeight: '168px',
          }}
        />

        {attachedFile && attachedFile.source !== 'voice' && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mx: 1.5,
              mb: 0.5,
              px: 1.25,
              py: 0.75,
              borderRadius: '10px',
              bgcolor: 'var(--bg2)',
              border: '1px solid var(--border)',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                {attachedFile.name}
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>
                File attached
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setAttachedFile(null)} sx={{ color: 'var(--text3)' }}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}

        {isListening && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pb: 0.5 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={t('chat.input.tooltipEmoji')}>
              <IconButton
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
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
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  color: 'var(--text3)',
                  '&:hover': { color: '#2563EB', bgcolor: '#EFF6FF' },
                }}
              >
                <AttachFile sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={isCameraOpen ? 'Open video recorder' : 'Record video message'}>
              <IconButton
                size="small"
                onClick={() => {
                  void handleVideoClick();
                }}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  color: isVideoRecording ? '#fff' : 'var(--text3)',
                  bgcolor: isVideoRecording ? '#DC2626' : 'transparent',
                  '&:hover': {
                    color: isVideoRecording ? '#fff' : '#DC2626',
                    bgcolor: isVideoRecording ? '#B91C1C' : '#FEF2F2',
                  },
                }}
              >
                {isVideoRecording ? <StopCircle sx={{ fontSize: 16 }} /> : <Videocam sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title={isScreenPickerOpen ? 'Screen recorder open' : 'Share screen'}>
              <IconButton
                size="small"
                onClick={() => {
                  void handleScreenShareClick();
                }}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  color: isScreenRecording ? '#fff' : 'var(--text3)',
                  bgcolor: isScreenRecording ? '#059669' : 'transparent',
                  '&:hover': {
                    color: isScreenRecording ? '#fff' : '#059669',
                    bgcolor: isScreenRecording ? '#047857' : '#ECFDF5',
                  },
                }}
              >
                <ScreenShare sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('chat.input.tooltipReactions')}>
              <IconButton
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  color: 'var(--text3)',
                  '&:hover': { color: '#7C3AED', bgcolor: '#F3EEFF' },
                }}
              >
                <AddReaction sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

            <Tooltip title={isStreaming ? 'Pause response' : 'Send (Enter)'}>
              <span>
                <IconButton
                  onClick={isStreaming ? onPause : handleSend}
                  disabled={!isStreaming && (!value.trim() && !attachedFile)}
                  size="small"
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: isStreaming ? '#9B2042' : (value.trim() || attachedFile) ? 'var(--accent)' : 'var(--bg3)',
                    color: isStreaming || (value.trim() || attachedFile) ? '#fff' : 'var(--text3)',
                    borderRadius: '10px',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: isStreaming ? '#861C39' : (value.trim() || attachedFile) ? 'var(--accent2)' : 'var(--bg3)',
                      transform: isStreaming || (value.trim() || attachedFile) ? 'scale(1.05)' : 'none',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'var(--bg3)',
                      color: 'var(--text3)',
                    },
                  }}
                >
                  {isStreaming ? (
                    <Pause sx={{ fontSize: 16 }} />
                  ) : (
                    <Send sx={{ fontSize: 14 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>

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

      <Snackbar
        open={!!combinedError || !!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={
            toast === 'Voice message sent' || toast === 'Video message sent' || toast === 'Screen recording sent' || toast?.includes('Attached')
              ? 'success'
              : 'error'
          }
          onClose={() => setToast(null)}
          sx={{ width: '100%' }}
        >
          {toast || combinedError}
        </Alert>
      </Snackbar>

      <Dialog
        open={isCameraOpen}
        onClose={handleCloseVideoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 2, bgcolor: '#111', color: '#fff' }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 1.5 }}>
            {recordedVideo ? 'Preview video message' : isVideoRecording ? 'Recording video message...' : 'Camera ready'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)' }}>
              {isVideoRecording ? `Recording ${formatDuration(elapsedSeconds)}` : recordedVideo ? 'Ready to send' : 'Tap record to start'}
            </Typography>
            <Button
              onClick={() => {
                void switchCamera();
              }}
              startIcon={<Cameraswitch />}
              disabled={isVideoRecording || isProcessingVideo}
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
              poster=""
              style={{
                width: '100%',
                borderRadius: '14px',
                backgroundColor: '#000',
                minHeight: '280px',
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
                borderRadius: '14px',
                backgroundColor: '#000',
                minHeight: '280px',
                objectFit: 'cover',
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, bgcolor: '#111' }}>
          <Button onClick={handleCloseVideoDialog} sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Cancel
          </Button>
          {recordedVideo && (
            <Button
              onClick={() => {
                void retakeRecording();
              }}
              startIcon={<Replay />}
              disabled={isProcessingVideo}
              sx={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Retake
            </Button>
          )}
          <Button
            onClick={() => {
              void handleSendRecordedVideo();
            }}
            variant="contained"
            color="error"
            disabled={isProcessingVideo}
          >
            {isProcessingVideo ? 'Processing...' : isVideoRecording ? 'Stop' : recordedVideo ? 'Send video' : 'Record'}
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
                ? 'Ready to send'
                : 'Choose an area or window to record'}
          </Typography>
          {recordedScreen ? (
            <video
              ref={recordedScreenRef}
              controls
              src={recordedScreen.dataUrl}
              style={{
                width: '100%',
                borderRadius: '14px',
                backgroundColor: '#000',
                minHeight: '280px',
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
                borderRadius: '14px',
                backgroundColor: '#000',
                minHeight: '280px',
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
              disabled={isProcessingVideo}
              sx={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Retake
            </Button>
          )}
          <Button
            onClick={() => {
              void handleSendRecordedScreen();
            }}
            variant="contained"
            color="success"
            disabled={isProcessingVideo}
          >
            {isProcessingVideo ? 'Processing...' : isScreenRecording ? 'Stop' : recordedScreen ? 'Send recording' : 'Start'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
