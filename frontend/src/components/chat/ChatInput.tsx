'use client';

import { useState, useRef, useCallback, useEffect, KeyboardEvent, useMemo } from 'react';
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
  AttachFile,
  Close,
  Image as ImageIcon,
  KeyboardVoice,
  Mic,
  Pause,
  Replay,
  ScreenShare,
  Send,
  StopCircle,
  Videocam,
  Cameraswitch,
  Description,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { useScreenRecorder } from '@/hooks/useScreenRecorder';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useSpeechDictation } from '@/hooks/useSpeechDictation';
import { useGetModelsQuery, findModelInfo } from '@/store/api/modelsApi';
import type { AttachedFile } from '@/store/slices/chatSlice';
import {
  createAttachmentFromFile,
  formatDuration,
  formatFileSize,
  validateSelectedFile,
} from '@/lib/chatAttachments';
import { clearComposerDraft, readComposerDraft, writeComposerDraft } from '@/lib/composerDraft';

const ACTION_CHIP_KEYS = [
  { labelKey: 'chat.input.useCases', color: '#059669', bg: '#ECFDF5', border: '#BBF7D0' },
  { labelKey: 'chat.input.monitorSituation', color: '#7C3AED', bg: '#F3EEFF', border: '#DDD6FE' },
  { labelKey: 'chat.input.createPrototype', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { labelKey: 'chat.input.buildBusinessPlan', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
];

type ToastState = {
  message: string;
  severity: 'success' | 'error' | 'info';
} | null;

interface ChatInputProps {
  onSend: (message: string, attachments?: AttachedFile[]) => void | Promise<void>;
  onPause: () => void;
  isStreaming: boolean;
  selectedModel: string;
}

function AttachmentPreview({
  attachment,
  onRemove,
}: {
  attachment: AttachedFile;
  onRemove: (id: string) => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1,
        py: 0.9,
        borderRadius: '14px',
        bgcolor: 'rgba(28,26,22,0.04)',
        border: '1px solid rgba(28,26,22,0.08)',
      }}
    >
      {attachment.kind === 'image' ? (
        <Box
          component="img"
          src={attachment.dataUrl}
          alt={attachment.name}
          sx={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            bgcolor:
              attachment.kind === 'video' || attachment.kind === 'screen'
                ? '#FEF2F2'
                : attachment.kind === 'audio'
                  ? '#F3EEFF'
                  : '#FFF7ED',
            color:
              attachment.kind === 'video' || attachment.kind === 'screen'
                ? '#DC2626'
                : attachment.kind === 'audio'
                  ? '#7C3AED'
                  : '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {attachment.kind === 'video' || attachment.kind === 'screen' ? (
            <Videocam sx={{ fontSize: 18 }} />
          ) : attachment.kind === 'audio' ? (
            <Mic sx={{ fontSize: 18 }} />
          ) : (
            <Description sx={{ fontSize: 18 }} />
          )}
        </Box>
      )}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {attachment.name}
        </Typography>
        <Typography sx={{ fontSize: '0.68rem', color: 'var(--text3)' }}>
          {attachment.durationSeconds ? formatDuration(attachment.durationSeconds) : formatFileSize(attachment.size)}
        </Typography>
      </Box>
      <IconButton size="small" onClick={() => onRemove(attachment.id)} sx={{ color: 'var(--text3)' }}>
        <Close sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}

function CaptureDialog({
  open,
  title,
  subtitle,
  previewStream,
  recordedFile,
  onClose,
  onRetake,
  onPrimary,
  primaryLabel,
  primaryColor,
  previewMode = 'cover',
  onSwitchCamera,
  switchDisabled,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  previewStream: MediaStream | null;
  recordedFile: AttachedFile | null;
  onClose: () => void;
  onRetake?: () => void;
  onPrimary: () => void;
  primaryLabel: string;
  primaryColor: 'error' | 'success';
  previewMode?: 'cover' | 'contain';
  onSwitchCamera?: () => void;
  switchDisabled?: boolean;
}) {
  const livePreviewRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const node = livePreviewRef.current;
    if (!node) {
      return;
    }

    node.srcObject = previewStream;
    if (previewStream) {
      node.onloadedmetadata = () => {
        void node.play().catch(() => undefined);
      };
    }
  }, [previewStream]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 2, bgcolor: '#111418', color: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: '0.98rem', fontWeight: 700 }}>{title}</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.68)', mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>
          {onSwitchCamera && (
            <Button
              startIcon={<Cameraswitch />}
              onClick={onSwitchCamera}
              disabled={switchDisabled}
              sx={{ color: 'rgba(255,255,255,0.84)' }}
            >
              Switch
            </Button>
          )}
        </Box>

        {recordedFile ? (
          <Box
            component="video"
            controls
            preload="metadata"
            src={recordedFile.dataUrl}
            sx={{
              width: '100%',
              minHeight: 280,
              borderRadius: '18px',
              bgcolor: '#000',
            }}
          />
        ) : (
          <Box
            component="video"
            ref={livePreviewRef}
            autoPlay
            muted
            playsInline
            sx={{
              width: '100%',
              minHeight: 280,
              borderRadius: '18px',
              bgcolor: '#000',
              objectFit: previewMode,
            }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, bgcolor: '#111418' }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255,255,255,0.75)' }}>
          Cancel
        </Button>
        {recordedFile && onRetake && (
          <Button onClick={onRetake} startIcon={<Replay />} sx={{ color: 'rgba(255,255,255,0.88)' }}>
            Retake
          </Button>
        )}
        <Button onClick={onPrimary} variant="contained" color={primaryColor}>
          {primaryLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ChatInput({ onSend, onPause, isStreaming, selectedModel }: ChatInputProps) {
  const { t } = useTranslation();
  const { data: models } = useGetModelsQuery();
  const modelInfo = findModelInfo(models, selectedModel);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const initialDraft = useMemo(() => readComposerDraft(), []);

  const [value, setValue] = useState(initialDraft.text);
  const [interimText, setInterimText] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>(initialDraft.attachments);
  const [toast, setToast] = useState<ToastState>(null);
  const [isSendingMedia, setIsSendingMedia] = useState(false);

  const voiceRecorder = useVoiceRecorder();
  const dictation = useSpeechDictation(({ finalText, interimText: nextInterim }) => {
    setInterimText(nextInterim);
    if (finalText) {
      setValue((previous) => {
        const spacer = previous.trim().length > 0 ? ' ' : '';
        return `${previous}${spacer}${finalText}`.trimStart();
      });
      setInterimText('');
    }
  });
  const videoRecorder = useVideoRecorder();
  const screenRecorder = useScreenRecorder();

  useEffect(() => {
    writeComposerDraft({ text: value, attachments });
  }, [attachments, value]);

  const displayValue = useMemo(() => {
    if (!interimText) {
      return value;
    }

    const spacer = value.trim().length > 0 ? ' ' : '';
    return `${value}${spacer}${interimText}`;
  }, [interimText, value]);

  const canSend = value.trim().length > 0 || attachments.length > 0;
  const derivedError =
    voiceRecorder.error || dictation.error || videoRecorder.error || screenRecorder.error;
  const visibleToast = toast ?? (derivedError ? { message: derivedError, severity: 'error' as const } : null);

  const handleSend = useCallback(async () => {
    if (!canSend || isStreaming) {
      return;
    }

    setInterimText('');
    await Promise.resolve(onSend(value, attachments));
    setValue('');
    setAttachments([]);
    clearComposerDraft();
  }, [attachments, canSend, isStreaming, onSend, value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleAddFiles = useCallback(
    async (files: FileList | null, category: 'document' | 'image') => {
      const fileList = Array.from(files ?? []);
      if (!fileList.length) {
        return;
      }

      try {
        const nextAttachments = await Promise.all(
          fileList.map(async (file) => {
            const error = validateSelectedFile(file, category);
            if (error) {
              throw new Error(error);
            }

            return createAttachmentFromFile(file, {
              name: file.name,
              type: file.type,
              source: 'upload',
            });
          })
        );

        setAttachments((previous) => [...previous, ...nextAttachments]);
        setToast({
          message:
            nextAttachments.length === 1
              ? `${nextAttachments[0].name} attached`
              : `${nextAttachments.length} files attached`,
          severity: 'success',
        });
      } catch (error) {
        setToast({
          message: error instanceof Error ? error.message : 'Could not attach those files.',
          severity: 'error',
        });
      }
    },
    []
  );

  const removeAttachment = (id: string) => {
    setAttachments((previous) => previous.filter((attachment) => attachment.id !== id));
  };

  const handleVoiceNoteToggle = useCallback(async () => {
    if (isStreaming && !voiceRecorder.isRecording) {
      setToast({ message: 'Pause the current response before sending a new voice note.', severity: 'info' });
      return;
    }

    if (!voiceRecorder.isSupported) {
      setToast({ message: 'Voice recording is not supported in this browser.', severity: 'error' });
      return;
    }

    if (dictation.isListening) {
      dictation.stopListening();
    }

    if (!voiceRecorder.isRecording) {
      await voiceRecorder.startRecording();
      return;
    }

    setIsSendingMedia(true);
    const attachment = await voiceRecorder.stopRecording();
    setIsSendingMedia(false);

    if (!attachment) {
      setToast({ message: 'Could not send the voice note.', severity: 'error' });
      return;
    }

    await Promise.resolve(onSend('', [attachment]));
    setToast({ message: 'Voice note sent', severity: 'success' });
  }, [dictation, isStreaming, onSend, voiceRecorder]);

  const cancelVoiceNote = useCallback(() => {
    voiceRecorder.cancelRecording();
    setToast({ message: 'Voice note discarded', severity: 'info' });
  }, [voiceRecorder]);

  const handleVoiceTypingToggle = useCallback(() => {
    if (!dictation.isSupported) {
      setToast({ message: 'Voice typing is not supported in this browser.', severity: 'error' });
      return;
    }

    if (voiceRecorder.isRecording) {
      return;
    }

    if (dictation.isListening) {
      dictation.stopListening();
      setInterimText('');
      return;
    }

    dictation.startListening();
    textareaRef.current?.focus();
  }, [dictation, voiceRecorder.isRecording]);

  const sendRecordedAttachment = useCallback(
    async (attachment: AttachedFile | null, successMessage: string, close: () => void) => {
      if (isStreaming) {
        setToast({ message: 'Pause the current response before sending a new recording.', severity: 'info' });
        return;
      }

      if (!attachment) {
        setToast({ message: 'Could not prepare the recording to send.', severity: 'error' });
        return;
      }

      setIsSendingMedia(true);
      await Promise.resolve(onSend('', [attachment]));
      setIsSendingMedia(false);
      close();
      setToast({ message: successMessage, severity: 'success' });
    },
    [isStreaming, onSend]
  );

  const handleVideoButton = useCallback(async () => {
    if (!videoRecorder.isSupported) {
      setToast({ message: 'Webcam recording is not supported in this browser.', severity: 'error' });
      return;
    }

    if (!videoRecorder.isCameraOpen) {
      const opened = await videoRecorder.openCamera();
      if (!opened) {
        return;
      }
    }
  }, [videoRecorder]);

  const handleScreenButton = useCallback(async () => {
    if (!screenRecorder.isSupported) {
      setToast({ message: 'Screen recording is not supported in this browser.', severity: 'error' });
      return;
    }

    if (!screenRecorder.isPickerOpen) {
      await screenRecorder.startRecording();
    }
  }, [screenRecorder]);

  const handleChipClick = (label: string) => {
    const prompt = `I'd like to: ${label}`;
    void Promise.resolve(onSend(prompt));
  };

  return (
    <Box
      sx={{
        borderTop: '1px solid var(--border)',
        bgcolor: 'var(--card)',
        px: { xs: 1.5, md: 2.5 },
        pt: 1.5,
        pb: 1.5,
      }}
    >
      <input
        ref={documentInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.csv,.json,.md,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
        onChange={(event) => {
          void handleAddFiles(event.target.files, 'document');
          event.target.value = '';
        }}
        style={{ display: 'none' }}
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(event) => {
          void handleAddFiles(event.target.files, 'image');
          event.target.value = '';
        }}
        style={{ display: 'none' }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          bgcolor: '#FCFAF7',
          border: '1px solid',
          borderColor: voiceRecorder.isRecording
            ? 'rgba(220,38,38,0.45)'
            : dictation.isListening
              ? 'rgba(8,145,178,0.45)'
              : 'rgba(28,26,22,0.09)',
          borderRadius: '24px',
          px: { xs: 1, md: 1.5 },
          py: 1,
          boxShadow: voiceRecorder.isRecording
            ? '0 0 0 4px rgba(220,38,38,0.08), 0 16px 40px rgba(220,38,38,0.08)'
            : dictation.isListening
              ? '0 0 0 4px rgba(8,145,178,0.08), 0 16px 40px rgba(8,145,178,0.08)'
              : '0 12px 28px rgba(28,26,22,0.06)',
          transition: 'box-shadow 180ms ease, border-color 180ms ease',
        }}
      >
        {(voiceRecorder.isRecording || dictation.isListening) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              px: 1,
              py: 0.5,
              borderRadius: '16px',
              bgcolor: voiceRecorder.isRecording ? '#FEF2F2' : '#ECFEFF',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: voiceRecorder.isRecording ? '#DC2626' : '#0891B2',
                  animation: 'pulse 1.2s ease-in-out infinite',
                }}
              />
              <Typography sx={{ fontSize: '0.77rem', fontWeight: 700, color: 'var(--text)' }}>
                {voiceRecorder.isRecording
                  ? `Recording voice note ${formatDuration(voiceRecorder.elapsedSeconds)}`
                  : 'Listening for voice typing'}
              </Typography>
            </Box>

            {voiceRecorder.isRecording ? (
              <Button size="small" onClick={cancelVoiceNote} sx={{ textTransform: 'none', color: '#B91C1C' }}>
                Cancel
              </Button>
            ) : (
              <Button
                size="small"
                onClick={() => {
                  dictation.stopListening();
                  setInterimText('');
                }}
                sx={{ textTransform: 'none', color: '#0E7490' }}
              >
                Stop
              </Button>
            )}
          </Box>
        )}

        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={
            dictation.isListening
              ? 'Speak to type...'
              : voiceRecorder.isRecording
                ? 'Voice note is recording...'
                : t('chat.input.placeholder')
          }
          value={displayValue}
          onChange={(event) => {
            setInterimText('');
            setValue(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            color: 'var(--text)',
            fontSize: '0.96rem',
            lineHeight: 1.65,
            padding: '8px 10px 0',
            minHeight: '64px',
            maxHeight: '180px',
            fontFamily: 'inherit',
          }}
        />

        {attachments.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: 1,
              px: 1,
            }}
          >
            {attachments.map((attachment) => (
              <AttachmentPreview key={attachment.id} attachment={attachment} onRemove={removeAttachment} />
            ))}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1,
            px: 0.5,
            pt: 0.5,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <Tooltip title="Voice note">
              <IconButton
                onClick={() => {
                  void handleVoiceNoteToggle();
                }}
                disabled={isSendingMedia}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  border: '1px solid rgba(220,38,38,0.18)',
                  bgcolor: voiceRecorder.isRecording ? '#DC2626' : '#FEF2F2',
                  color: voiceRecorder.isRecording ? '#fff' : '#DC2626',
                  '&:hover': {
                    bgcolor: voiceRecorder.isRecording ? '#B91C1C' : '#FEE2E2',
                  },
                }}
              >
                {voiceRecorder.isRecording ? <StopCircle sx={{ fontSize: 18 }} /> : <Mic sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Attach file">
              <IconButton
                onClick={() => documentInputRef.current?.click()}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  border: '1px solid rgba(217,119,6,0.18)',
                  bgcolor: '#FFF7ED',
                  color: '#D97706',
                  '&:hover': { bgcolor: '#FFEDD5' },
                }}
              >
                <AttachFile sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Upload image">
              <IconButton
                onClick={() => imageInputRef.current?.click()}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  border: '1px solid rgba(37,99,235,0.18)',
                  bgcolor: '#EFF6FF',
                  color: '#2563EB',
                  '&:hover': { bgcolor: '#DBEAFE' },
                }}
              >
                <ImageIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Voice typing">
              <IconButton
                onClick={handleVoiceTypingToggle}
                disabled={voiceRecorder.isRecording}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  border: '1px solid rgba(8,145,178,0.18)',
                  bgcolor: dictation.isListening ? '#0891B2' : '#ECFEFF',
                  color: dictation.isListening ? '#fff' : '#0891B2',
                  '&:hover': {
                    bgcolor: dictation.isListening ? '#0E7490' : '#CFFAFE',
                  },
                }}
              >
                <KeyboardVoice sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Record video">
              <IconButton
                onClick={() => {
                  void handleVideoButton();
                }}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  border: '1px solid rgba(220,38,38,0.18)',
                  bgcolor: videoRecorder.isCameraOpen ? '#FEE2E2' : '#FFF5F5',
                  color: '#DC2626',
                  '&:hover': { bgcolor: '#FEE2E2' },
                }}
              >
                <Videocam sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Record screen">
              <IconButton
                onClick={() => {
                  void handleScreenButton();
                }}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  border: '1px solid rgba(5,150,105,0.18)',
                  bgcolor: screenRecorder.isPickerOpen ? '#D1FAE5' : '#ECFDF5',
                  color: '#059669',
                  '&:hover': { bgcolor: '#D1FAE5' },
                }}
              >
                <ScreenShare sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <Chip
              label={modelInfo?.name ?? selectedModel}
              size="small"
              sx={{
                height: 30,
                borderRadius: '999px',
                bgcolor: 'rgba(28,26,22,0.04)',
                border: '1px solid rgba(28,26,22,0.08)',
                color: 'var(--text2)',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            />

            <Tooltip title={isStreaming ? 'Pause response' : 'Send'}>
              <span>
                <IconButton
                  onClick={isStreaming ? onPause : () => void handleSend()}
                  disabled={!isStreaming && !canSend}
                  sx={{
                    minWidth: 108,
                    height: 42,
                    borderRadius: '999px',
                    px: 1.8,
                    bgcolor: isStreaming ? '#7F1D1D' : canSend ? 'var(--accent)' : 'rgba(200,98,42,0.35)',
                    color: '#fff',
                    gap: 0.75,
                    '&:hover': {
                      bgcolor: isStreaming ? '#6B1515' : canSend ? 'var(--accent2)' : 'rgba(200,98,42,0.35)',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(200,98,42,0.35)',
                      color: '#fff',
                    },
                  }}
                >
                  {isStreaming ? <Pause sx={{ fontSize: 18 }} /> : <Send sx={{ fontSize: 16 }} />}
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'inherit' }}>
                    {isStreaming ? 'Pause' : 'Let’s go'}
                  </Typography>
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
          pb: 0.25,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {ACTION_CHIP_KEYS.map(({ labelKey, color, bg, border }) => (
          <Chip
            key={labelKey}
            label={t(labelKey)}
            size="small"
            onClick={() => handleChipClick(t(labelKey))}
            sx={{
              height: 30,
              borderRadius: '999px',
              bgcolor: bg,
              border: `1px solid ${border}`,
              color,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
              '& .MuiChip-label': { px: 1 },
              '&:hover': {
                bgcolor: color,
                color: '#fff',
                borderColor: color,
              },
            }}
          />
        ))}
      </Box>

      <Snackbar
        open={Boolean(visibleToast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={visibleToast?.severity ?? 'info'} onClose={() => setToast(null)} sx={{ width: '100%' }}>
          {visibleToast?.message}
        </Alert>
      </Snackbar>

      <CaptureDialog
        open={videoRecorder.isCameraOpen}
        title={
          videoRecorder.recordedVideo
            ? 'Preview video message'
            : videoRecorder.isRecording
              ? 'Recording video message'
              : 'Camera ready'
        }
        subtitle={
          videoRecorder.isRecording
            ? `Recording ${formatDuration(videoRecorder.elapsedSeconds)}`
            : videoRecorder.recordedVideo
              ? 'Review the clip before sending it.'
              : 'Record a short video note.'
        }
        previewStream={videoRecorder.previewStream}
        recordedFile={videoRecorder.recordedVideo}
        onClose={videoRecorder.closeRecorder}
        onRetake={() => {
          void videoRecorder.retakeRecording();
        }}
        onPrimary={() => {
          if (videoRecorder.isRecording) {
            void videoRecorder.stopRecording();
            return;
          }

          if (videoRecorder.recordedVideo) {
            void sendRecordedAttachment(videoRecorder.recordedVideo, 'Video message sent', videoRecorder.closeRecorder);
            return;
          }

          void videoRecorder.startRecording();
        }}
        primaryLabel={
          videoRecorder.isRecording ? 'Stop' : videoRecorder.recordedVideo ? 'Send video' : 'Record'
        }
        primaryColor="error"
        onSwitchCamera={() => {
          void videoRecorder.switchCamera();
        }}
        switchDisabled={videoRecorder.isRecording || isSendingMedia}
      />

      <CaptureDialog
        open={screenRecorder.isPickerOpen}
        title={
          screenRecorder.recordedVideo
            ? 'Preview screen recording'
            : screenRecorder.isRecording
              ? 'Recording your screen'
              : 'Screen ready'
        }
        subtitle={
          screenRecorder.isRecording
            ? `Recording ${formatDuration(screenRecorder.elapsedSeconds)}`
            : screenRecorder.recordedVideo
              ? 'Review the capture before sending it.'
              : 'Choose a tab, app, or display to record.'
        }
        previewStream={screenRecorder.previewStream}
        recordedFile={screenRecorder.recordedVideo}
        onClose={screenRecorder.closeRecorder}
        onRetake={() => {
          void screenRecorder.retakeRecording();
        }}
        onPrimary={() => {
          if (screenRecorder.isRecording) {
            void screenRecorder.stopRecording();
            return;
          }

          if (screenRecorder.recordedVideo) {
            void sendRecordedAttachment(
              screenRecorder.recordedVideo,
              'Screen recording sent',
              screenRecorder.closeRecorder
            );
            return;
          }

          void screenRecorder.startRecording();
        }}
        primaryLabel={
          screenRecorder.isRecording ? 'Stop' : screenRecorder.recordedVideo ? 'Send recording' : 'Start'
        }
        primaryColor="success"
        previewMode="contain"
      />
    </Box>
  );
}
