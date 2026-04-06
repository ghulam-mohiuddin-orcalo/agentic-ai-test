'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Tooltip } from '@mui/material';
import {
  Mic,
  AttachFile,
  Image as ImageIcon,
  Keyboard,
  Videocam,
  ScreenShare,
  Search,
  Computer,
} from '@mui/icons-material';

const ICON_BUTTONS = [
  { icon: <Mic sx={{ fontSize: 15 }} />, tip: 'Voice input', color: '#7C3AED', bg: '#F3EEFF', border: 'rgba(124,58,237,0.25)' },
  { icon: <AttachFile sx={{ fontSize: 15 }} />, tip: 'Attach file', color: '#D97706', bg: '#FFFBEB', border: 'rgba(217,119,6,0.25)' },
  { icon: <ImageIcon sx={{ fontSize: 15 }} />, tip: 'Upload image', color: '#2563EB', bg: '#EFF6FF', border: 'rgba(37,99,235,0.25)' },
  { icon: <Keyboard sx={{ fontSize: 15 }} />, tip: 'Voice typing', color: '#0891B2', bg: '#E0F7FA', border: 'rgba(8,145,178,0.25)' },
  { icon: <Videocam sx={{ fontSize: 15 }} />, tip: 'Video input', color: '#DC2626', bg: '#FEF2F2', border: 'rgba(220,38,38,0.22)' },
  { icon: <ScreenShare sx={{ fontSize: 15 }} />, tip: 'Share screen', color: '#059669', bg: '#ECFDF5', border: 'rgba(5,150,105,0.25)' },
];

export default function HeroSearchCard() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/chat');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 720,
        mx: 'auto',
        bgcolor: '#fff',
        border: '1.5px solid',
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        '&:focus-within': {
          borderColor: 'rgba(200,98,42,0.35)',
          boxShadow: '0 4px 24px rgba(200,98,42,0.1)',
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
          placeholder="Click here and type anything — or just say hi! 🙋"
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
            '&::placeholder': { color: 'rgba(0,0,0,0.4)', fontSize: '0.95rem' },
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
            title="AI Assistant"
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
            title="Extension"
          >
            <Box component="svg" viewBox="0 0 24 24" fill="white" sx={{ width: 13, height: 13 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Bar: Icon boxes + separator + Agent chip + spacer + Go */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', px: '10px', pt: '6px', pb: '8px' }}>
        {ICON_BUTTONS.map((btn) => (
          <Tooltip key={btn.tip} title={btn.tip} arrow placement="top">
            <Box
              component="button"
              sx={{
                width: 36, height: 36,
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: btn.border,
                bgcolor: btn.bg,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                p: 0, flexShrink: 0,
                color: btn.color,
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
          Agent
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
            bgcolor: '#C8622A',
            border: 'none',
            borderRadius: '2rem',
            cursor: 'pointer',
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: '0.82rem', fontWeight: 600,
            color: '#fff',
            transition: 'all 0.15s',
            flexShrink: 0, whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: '#b5561f',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(200,98,42,0.3)',
            },
          }}
        >
          <Search sx={{ fontSize: 14 }} />
          {"Let's go"}
        </Box>
      </Box>
    </Box>
  );
}
