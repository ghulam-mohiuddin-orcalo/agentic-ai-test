'use client';

import { useEffect, useRef } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import {
  SmartToy,
  Person,
  InsertDriveFile,
  Videocam,
  Audiotrack,
  ScreenShare,
} from '@mui/icons-material';
import type { AttachedFile } from '@/store/slices/chatSlice';
import {
  formatDuration,
  formatFileSize,
  isAudioAttachment,
  isPreviewableVideo,
} from '@/lib/chatAttachments';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelId?: string;
  attachments?: AttachedFile[];
}

interface MessageThreadProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  selectedModel: string;
}

function AttachmentCard({ file }: { file: AttachedFile }) {
  if (isAudioAttachment(file)) {
    return (
      <Box
        sx={{
          mt: 1,
          p: 1.25,
          borderRadius: '18px',
          bgcolor: 'rgba(255,255,255,0.16)',
          border: '1px solid rgba(255,255,255,0.2)',
          minWidth: 280,
          backdropFilter: 'blur(12px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.16)',
            }}
          >
            <Audiotrack sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>
              Voice note
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)' }}>
              {file.durationSeconds ? formatDuration(file.durationSeconds) : formatFileSize(file.size)}
            </Typography>
          </Box>
        </Box>
        <Box
          component="audio"
          controls
          preload="metadata"
          src={file.dataUrl}
          sx={{
            width: '100%',
            height: 36,
            filter: 'invert(1) saturate(0) brightness(1.1)',
          }}
        />
      </Box>
    );
  }

  if (file.kind === 'image') {
    return (
      <Box
        sx={{
          mt: 1,
          overflow: 'hidden',
          borderRadius: '18px',
          border: '1px solid rgba(255,255,255,0.2)',
          bgcolor: 'rgba(255,255,255,0.12)',
          width: { xs: 220, sm: 280 },
        }}
      >
        <Box
          component="img"
          src={file.dataUrl}
          alt={file.name}
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            maxHeight: 300,
            objectFit: 'cover',
          }}
        />
        <Box sx={{ px: 1.25, py: 1 }}>
          <Typography sx={{ fontSize: '0.74rem', fontWeight: 700, color: '#fff' }}>
            {file.name}
          </Typography>
          <Typography sx={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.68)' }}>
            {formatFileSize(file.size)}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isPreviewableVideo(file)) {
    return (
      <Box
        sx={{
          mt: 1,
          p: 1,
          borderRadius: '18px',
          bgcolor: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          width: { xs: 230, sm: 320 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
          {file.kind === 'screen' ? (
            <ScreenShare sx={{ fontSize: 16, color: '#fff' }} />
          ) : (
            <Videocam sx={{ fontSize: 16, color: '#fff' }} />
          )}
          <Typography sx={{ fontSize: '0.74rem', fontWeight: 700, color: '#fff' }}>
            {file.kind === 'screen' ? 'Screen recording' : 'Video message'}
          </Typography>
        </Box>
        <Box
          component="video"
          controls
          preload="metadata"
          src={file.dataUrl}
          sx={{
            width: '100%',
            borderRadius: '14px',
            bgcolor: '#000',
            aspectRatio: '16 / 10',
          }}
        />
        <Typography sx={{ mt: 0.75, fontSize: '0.66rem', color: 'rgba(255,255,255,0.68)' }}>
          {file.durationSeconds ? formatDuration(file.durationSeconds) : formatFileSize(file.size)}
        </Typography>
      </Box>
    );
  }

  const icon = <InsertDriveFile sx={{ fontSize: 16, color: 'rgba(255,255,255,0.85)' }} />;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'rgba(255,255,255,0.14)',
        border: '1px solid rgba(255,255,255,0.24)',
        borderRadius: '14px',
        px: 1.25,
        py: 0.9,
        mt: 1,
        minWidth: 220,
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '10px',
          bgcolor: 'rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 180,
          }}
        >
          {file.name}
        </Typography>
        <Typography sx={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.68)' }}>
          {formatFileSize(file.size)}
        </Typography>
      </Box>
    </Box>
  );
}

function UserMessage({ content, attachments }: { content: string; attachments?: AttachedFile[] }) {
  const hasText = content.trim().length > 0;
  const hasAttachments = Boolean(attachments?.length);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 2,
        animation: 'fadeUp 0.3s ease',
      }}
    >
      <Box sx={{ maxWidth: '74%', display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
        <Box
          sx={{
            bgcolor: 'var(--accent)',
            color: '#fff',
            borderRadius: '22px 22px 8px 22px',
            px: hasAttachments ? 1.5 : 2,
            py: 1.25,
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            boxShadow: '0 10px 28px rgba(200,98,42,0.2)',
            minWidth: hasText ? 0 : 120,
          }}
        >
          {hasText ? <Typography sx={{ fontSize: '0.95rem', color: '#fff' }}>{content}</Typography> : null}
          {attachments?.map((attachment) => (
            <AttachmentCard key={attachment.id} file={attachment} />
          ))}
        </Box>
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: 'var(--bg2)',
            flexShrink: 0,
          }}
        >
          <Person sx={{ fontSize: 16, color: 'var(--text2)' }} />
        </Avatar>
      </Box>
    </Box>
  );
}

function AssistantMessage({
  content,
  streaming,
  modelId,
}: {
  content: string;
  streaming?: boolean;
  modelId?: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 2,
        animation: 'fadeUp 0.3s ease',
      }}
    >
      <Box sx={{ maxWidth: '75%', display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: 'var(--accent-lt)',
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          <SmartToy sx={{ fontSize: 16, color: 'var(--accent)' }} />
        </Avatar>
        <Box>
          <Box
            sx={{
              bgcolor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px 22px 22px 22px',
              px: 2,
              py: 1.25,
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              color: 'var(--text)',
              boxShadow: 'var(--shadow)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {content}
            {streaming && (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 8,
                  height: 14,
                  bgcolor: 'var(--accent)',
                  borderRadius: 1,
                  ml: 0.5,
                  verticalAlign: 'middle',
                  animation: 'pulse 0.8s ease-in-out infinite',
                }}
              />
            )}
          </Box>
          {modelId && !streaming && (
            <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)', mt: 0.5, pl: 0.5 }}>
              {modelId}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function MessageThread({
  messages,
  isStreaming,
  streamingContent,
  selectedModel,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        px: { xs: 2, md: 4 },
        py: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.map((message) =>
        message.role === 'user' ? (
          <UserMessage key={message.id} content={message.content} attachments={message.attachments} />
        ) : (
          <AssistantMessage key={message.id} content={message.content} modelId={message.modelId} />
        )
      )}

      {isStreaming && streamingContent && (
        <AssistantMessage content={streamingContent} streaming modelId={selectedModel} />
      )}

      {isStreaming && !streamingContent && (
        <Box sx={{ display: 'flex', gap: 1, ml: 5.5, mb: 2 }}>
          {[0, 0.2, 0.4].map((delay) => (
            <Box
              key={delay}
              sx={{
                width: 8,
                height: 8,
                bgcolor: 'var(--accent)',
                borderRadius: '50%',
                animation: `bounce 0.8s ease-in-out ${delay}s infinite`,
              }}
            />
          ))}
        </Box>
      )}

      <div ref={bottomRef} />
    </Box>
  );
}
