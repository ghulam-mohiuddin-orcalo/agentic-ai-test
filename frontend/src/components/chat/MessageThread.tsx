'use client';

import { useEffect, useRef } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { SmartToy, Person } from '@mui/icons-material';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelId?: string;
}

interface MessageThreadProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  selectedModel: string;
}

function UserMessage({ content }: { content: string }) {
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
          {content}
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
              borderRadius: '4px 16px 16px 16px',
              px: 2,
              py: 1.25,
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              color: 'var(--text)',
              boxShadow: 'var(--shadow)',
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
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserMessage key={msg.id} content={msg.content} />
        ) : (
          <AssistantMessage key={msg.id} content={msg.content} modelId={msg.modelId} />
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
