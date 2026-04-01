'use client';

import { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import Link from 'next/link';
import {
  Add,
  ManageSearch,
  SupportAgent,
  Code,
  BarChart,
  EditNote,
  AutoFixHigh,
  OpenInNew,
} from '@mui/icons-material';
import NewAgentModal from '@/components/agents/NewAgentModal';

/* ─── Template data ─────────────────────────────────────── */

interface AgentTemplate {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  name: string;
  desc: string;
  models: string[];
  tags: string[];
}

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'Web search': { bg: '#EBF0FC', color: '#1E4DA8' },
  Reports: { bg: '#FDF5E0', color: '#8A5A00' },
  Ticketing: { bg: '#EBF0FC', color: '#1E4DA8' },
  Escalation: { bg: '#FDEDF1', color: '#9B2042' },
  GitHub: { bg: '#ECEAE4', color: '#5A5750' },
  Code: { bg: '#E2F5EF', color: '#0A5E49' },
  Spreadsheets: { bg: '#E2F5EF', color: '#0A5E49' },
  Charts: { bg: '#EBF0FC', color: '#1E4DA8' },
  Marketing: { bg: '#FDF1EB', color: '#C8622A' },
  SEO: { bg: '#E2F5EF', color: '#0A5E49' },
  default: { bg: '#ECEAE4', color: '#5A5750' },
};

const MODEL_CHIP_COLORS: Record<string, string> = {
  'GPT-4o': '#10A37F',
  'GPT-4.1': '#10A37F',
  'Claude 3.7': '#C8622A',
  'Gemini': '#4285F4',
};

const TEMPLATES: AgentTemplate[] = [
  {
    id: 'research',
    icon: ManageSearch,
    iconBg: '#EBF0FC',
    iconColor: '#1E4DA8',
    name: 'Research Agent',
    desc: 'Automates web research, summarises findings, and generates structured reports on demand.',
    models: ['GPT-4o'],
    tags: ['Web search', 'Reports'],
  },
  {
    id: 'support',
    icon: SupportAgent,
    iconBg: '#FDF1EB',
    iconColor: '#C8622A',
    name: 'Customer Support Agent',
    desc: 'Handles tickets, FAQs, and escalates complex issues with full conversation context.',
    models: ['GPT-4o'],
    tags: ['Ticketing', 'Escalation'],
  },
  {
    id: 'code-review',
    icon: Code,
    iconBg: '#E2F5EF',
    iconColor: '#0A5E49',
    name: 'Code Review Agent',
    desc: 'Reviews pull requests, flags bugs, suggests improvements, and explains changes inline.',
    models: ['Claude 3.7'],
    tags: ['GitHub', 'Code'],
  },
  {
    id: 'data-analysis',
    icon: BarChart,
    iconBg: '#E2F5EF',
    iconColor: '#0A5E49',
    name: 'Data Analysis Agent',
    desc: 'Processes spreadsheets, generates insights, creates visualisations, and answers data questions.',
    models: ['Gemini'],
    tags: ['Spreadsheets', 'Charts'],
  },
  {
    id: 'content-writer',
    icon: EditNote,
    iconBg: '#FDF1EB',
    iconColor: '#C8622A',
    name: 'Content Writer Agent',
    desc: 'Creates blog posts, social content, and marketing copy with consistent brand voice.',
    models: ['Claude 3.7'],
    tags: ['Marketing', 'SEO'],
  },
];

/* ─── Sub-components ─────────────────────────────────────── */

function ModelPill({ label }: { label: string }) {
  const color = MODEL_CHIP_COLORS[label] ?? '#9E9B93';
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.3,
        borderRadius: '6px',
        bgcolor: 'var(--bg)',
        border: '1px solid var(--border)',
        fontSize: '0.6875rem',
        fontWeight: 600,
        color: 'var(--text)',
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      {label}
    </Box>
  );
}

function TagPill({ label }: { label: string }) {
  const tc = TAG_COLORS[label] ?? TAG_COLORS.default;
  return (
    <Box
      sx={{
        px: 0.875,
        py: 0.25,
        borderRadius: '2rem',
        bgcolor: tc.bg,
        color: tc.color,
        fontSize: '0.6875rem',
        fontWeight: 500,
      }}
    >
      {label}
    </Box>
  );
}

function TemplateCard({ tpl, onUse }: { tpl: AgentTemplate; onUse: () => void }) {
  const Icon = tpl.icon;
  return (
    <Box
      sx={{
        bgcolor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.125,
        transition: 'all 0.18s ease',
        '&:hover': {
          borderColor: 'var(--accent-border)',
          boxShadow: 'var(--shadow)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '10px',
          bgcolor: tpl.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 20, color: tpl.iconColor }} />
      </Box>

      {/* Name */}
      <Typography
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: '0.9375rem',
          color: 'var(--text)',
          lineHeight: 1.2,
        }}
      >
        {tpl.name}
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontSize: '0.8125rem',
          color: 'var(--text2)',
          lineHeight: 1.55,
        }}
      >
        {tpl.desc}
      </Typography>

      {/* Model + tag chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.625 }}>
        {tpl.models.map((m) => <ModelPill key={m} label={m} />)}
        {tpl.tags.map((t) => <TagPill key={t} label={t} />)}
      </Box>

      {/* CTA */}
      <Box
        onClick={onUse}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--accent)',
          cursor: 'pointer',
          mt: 0.25,
          '&:hover': { color: 'var(--accent2)', textDecoration: 'underline' },
        }}
      >
        Use template →
      </Box>
    </Box>
  );
}

function BuildFromScratchCard({ onBuild }: { onBuild: () => void }) {
  return (
    <Box
      onClick={onBuild}
      sx={{
        bgcolor: 'var(--card)',
        border: '2px dashed var(--border2)',
        borderRadius: 'var(--radius)',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        textAlign: 'center',
        cursor: 'pointer',
        minHeight: 160,
        transition: 'all 0.18s ease',
        '&:hover': {
          borderColor: 'var(--accent)',
          bgcolor: 'var(--accent-lt)',
        },
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '10px',
          bgcolor: 'var(--bg)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Add sx={{ fontSize: 20, color: 'var(--text2)' }} />
      </Box>
      <Typography
        sx={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: '0.9375rem',
          color: 'var(--text)',
        }}
      >
        Build from Scratch
      </Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.5 }}>
        Start with any model and a blank canvas — full control over every detail.
      </Typography>
    </Box>
  );
}

/* ─── Page ───────────────────────────────────────────────── */

export default function AgentsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <Box
        sx={{
          px: 3,
          pt: 2,
          pb: 2,
          bgcolor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: '1.375rem',
              color: 'var(--text)',
              lineHeight: 1.15,
              mb: 0.375,
            }}
          >
            Agent Builder
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)' }}>
            Create powerful AI agents using any model. Pick a template or start from scratch.
          </Typography>
        </Box>
        <Button
          onClick={handleOpenModal}
          variant="contained"
          startIcon={<Add />}
          disableElevation
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            px: 2.5,
            py: 1,
            borderRadius: '10px',
            bgcolor: 'var(--accent)',
            flexShrink: 0,
            '&:hover': { bgcolor: 'var(--accent2)' },
            boxShadow: '0 3px 10px rgba(200,98,42,0.25)',
          }}
        >
          New Agent
        </Button>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 4 }, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* "Not sure where to start?" banner */}
        <Box
          sx={{
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: 'var(--shadow)',
            animation: 'fadeUp 0.4s ease',
            maxWidth: 600,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'var(--accent-lt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AutoFixHigh sx={{ fontSize: 20, color: 'var(--accent)' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: 'var(--text)',
                mb: 0.25,
              }}
            >
              Not sure where to start?
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.5 }}>
              Chat with our AI guide — describe what you want your agent to do and get a personalised setup plan.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/chat"
            variant="outlined"
            size="small"
            endIcon={<OpenInNew sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: '8px',
              borderColor: 'var(--border2)',
              color: 'var(--text)',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: 'var(--accent)', color: 'var(--accent)', bgcolor: 'var(--accent-lt)' },
            }}
          >
            Ask the Hub
          </Button>
        </Box>

        {/* ── Agent Templates section ── */}
        <Box>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '0.75rem',
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              mb: 2,
            }}
          >
            AGENT TEMPLATES
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 1.5,
            }}
          >
            {TEMPLATES.map((tpl) => (
              <TemplateCard key={tpl.id} tpl={tpl} onUse={handleOpenModal} />
            ))}
            <BuildFromScratchCard onBuild={handleOpenModal} />
          </Box>
        </Box>

      </Box>

      {/* New Agent Modal */}
      <NewAgentModal open={modalOpen} onClose={handleCloseModal} />
    </Box>
  );
}
