'use client';

import Link from 'next/link';
import { KeyboardEvent, ReactNode, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import {
  Add,
  ArrowBack,
  ArrowForward,
  ChatBubbleOutline,
  ChevronRight,
  DataObject,
  Edit,
  OpenInNew,
  RocketLaunch,
  Search,
  Settings,
  SmartToy,
} from '@mui/icons-material';
import { promptsByUseCase } from './agentStudioData';

export const pageShellSx = {
  minHeight: 'calc(100vh - 64px)',
  bgcolor: '#F4F1EB',
  pb: 6,
};

export const sectionCardSx = {
  borderRadius: '22px',
  border: '1px solid rgba(108, 74, 42, 0.10)',
  boxShadow: '0 18px 50px rgba(51, 38, 24, 0.06)',
  bgcolor: '#FFFDFC',
};

export function AgentsSidebar() {
  return (
    <Box sx={{ width: { xs: '100%', lg: 260 }, flexShrink: 0 }}>
      <Paper elevation={0} sx={{ ...sectionCardSx, p: 2.5, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              bgcolor: '#C86E3A',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SmartToy sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#241E17' }}>
              Agent Builder
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#74665A', lineHeight: 1.45 }}>
              Create powerful AI agents using any model. Pick a template or start from scratch.
            </Typography>
          </Box>
        </Box>

        <Button
          component={Link}
          href="/agents/create"
          fullWidth
          variant="contained"
          disableElevation
          startIcon={<Add />}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '999px',
            py: 1.2,
            bgcolor: '#B96836',
            '&:hover': { bgcolor: '#A45C30' },
          }}
        >
          + New Agent
        </Button>
      </Paper>

      <Paper elevation={0} sx={{ ...sectionCardSx, p: 2.5, mb: 2, bgcolor: '#FFF7F2' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#2A241D', mb: 1 }}>
          Not sure where to start?
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#786A5D', lineHeight: 1.5, mb: 2 }}>
          Chat with our AI guide — describe what you want your agent to do and get a personalised setup plan.
        </Typography>
        <Button
          variant="outlined"
          endIcon={<ArrowForward />}
          sx={{
            textTransform: 'none',
            borderRadius: '999px',
            borderColor: 'rgba(185,104,54,0.25)',
            color: '#2A241D',
            fontWeight: 700,
          }}
        >
          Ask the Hub →
        </Button>
      </Paper>
    </Box>
  );
}

export function ChecklistPanel({ items }: { items: string[] }) {
  return (
    <Paper elevation={0} sx={{ ...sectionCardSx, p: 2 }}>
      <Button
        fullWidth
        startIcon={<Add />}
        sx={{
          justifyContent: 'flex-start',
          textTransform: 'none',
          borderRadius: '14px',
          color: '#4F463D',
          bgcolor: '#F8F2EC',
          mb: 2,
        }}
      >
        New Task
      </Button>
      {items.map((item) => (
        <Box
          key={item}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 1,
            color: '#665C52',
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: 1,
              border: '1px solid rgba(79,70,61,0.22)',
              bgcolor: '#fff',
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: '0.82rem' }}>{item}</Typography>
        </Box>
      ))}
    </Paper>
  );
}

export function HeroComposer({
  title,
  subtitle,
  useCases,
  prompts,
}: {
  title: ReactNode;
  subtitle: string;
  useCases: string[];
  prompts: string[];
}) {
  const [query, setQuery] = useState('');
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prompts shown: filtered by active use case, or the default list
  const visiblePrompts =
    activeUseCase && promptsByUseCase[activeUseCase]
      ? promptsByUseCase[activeUseCase]
      : prompts;

  const handleSend = () => {
    if (!query.trim()) return;
    setSubmitted(true);
    // Reset after short delay so the user can send again
    setTimeout(() => {
      setQuery('');
      setSubmitted(false);
      inputRef.current?.focus();
    }, 1400);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const handlePromptClick = (prompt: string) => {
    setQuery(prompt);
    inputRef.current?.focus();
  };

  const handleUseCaseClick = (item: string) => {
    setActiveUseCase((prev) => (prev === item ? null : item));
  };

  return (
    <Box>
      {/* Hero heading */}
      <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '3rem' },
            letterSpacing: '-0.04em',
            color: '#221B15',
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ color: '#78695B', fontSize: '0.95rem' }}>{subtitle}</Typography>
      </Box>

      {/* Composer input card */}
      <Paper elevation={0} sx={{ ...sectionCardSx, p: 1.5, mb: 2 }}>
        <Box
          sx={{
            borderRadius: '16px',
            border: '1px solid',
            borderColor: submitted ? 'rgba(71,115,93,0.4)' : 'rgba(108,74,42,0.10)',
            bgcolor: '#FBF7F3',
            p: 2,
            transition: 'border-color 0.2s',
          }}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Agent query"
            placeholder="What should we work on next?"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '15px',
              color: '#2A241D',
              paddingBottom: '12px',
              fontFamily: 'inherit',
            }}
          />
          <Divider sx={{ borderColor: 'rgba(108,74,42,0.08)' }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              pt: 1.25,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, color: '#A45C30' }}>
              <ChatBubbleOutline sx={{ fontSize: 18, cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }} />
              <Search sx={{ fontSize: 18, cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }} />
              <DataObject sx={{ fontSize: 18, cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="Agent" size="small" sx={{ bgcolor: '#EFE7DF', color: '#675B4E' }} />
              <Button
                onClick={handleSend}
                disabled={!query.trim() || submitted}
                variant="contained"
                disableElevation
                sx={{
                  minWidth: 44,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: submitted ? '#47735D' : '#B96836',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: submitted ? '#47735D' : '#A45C30' },
                  '&:disabled': { bgcolor: '#D9CEC3', color: '#fff' },
                }}
              >
                {submitted ? '✓' : <ArrowForward sx={{ fontSize: 20 }} />}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Use-case tab chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
        <Chip
          label="Use cases"
          onClick={() => setActiveUseCase(null)}
          sx={{
            bgcolor: activeUseCase === null ? '#1F1B18' : '#FFFDFC',
            color: activeUseCase === null ? '#fff' : '#4F463D',
            border: activeUseCase === null ? 'none' : '1px solid rgba(108,74,42,0.12)',
            borderRadius: '999px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        />
        {useCases.map((item) => {
          const active = activeUseCase === item;
          return (
            <Chip
              key={item}
              label={item}
              onClick={() => handleUseCaseClick(item)}
              sx={{
                bgcolor: active ? '#FFF1E8' : '#FFFDFC',
                border: '1px solid',
                borderColor: active ? '#D4956A' : 'rgba(108,74,42,0.12)',
                color: active ? '#B96836' : '#4F463D',
                borderRadius: '999px',
                fontWeight: active ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { borderColor: '#D4956A', color: '#B96836' },
              }}
            />
          );
        })}
      </Box>

      {/* Prompt suggestion list */}
      <Paper elevation={0} sx={{ ...sectionCardSx, p: 1 }}>
        {visiblePrompts.map((prompt, index) => (
          <Box
            key={prompt}
            onClick={() => handlePromptClick(prompt)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.5,
              py: 1.25,
              borderBottom:
                index === visiblePrompts.length - 1
                  ? 'none'
                  : '1px solid rgba(108,74,42,0.08)',
              cursor: 'pointer',
              borderRadius:
                index === 0
                  ? '20px 20px 0 0'
                  : index === visiblePrompts.length - 1
                  ? '0 0 20px 20px'
                  : 0,
              transition: 'background-color 0.12s',
              '&:hover': { bgcolor: '#FAF5F0' },
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '10px',
                bgcolor: '#F9EFE7',
                color: '#B96836',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <RocketLaunch sx={{ fontSize: 16 }} />
            </Box>
            <Typography sx={{ flex: 1, color: '#4A4037', fontSize: '0.9rem' }}>
              {prompt}
            </Typography>
          </Box>
        ))}
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            display: 'flex',
            justifyContent: 'space-between',
            color: '#7A6D61',
            cursor: 'pointer',
            borderTop: '1px solid rgba(108,74,42,0.08)',
            borderRadius: '0 0 20px 20px',
            transition: 'background-color 0.12s',
            '&:hover': { bgcolor: '#FAF5F0' },
          }}
        >
          <Typography sx={{ fontSize: '0.84rem', fontWeight: 600 }}>
            View all suggestions
          </Typography>
          <ChevronRight sx={{ fontSize: 18 }} />
        </Box>
      </Paper>
    </Box>
  );
}

export function TemplatesRow({
  title,
  templates,
  buildHref = '/agents/create',
}: {
  title: string;
  templates: Array<{
    id: string;
    name: string;
    description: string;
    model: string;
    tags: string[];
    emoji?: string;
  }>;
  buildHref?: string;
}) {
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#968A7F', fontWeight: 800, letterSpacing: '0.08em' }}>
          {title.toUpperCase()}
        </Typography>
        <Chip label={templates.length} size="small" sx={{ bgcolor: '#EFE7DF', color: '#6A5F55' }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 1.5 }}>
        {templates.map((agent) => (
          <Paper
            key={agent.id}
            component={Link}
            href={`/agents/${agent.id}`}
            elevation={0}
            sx={{ ...sectionCardSx, p: 2, minHeight: 170, textDecoration: 'none', color: 'inherit' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  bgcolor: '#F8ECDD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {agent.emoji || '🤖'}
              </Box>
              <Typography sx={{ fontWeight: 800, color: '#241E17', lineHeight: 1.2, fontSize: '0.9rem' }}>{agent.name}</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.82rem', color: '#76695E', lineHeight: 1.5, mb: 1.5 }}>
              {agent.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1 }}>
              <Chip label={agent.model} size="small" sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', fontSize: '0.72rem' }} />
              {agent.tags.slice(0, 1).map((tag) => (
                <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#F7EAE1', color: '#B96836', fontSize: '0.72rem' }} />
              ))}
            </Box>
          </Paper>
        ))}
        <Paper
          component={Link}
          href={buildHref}
          elevation={0}
          sx={{
            ...sectionCardSx,
            minHeight: 170,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 1,
            textDecoration: 'none',
            color: '#B96836',
            borderStyle: 'dashed',
            bgcolor: '#FFF6F0',
          }}
        >
          <Add />
          <Typography sx={{ fontWeight: 700 }}>Build from Scratch</Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Paper elevation={0} sx={{ ...sectionCardSx, p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '0.82rem', color: '#7A6D61' }}>{label}</Typography>
      <Typography sx={{ fontWeight: 800, color: '#231D17', fontSize: '1.05rem' }}>{value}</Typography>
    </Paper>
  );
}

export function SideInfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Paper elevation={0} sx={{ ...sectionCardSx, p: 1.5, mb: 1.5 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#A2978B', letterSpacing: '0.08em', mb: 1 }}>
        {title.toUpperCase()}
      </Typography>
      {children}
    </Paper>
  );
}

export function InfoAction({
  label,
  icon,
  onClick,
  danger,
}: {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <Button
      fullWidth
      startIcon={icon || <Edit sx={{ fontSize: 16 }} />}
      variant="outlined"
      onClick={onClick}
      sx={{
        justifyContent: 'flex-start',
        textTransform: 'none',
        borderRadius: '12px',
        borderColor: danger ? 'rgba(200,50,50,0.2)' : 'rgba(108,74,42,0.10)',
        color: danger ? '#c0392b' : '#5E5349',
        fontWeight: 600,
        fontSize: '0.875rem',
      }}
    >
      {label}
    </Button>
  );
}

export function BackPill({ href, label }: { href: string; label: string }) {
  return (
    <Button
      component={Link}
      href={href}
      startIcon={<ArrowBack />}
      variant="outlined"
      sx={{
        textTransform: 'none',
        borderRadius: '999px',
        borderColor: 'rgba(108,74,42,0.14)',
        color: '#4F463D',
      }}
    >
      {label}
    </Button>
  );
}

export function TopAction({ label, icon, href }: { label: string; icon: ReactNode; href?: string }) {
  return (
    <Button
      component={href ? Link : 'button'}
      href={href}
      startIcon={icon}
      variant="outlined"
      sx={{
        textTransform: 'none',
        borderRadius: '999px',
        borderColor: 'rgba(108,74,42,0.14)',
        color: '#4A4037',
        bgcolor: '#FFFDFC',
        fontWeight: 700,
      }}
    >
      {label}
    </Button>
  );
}

export const sharedIcons = {
  search: <Search sx={{ fontSize: 18 }} />,
  settings: <Settings sx={{ fontSize: 18 }} />,
  deploy: <RocketLaunch sx={{ fontSize: 18 }} />,
};
