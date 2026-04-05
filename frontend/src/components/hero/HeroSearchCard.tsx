'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Button,
  InputBase,
  Popover,
  Paper,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dynamic from 'next/dynamic';

const OnboardingFlow = dynamic(() => import('./OnboardingFlow'), { ssr: false });
const ActionGrid = dynamic(() => import('./ActionGrid'), { ssr: false });

const EMOJI_LIST = [
  '😀', '😂', '🥰', '😎', '🤔', '👋', '👍', '👎',
  '❤️', '🔥', '✨', '🎉', '💡', '🚀', '⭐', '🎯',
  '✅', '❌', '⚡', '🌟',
];

const SUGGESTED_QUESTIONS = [
  'What\'s the best model for coding?',
  'Compare GPT-4o vs Claude 3.5',
  'Cheapest model for image generation',
  'Best open-source LLM right now',
];

export default function HeroSearchCard() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!emojiAnchor) return;
    const handler = (e: MouseEvent) => {
      if (emojiAnchor && !emojiAnchor.contains(e.target as Node)) {
        setEmojiAnchor(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [emojiAnchor]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) setShowOnboarding(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
      setShowOnboarding(true);
    }
  };

  const handleSubmit = () => {
    if (query.trim() || attachments.length > 0) {
      window.location.href = `/chat?q=${encodeURIComponent(query)}`;
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setQuery(transcript);
      if (!showOnboarding) setShowOnboarding(true);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const handleVideoClick = () => {
    window.location.href = '/chat?mode=video';
  };

  const handleChatClick = () => {
    window.location.href = '/chat';
  };

  const handleEmojiToggle = (e: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchor(emojiAnchor ? null : e.currentTarget);
  };

  const handleEmojiSelect = (emoji: string) => {
    setQuery((prev) => prev + emoji);
    if (!showOnboarding) setShowOnboarding(true);
    inputRef.current?.focus();
  };

  return (
    <Box>
      {/* Search card */}
      <Box
        onClick={() => inputRef.current?.focus()}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '28px',
          border: '1.5px solid',
          borderColor: isFocused
            ? 'primary.main'
            : (t) => t.palette.custom.border2,
          boxShadow: isFocused
            ? '0 0 0 4px rgba(200,98,42,0.10), 0 2px 12px rgba(0,0,0,0.08)'
            : '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          p: { xs: 1.25, sm: 1.5 },
          maxWidth: 900,
          mx: 'auto',
          cursor: 'text',
        }}
      >
        {/* Input row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.5 }}>
          <AutoAwesomeIcon
            sx={{
              fontSize: 20,
              color: isFocused ? 'primary.main' : 'text.disabled',
              transition: 'color 0.2s',
              flexShrink: 0,
            }}
          />

          <InputBase
            inputRef={inputRef}
            fullWidth
            placeholder="Click here and type anything — or just say hi"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { if (!query) setIsFocused(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            sx={{
              flex: 1,
              px: 1,
              fontSize: '0.9375rem',
              color: 'text.primary',
              '& input::placeholder': { color: 'text.disabled', opacity: 1 },
            }}
          />

          {/* Icon buttons row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
            <IconButton
              size="small"
              title="Voice input"
              onClick={(e) => { e.stopPropagation(); handleVoiceInput(); }}
              sx={{
                color: isListening ? '#D32F2F' : 'text.disabled',
                '&:hover': { color: isListening ? '#D32F2F' : 'text.secondary' },
                transition: 'color 0.15s',
                ...(isListening && {
                  animation: 'micPulse 1.2s ease-in-out infinite',
                }),
              }}
            >
              <MicIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              size="small"
              title="Video chat"
              onClick={(e) => { e.stopPropagation(); handleVideoClick(); }}
              sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' }, transition: 'color 0.15s' }}
            >
              <VideocamIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              size="small"
              title="Open chat"
              onClick={(e) => { e.stopPropagation(); handleChatClick(); }}
              sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' }, transition: 'color 0.15s' }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              component="label"
              size="small"
              title="Attach file"
              sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' }, transition: 'color 0.15s' }}
            >
              <AttachFileIcon sx={{ fontSize: 18 }} />
              <input type="file" hidden multiple onChange={handleFileUpload} />
            </IconButton>

            <IconButton
              size="small"
              title="Insert emoji"
              onClick={(e) => { e.stopPropagation(); handleEmojiToggle(e); }}
              sx={{
                color: emojiAnchor ? 'primary.main' : 'text.disabled',
                '&:hover': { color: 'primary.main' },
                transition: 'color 0.15s',
              }}
            >
              <EmojiEmotionsOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              sx={{
                borderRadius: '2rem',
                px: 2.25,
                py: 0.875,
                fontSize: '0.875rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                ml: 0.5,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none', transform: 'none' },
                transition: 'background-color 0.15s',
              }}
            >
              Let&apos;s go
            </Button>
          </Box>
        </Box>

        {/* Attachment chips */}
        {attachments.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.75, px: 0.5 }}>
            {attachments.map((file, i) => (
              <Chip
                key={i}
                label={file.name}
                onDelete={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                size="small"
                sx={{
                  bgcolor: (t) => t.palette.custom.bg2,
                  fontSize: '0.75rem',
                  '& .MuiChip-deleteIcon': { fontSize: 16 },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Emoji picker popover */}
      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        disableAutoFocus
        disableEnforceFocus
        sx={{ mt: -0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 1.25,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 0.25,
            maxWidth: 200,
          }}
        >
          {EMOJI_LIST.map((emoji, i) => (
            <Box
              key={i}
              onClick={() => handleEmojiSelect(emoji)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                fontSize: '1.25rem',
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                '&:hover': { bgcolor: (t) => t.palette.custom.bg2 },
              }}
            >
              {emoji}
            </Box>
          ))}
        </Paper>
      </Popover>

      {/* Suggested questions (when focused but no query) */}
      {isFocused && !query && !showOnboarding && (
        <Box
          sx={{
            mt: 1.5,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 900,
            mx: 'auto',
            animation: 'sqFadeIn 0.3s ease',
          }}
        >
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <Box
              key={i}
              onClick={() => { setQuery(q); setShowOnboarding(true); inputRef.current?.focus(); }}
              sx={{
                px: 1.5,
                py: 0.625,
                borderRadius: '2rem',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: (t) => t.palette.custom.border2,
                fontSize: '0.8rem',
                color: 'text.secondary',
                cursor: 'pointer',
                transition: 'all 0.18s',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'primary.light',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {q}
            </Box>
          ))}
        </Box>
      )}

      {/* Onboarding flow */}
      <Collapse in={showOnboarding}>
        <Box
          sx={{
            mt: 2,
            bgcolor: 'background.paper',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: 'divider',
            p: 3,
            maxWidth: 900,
            mx: 'auto',
            boxShadow: 1,
          }}
        >
          <OnboardingFlow />
        </Box>
      </Collapse>

      {/* Agent chip */}
      {!showOnboarding && !isFocused && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
          <Box
            component="a"
            href="/agents"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.25,
              py: 0.375,
              borderRadius: '2rem',
              bgcolor: 'primary.light',
              color: 'primary.main',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.18s',
              border: '1px solid',
              borderColor: (t) => t.palette.custom.accentBorder,
              '&:hover': {
                bgcolor: 'primary.main',
                color: '#fff',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Build your own Agent &rarr;
          </Box>
        </Box>
      )}

      {/* Action grid */}
      {!showOnboarding && !isFocused && (
        <Box sx={{ mt: '2.5rem' }}>
          <ActionGrid onActionClick={(prompt) => { setQuery(prompt); inputRef.current?.focus(); }} />
        </Box>
      )}
    </Box>
  );
}
