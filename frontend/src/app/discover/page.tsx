'use client';

import { useState, useMemo } from 'react';
import { Box, Typography, Chip, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

interface ResearchItem {
  id: string;
  month: string;
  day: number;
  source: string;
  title: string;
  summary: string;
  tags: string[];
  url?: string;
}

const FEED: ResearchItem[] = [
  {
    id: '1',
    month: 'MAR',
    day: 26,
    source: 'Google DeepMind',
    title: 'Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks',
    summary:
      'Scores 83.2% on AIME 2025 math competition, outperforming all prior models on reasoning-intensive tasks.',
    tags: ['Reasoning', 'Benchmark'],
  },
  {
    id: '2',
    month: 'MAR',
    day: 22,
    source: 'MIT CSAIL',
    title: 'Scaling laws for multimodal models: new empirical findings',
    summary:
      'Research reveals unexpected scaling dynamics when combining vision and language — efficiency gains plateau earlier than expected.',
    tags: ['Multimodal', 'Scaling'],
  },
  {
    id: '3',
    month: 'MAR',
    day: 18,
    source: 'Anthropic',
    title: 'Constitutional AI v2: improved alignment through iterative refinement',
    summary:
      'New methodology achieves 40% reduction in harmful outputs while preserving capability on standard benchmarks.',
    tags: ['Alignment', 'Safety'],
  },
  {
    id: '4',
    month: 'MAR',
    day: 15,
    source: 'Meta AI',
    title: 'Llama 4 Scout & Maverick: natively multimodal from the ground up',
    summary:
      '17B MoE architecture trained on 40 trillion tokens with native understanding across text, image, and video.',
    tags: ['Open Source', 'Multimodal'],
  },
  {
    id: '5',
    month: 'MAR',
    day: 10,
    source: 'Stanford NLP',
    title: 'Long-context recall: how models handle 1M+ token windows',
    summary:
      'Comprehensive evaluation shows sharp recall degradation beyond 200K tokens for most models tested.',
    tags: ['Long Context', 'Evaluation'],
  },
  {
    id: '6',
    month: 'MAR',
    day: 5,
    source: 'DeepSeek',
    title: 'DeepSeek-R1 open weights: reproducing frontier reasoning at minimal cost',
    summary:
      'Full weight release enables fine-tuning for domain-specific reasoning at a fraction of frontier model costs.',
    tags: ['Open Source', 'Reasoning'],
  },
  {
    id: '7',
    month: 'FEB',
    day: 28,
    source: 'OpenAI',
    title: 'o3 system card: safety evaluation and capability assessment',
    summary:
      "Detailed analysis of o3's reasoning capabilities, novel risk mitigations, and performance on expert-level tasks.",
    tags: ['Safety', 'Reasoning'],
  },
  {
    id: '8',
    month: 'FEB',
    day: 24,
    source: 'UC Berkeley',
    title: 'RLHF vs RLAIF: a large-scale empirical comparison',
    summary:
      'Human feedback still outperforms AI feedback on nuanced creative tasks, but RLAIF closes the gap at scale.',
    tags: ['RLHF', 'Alignment'],
  },
  {
    id: '9',
    month: 'FEB',
    day: 19,
    source: 'Mistral AI',
    title: 'Mixture-of-Experts at scale: lessons from training Mixtral 8x22B',
    summary:
      'Routing instability and load balancing remain key challenges; sparse activation cuts inference cost by 4x.',
    tags: ['MoE', 'Efficiency'],
  },
  {
    id: '10',
    month: 'FEB',
    day: 14,
    source: 'Google Research',
    title: 'Efficient attention: linear complexity transformers revisited',
    summary:
      'New approximation scheme achieves 98% of full-attention quality at O(n) cost for sequences up to 512K.',
    tags: ['Architecture', 'Efficiency'],
  },
  {
    id: '11',
    month: 'FEB',
    day: 9,
    source: 'Hugging Face',
    title: 'SmolLM2: surprisingly capable sub-1B models for edge deployment',
    summary:
      'Careful data curation and architecture choices push sub-billion-parameter models to near-3B quality on key tasks.',
    tags: ['Edge AI', 'Efficiency'],
  },
  {
    id: '12',
    month: 'FEB',
    day: 3,
    source: 'Carnegie Mellon',
    title: 'Chain-of-thought prompting does not generalize across domains equally',
    summary:
      'CoT helps most on math and logic, but can hurt performance on commonsense and factual recall tasks.',
    tags: ['Prompting', 'Evaluation'],
  },
  {
    id: '13',
    month: 'JAN',
    day: 29,
    source: 'Microsoft Research',
    title: 'Phi-4: small model, big reasoning — the data-centric approach',
    summary:
      'Synthetic data pipelines and rigorous data filtering allow 14B models to rival 70B counterparts on STEM benchmarks.',
    tags: ['Scaling', 'Data'],
  },
  {
    id: '14',
    month: 'JAN',
    day: 22,
    source: 'xAI',
    title: 'Grok-3: real-time search integration and reasoning at scale',
    summary:
      'Live web access combined with extended thinking allows Grok-3 to excel at time-sensitive analytical questions.',
    tags: ['Reasoning', 'Search'],
  },
  {
    id: '15',
    month: 'JAN',
    day: 17,
    source: 'EleutherAI',
    title: 'The Pile v2: diverse open corpus for next-generation language models',
    summary:
      '825GB of high-quality filtered text across 22 diverse domains, with improved deduplication and quality scoring.',
    tags: ['Data', 'Open Source'],
  },
];

const ALL_TAGS = Array.from(new Set(FEED.flatMap((f) => f.tags))).sort();

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Reasoning: { bg: '#FDEDF1', color: '#9B2042' },
  Benchmark: { bg: '#EBF0FC', color: '#1E4DA8' },
  Multimodal: { bg: '#FDF1EB', color: '#C8622A' },
  Scaling: { bg: '#EBF0FC', color: '#1E4DA8' },
  Alignment: { bg: '#E2F5EF', color: '#0A5E49' },
  Safety: { bg: '#E2F5EF', color: '#0A5E49' },
  'Open Source': { bg: '#E2F5EF', color: '#0A5E49' },
  'Long Context': { bg: '#FDF5E0', color: '#8A5A00' },
  Evaluation: { bg: '#ECEAE4', color: '#5A5750' },
  RLHF: { bg: '#EBF0FC', color: '#1E4DA8' },
  MoE: { bg: '#FDF1EB', color: '#C8622A' },
  Efficiency: { bg: '#E2F5EF', color: '#0A5E49' },
  Architecture: { bg: '#EBF0FC', color: '#1E4DA8' },
  Prompting: { bg: '#FDF5E0', color: '#8A5A00' },
  Data: { bg: '#ECEAE4', color: '#5A5750' },
  'Edge AI': { bg: '#E2F5EF', color: '#0A5E49' },
  Search: { bg: '#EBF0FC', color: '#1E4DA8' },
};

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const filtered = useMemo(() => {
    let items = FEED;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTag) {
      items = items.filter((i) => i.tags.includes(activeTag));
    }
    return items;
  }, [search, activeTag]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg)' }}>
      {/* Page header */}
      <Box
        sx={{
          bgcolor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          px: { xs: 2, md: 6 },
          pt: 3,
          pb: 2.5,
        }}
      >
        <Box
          sx={{
            maxWidth: 720,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.625rem',
                  color: 'var(--text)',
                  lineHeight: 1.15,
                  mb: 0.375,
                }}
              >
                AI Research Feed
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'var(--text2)' }}>
                Latest papers and breakthroughs from leading AI labs
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search papers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 17, color: 'var(--text3)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 240,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '9px',
                  bgcolor: 'var(--bg)',
                  fontSize: '0.875rem',
                  '& fieldset': { borderColor: 'var(--border)' },
                  '&:hover fieldset': { borderColor: 'var(--border2)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                },
                '& .MuiInputBase-input::placeholder': { color: 'var(--text3)', opacity: 1 },
              }}
            />
          </Box>

          {/* Tag filter chips */}
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              size="small"
              onClick={() => setActiveTag('')}
              sx={{
                height: 26,
                borderRadius: '7px',
                fontSize: '0.75rem',
                fontWeight: activeTag === '' ? 700 : 500,
                bgcolor: activeTag === '' ? 'var(--accent)' : 'transparent',
                color: activeTag === '' ? '#fff' : 'var(--text2)',
                border: activeTag === '' ? 'none' : '1px solid var(--border)',
                cursor: 'pointer',
                '&:hover': { bgcolor: activeTag === '' ? 'var(--accent2)' : 'var(--bg2)' },
              }}
            />
            {ALL_TAGS.map((tag) => {
              const tc = TAG_COLORS[tag] ?? { bg: '#ECEAE4', color: '#5A5750' };
              const isActive = activeTag === tag;
              return (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onClick={() => setActiveTag(isActive ? '' : tag)}
                  sx={{
                    height: 26,
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    bgcolor: isActive ? tc.color : tc.bg,
                    color: isActive ? '#fff' : tc.color,
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.85 },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Feed list */}
      <Box
        sx={{
          maxWidth: 720,
          mx: 'auto',
          px: { xs: 2, md: 0 },
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>🔍</Typography>
            <Typography sx={{ fontWeight: 600, color: 'var(--text)', mb: 0.5 }}>
              No results found
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)' }}>
              Try a different keyword or clear the filters
            </Typography>
          </Box>
        ) : (
          filtered.map((item, idx) => <ResearchCard key={item.id} item={item} isLast={idx === filtered.length - 1} />)
        )}
      </Box>
    </Box>
  );
}

function ResearchCard({ item, isLast }: { item: ResearchItem; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        display: 'flex',
        gap: 0,
        bgcolor: hovered ? 'var(--card)' : 'transparent',
        borderRadius: hovered ? 'var(--radius)' : 0,
        border: '1px solid',
        borderColor: hovered ? 'var(--border)' : 'transparent',
        borderBottom: !isLast && !hovered ? '1px solid var(--border)' : undefined,
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        overflow: 'hidden',
        mb: !isLast ? 0 : 0,
      }}
    >
      {/* Date column */}
      <Box
        sx={{
          width: 80,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          pt: 2.5,
          pb: 2,
          px: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.625rem',
            fontWeight: 700,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            lineHeight: 1,
            mb: 0.25,
          }}
        >
          {item.month}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '2rem',
            color: 'var(--text)',
            lineHeight: 1,
          }}
        >
          {item.day}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, py: 2.5, pr: 2.5, minWidth: 0 }}>
        {/* Source badge */}
        <Typography
          sx={{
            display: 'inline-block',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--text3)',
            mb: 0.75,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {item.source}
        </Typography>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '1rem',
            color: hovered ? 'var(--accent)' : 'var(--text)',
            lineHeight: 1.35,
            mb: 0.75,
            transition: 'color 0.15s ease',
          }}
        >
          {item.title}
        </Typography>

        {/* Summary */}
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: 'var(--text2)',
            lineHeight: 1.6,
            mb: 1.25,
          }}
        >
          {item.summary}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.625, flexWrap: 'wrap' }}>
          {item.tags.map((tag) => {
            const tc = TAG_COLORS[tag] ?? { bg: '#ECEAE4', color: '#5A5750' };
            return (
              <Box
                key={tag}
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
                {tag}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
