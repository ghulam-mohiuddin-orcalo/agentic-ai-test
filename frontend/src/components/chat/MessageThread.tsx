'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import {
  SmartToy,
  Person,
  InsertDriveFile,
  Videocam,
  Audiotrack,
  ContentCopy,
  Check,
  Refresh,
  ThumbUpOutlined,
  ThumbDownOutlined,
} from '@mui/icons-material';
import type { AttachedFile } from '@/store/slices/chatSlice';
import MarkdownRenderer from './MarkdownRenderer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelId?: string;
  attachment?: AttachedFile;
}

interface MessageThreadProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  selectedModel: string;
  onRegenerate?: (messageId: string) => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function FileChip({ file }: { file: AttachedFile }) {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');

  if (isAudio) {
    return (
      <Box
        sx={{
          mt: 1,
          p: 1,
          borderRadius: '12px',
          bgcolor: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          minWidth: 260,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
          <Audiotrack sx={{ fontSize: 16, color: 'rgba(255,255,255,0.85)' }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
            {file.name}
          </Typography>
        </Box>
        <Box
          component="audio"
          controls
          src={file.dataUrl}
          sx={{
            width: '100%',
            height: 36,
            filter: 'invert(1) saturate(0) brightness(1.2)',
          }}
        />
      </Box>
    );
  }

  const renderIcon = () => {
    if (isImage) {
      return (
        <Box
          component="img"
          src={file.dataUrl}
          alt={file.name}
          sx={{ width: 24, height: 24, borderRadius: '5px', objectFit: 'cover' }}
        />
      );
    }
    if (isVideo) {
      return <Videocam sx={{ fontSize: 16, color: 'rgba(255,255,255,0.85)' }} />;
    }
    return <InsertDriveFile sx={{ fontSize: 16, color: 'rgba(255,255,255,0.85)' }} />;
  };

  if (isVideo) {
    return (
      <Box
        sx={{
          mt: 1,
          p: 1,
          borderRadius: '12px',
          bgcolor: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          minWidth: 260,
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', mb: 0.75 }}>
          {file.name}
        </Typography>
        <Box
          component="video"
          controls
          src={file.dataUrl}
          sx={{
            width: '100%',
            maxWidth: 320,
            borderRadius: '10px',
            bgcolor: '#000',
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        bgcolor: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: '10px',
        px: 1.25,
        py: 0.5,
        mt: 1,
      }}
    >
      {renderIcon()}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 160,
          }}
        >
          {file.name}
        </Typography>
        <Typography sx={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.65)' }}>
          {formatFileSize(file.size)}
        </Typography>
      </Box>
    </Box>
  );
}

function UserMessage({ content, attachment }: { content: string; attachment?: AttachedFile }) {
  const hasText = content.trim().length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 2,
        animation: 'fadeUp 0.3s ease',
      }}
    >
      <Box sx={{ maxWidth: '70%', display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
        <Box
          sx={{
            bgcolor: 'var(--accent)',
            color: '#fff',
            borderRadius: '16px 16px 4px 16px',
            px: 2,
            py: 1.25,
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            boxShadow: '0 2px 8px rgba(200,98,42,0.25)',
          }}
        >
          {hasText ? content : null}
          {attachment && <FileChip file={attachment} />}
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

function MessageActions({
  content,
  messageId,
  onRegenerate,
}: {
  content: string;
  messageId: string;
  onRegenerate?: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<'up' | 'down' | null>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.25,
        mt: 1,
        opacity: 0.5,
        transition: 'opacity 0.2s',
        '.msg-container:hover &': { opacity: 1 },
      }}
    >
      <Tooltip title={copied ? 'Copied!' : 'Copy'} arrow>
        <IconButton
          onClick={handleCopy}
          size="small"
          sx={{
            p: 0.5,
            color: copied ? '#4CAF50' : 'var(--text3)',
            '&:hover': { color: copied ? '#4CAF50' : 'var(--text)', bgcolor: 'var(--bg2)' },
          }}
        >
          {copied ? <Check sx={{ fontSize: 15 }} /> : <ContentCopy sx={{ fontSize: 15 }} />}
        </IconButton>
      </Tooltip>

      {onRegenerate && (
        <Tooltip title="Regenerate" arrow>
          <IconButton
            onClick={() => onRegenerate(messageId)}
            size="small"
            sx={{
              p: 0.5,
              color: 'var(--text3)',
              '&:hover': { color: 'var(--text)', bgcolor: 'var(--bg2)' },
            }}
          >
            <Refresh sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Good response" arrow>
        <IconButton
          onClick={() => setLiked(liked === 'up' ? null : 'up')}
          size="small"
          sx={{
            p: 0.5,
            color: liked === 'up' ? 'var(--teal)' : 'var(--text3)',
            '&:hover': { color: 'var(--teal)', bgcolor: 'var(--teal-lt)' },
          }}
        >
          <ThumbUpOutlined sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Bad response" arrow>
        <IconButton
          onClick={() => setLiked(liked === 'down' ? null : 'down')}
          size="small"
          sx={{
            p: 0.5,
            color: liked === 'down' ? 'var(--rose)' : 'var(--text3)',
            '&:hover': { color: 'var(--rose)', bgcolor: 'var(--rose-lt)' },
          }}
        >
          <ThumbDownOutlined sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function AssistantMessage({
  content,
  streaming,
  modelId,
  messageId,
  onRegenerate,
}: {
  content: string;
  streaming?: boolean;
  modelId?: string;
  messageId?: string;
  onRegenerate?: (id: string) => void;
}) {
  return (
    <Box
      className="msg-container"
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 2,
        animation: 'fadeUp 0.3s ease',
      }}
    >
      <Box sx={{ maxWidth: '80%', display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
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
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              bgcolor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '4px 16px 16px 16px',
              px: 2.5,
              py: 1.5,
              color: 'var(--text)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <MarkdownRenderer content={content} />
            {streaming && (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 7,
                  height: 16,
                  bgcolor: 'var(--accent)',
                  borderRadius: 1,
                  ml: 0.5,
                  verticalAlign: 'middle',
                  animation: 'pulse 0.8s ease-in-out infinite',
                }}
              />
            )}
          </Box>

          {/* Action buttons - only show when not streaming */}
          {!streaming && messageId && (
            <MessageActions
              content={content}
              messageId={messageId}
              onRegenerate={onRegenerate}
            />
          )}

          {/* Model label */}
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
  onRegenerate,
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
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserMessage key={msg.id} content={msg.content} attachment={msg.attachment} />
        ) : (
          <AssistantMessage
            key={msg.id}
            content={msg.content}
            modelId={msg.modelId}
            messageId={msg.id}
            onRegenerate={onRegenerate}
          />
        )
      )}

      {isStreaming && streamingContent && (
        <AssistantMessage
          content={streamingContent}
          streaming
          modelId={selectedModel}
        />
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
