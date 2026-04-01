'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Button,
  InputBase,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import dynamic from 'next/dynamic';

const OnboardingFlow = dynamic(() => import('./OnboardingFlow'), { ssr: false });
const ActionGrid = dynamic(() => import('./ActionGrid'), { ssr: false });

export default function HeroSearchCard() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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
      console.log('Submit:', { query, attachments });
    }
  };

  return (
    <Box>
      {/* Pill search bar */}
      <Box
        onClick={() => inputRef.current?.focus()}
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderRadius: '3rem',
          border: '1.5px solid',
          borderColor: isFocused ? 'primary.main' : 'rgba(0,0,0,0.12)',
          boxShadow: isFocused
            ? '0 0 0 4px rgba(200,98,42,0.10)'
            : '0 2px 12px rgba(0,0,0,0.07)',
          transition: 'all 0.25s ease',
          px: 1.5,
          py: 0.75,
          gap: 0.5,
          cursor: 'text',
          maxWidth: 620,
          mx: 'auto',
        }}
      >
        {/* Text input */}
        <InputBase
          inputRef={inputRef}
          fullWidth
          placeholder="Click here and type anything — or just say hi 👋"
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

        {/* Icon buttons */}
        {[
          { icon: <MicIcon sx={{ fontSize: 18 }} />, title: 'Voice' },
          { icon: <VideocamIcon sx={{ fontSize: 18 }} />, title: 'Video' },
          { icon: <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />, title: 'Chat' },
          { icon: <AttachFileIcon sx={{ fontSize: 18 }} />, title: 'Attach', upload: true },
          { icon: <EmojiEmotionsOutlinedIcon sx={{ fontSize: 18 }} />, title: 'Emoji' },
        ].map((btn, i) =>
          btn.upload ? (
            <IconButton
              key={i}
              component="label"
              size="small"
              title={btn.title}
              sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}
            >
              {btn.icon}
              <input type="file" hidden multiple onChange={handleFileUpload} />
            </IconButton>
          ) : (
            <IconButton
              key={i}
              size="small"
              title={btn.title}
              sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}
            >
              {btn.icon}
            </IconButton>
          )
        )}

        {/* Let's go button */}
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
          }}
        >
          Let's go
        </Button>
      </Box>

      {/* Attachment chips */}
      {attachments.length > 0 && (
        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {attachments.map((file, i) => (
            <Chip
              key={i}
              label={file.name}
              onDelete={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
              size="small"
              sx={{ bgcolor: 'background.paper' }}
            />
          ))}
        </Box>
      )}

      {/* Onboarding flow */}
      <Collapse in={showOnboarding}>
        <Box
          sx={{
            mt: 2,
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            p: 3,
            maxWidth: 620,
            mx: 'auto',
          }}
        >
          <OnboardingFlow />
        </Box>
      </Collapse>

      {/* Action grid */}
      {!showOnboarding && (
        <Box sx={{ mt: 3 }}>
          <ActionGrid onActionClick={(prompt) => { setQuery(prompt); inputRef.current?.focus(); }} />
        </Box>
      )}
    </Box>
  );
}
