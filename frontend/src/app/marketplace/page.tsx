'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Select,
  FormControl,
  Grid,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Search,
  GridView,
  ViewList,
  TuneRounded,
} from '@mui/icons-material';
import MarketplaceFilterSidebar, { FilterState } from '@/components/marketplace/MarketplaceFilterSidebar';
import MarketplaceModelCard from '@/components/marketplace/MarketplaceModelCard';
import { MARKETPLACE_MODELS } from '@/lib/marketplaceData';
import { AI_LABS } from '@/lib/constants';
import type { ModelData } from '@/components/models/ModelCard';
import { useTranslation } from 'react-i18next';

const LAB_DESCRIPTIONS: Record<string, string> = {
  openai: 'Pioneering AI research lab behind GPT-5, o3, and DALL-E. Known for state-of-the-art language models.',
  anthropic: 'AI safety company building reliable, interpretable systems. Creators of the Claude model family.',
  google: 'Google DeepMind builds frontier AI models including Gemini, with deep multimodal and reasoning capabilities.',
  meta: 'Meta AI develops open-source models like Llama, advancing accessible AI for the research community.',
  deepseek: 'Chinese AI lab focused on cost-efficient frontier models with strong math and coding performance.',
  mistral: 'European AI lab building efficient, multilingual models with strong reasoning and function calling.',
  xai: 'Elon Musk-founded lab building Grok models with real-time data access and deep reasoning.',
  cohere: 'Enterprise-focused AI building RAG-specialized models with built-in grounding and citations.',
  qwen: 'Alibaba Cloud AI developing multilingual open-source models with strong code and math capabilities.',
  nvidia: 'GPU leader now building AI models. Nemotron series excels at inference efficiency.',
  microsoft: 'Building compact, efficient models like Phi that punch above their weight class.',
  amazon: 'Amazon Bedrock provides managed access to frontier models plus proprietary Nova and Titan series.',
  stability: 'Open-source generative AI lab known for Stable Diffusion and image generation models.',
  perplexity: 'AI-powered search company building models optimized for real-time information retrieval.',
  together: 'Open-source AI infrastructure company hosting and fine-tuning community models at scale.',
  moonshot: 'Chinese AI startup behind Kimi models, known for long-context and agent swarm orchestration.',
  zhipu: 'Chinese AI lab developing the GLM model family with strong multilingual capabilities.',
  baidu: 'Chinese tech giant building ERNIE models for enterprise and multilingual applications.',
  ai21: 'Israeli AI lab creating Jamba models with hybrid Mamba-Transformer architecture.',
  inflection: 'Building emotionally intelligent AI assistants with natural conversation abilities.',
  allenai: 'Non-profit AI research institute creating open-source models like OLMo for scientific progress.',
};

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

const CAPABILITY_CHIPS = [
  { id: '', label: 'All' },
  { id: 'language', label: 'Language' },
  { id: 'vision', label: 'Vision' },
  { id: 'code', label: 'Code' },
  { id: 'audio', label: 'Audio' },
  { id: 'image-gen', label: 'Image Gen' },
  { id: 'open', label: 'Open Source' },
  { id: 'tools', label: 'Tools' },
];

const DEFAULT_FILTERS: FilterState = {
  providers: [],
  types: [],
  priceRange: [0, 50],
  license: 'any',
  contextSize: 'any',
};

function sortModels(models: ModelData[], sort: string): ModelData[] {
  switch (sort) {
    case 'rating':
      return [...models].sort((a, b) => b.rating - a.rating);
    case 'price_asc':
      return [...models].sort((a, b) => a.priceStart - b.priceStart);
    case 'price_desc':
      return [...models].sort((a, b) => b.priceStart - a.priceStart);
    case 'popular':
      return [...models].sort((a, b) => b.reviews - a.reviews);
    default:
      return models;
  }
}

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [capability, setCapability] = useState('');
  const [sort, setSort] = useState('rating');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [gridView, setGridView] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    let result = MARKETPLACE_MODELS;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.org.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedLab) {
      result = result.filter((m) => m.lab === selectedLab);
    }

    if (capability) {
      result = result.filter((m) => m.types.includes(capability));
    }

    if (filters.providers.length > 0) {
      result = result.filter((m) => filters.providers.includes(m.lab));
    }

    if (filters.types.length > 0) {
      result = result.filter((m) => m.types.some((t) => filters.types.includes(t)));
    }

    result = result.filter(
      (m) => m.priceStart >= filters.priceRange[0] && m.priceStart <= filters.priceRange[1]
    );

    if (filters.license === 'open') {
      result = result.filter((m) => m.badge === 'open' || m.types.includes('open'));
    }

    return sortModels(result, sort);
  }, [search, selectedLab, capability, sort, filters]);

  const activeFiltersCount =
    filters.providers.length +
    filters.types.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 50 ? 1 : 0) +
    (filters.license !== 'any' ? 1 : 0) +
    (filters.contextSize !== 'any' ? 1 : 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <Box
        sx={{
          bgcolor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          px: { xs: 2, md: 4 },
          pt: 2.5,
          pb: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '1.375rem',
                color: 'var(--text)',
                lineHeight: 1.2,
                mb: 0.375,
              }}
            >
              {t('marketplace.title')}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)' }}>
              {t('marketplace.modelCount', { count: MARKETPLACE_MODELS.length })}
            </Typography>
          </Box>

          {/* Search bar */}
          <Box sx={{ width: { xs: '100%', md: 340 }, ml: { xs: 0, md: 3 }, flex: { md: '0 0 340px' } }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t('marketplace.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: 'var(--text3)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
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
        </Box>

        {/* Provider chip row */}
        <Box
          sx={{
            display: 'flex',
            gap: 0.75,
            overflowX: 'auto',
            pb: 0,
            '&::-webkit-scrollbar': { height: 0 },
          }}
        >
          <Chip
            label={t('marketplace.allLabs')}
            size="small"
            onClick={() => setSelectedLab('')}
            sx={{
              height: 30,
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: selectedLab === '' ? 700 : 500,
              bgcolor: selectedLab === '' ? 'var(--accent)' : 'var(--bg)',
              color: selectedLab === '' ? '#fff' : 'var(--text2)',
              border: selectedLab === '' ? 'none' : '1px solid var(--border)',
              flexShrink: 0,
              cursor: 'pointer',
              mb: 1.5,
              '&:hover': { bgcolor: selectedLab === '' ? 'var(--accent2)' : 'var(--bg2)' },
            }}
          />
          {AI_LABS.map((lab) => (
            <Chip
              key={lab.id}
              label={lab.name}
              size="small"
              onClick={() => setSelectedLab(lab.id === selectedLab ? '' : lab.id)}
              sx={{
                height: 30,
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: selectedLab === lab.id ? 700 : 500,
                bgcolor: selectedLab === lab.id ? 'var(--accent)' : 'var(--bg)',
                color: selectedLab === lab.id ? '#fff' : 'var(--text2)',
                border: selectedLab === lab.id ? 'none' : '1px solid var(--border)',
                flexShrink: 0,
                cursor: 'pointer',
                mb: 1.5,
                '&:hover': { bgcolor: selectedLab === lab.id ? 'var(--accent2)' : 'var(--bg2)' },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Selected lab banner */}
      {selectedLab && (() => {
        const lab = AI_LABS.find((l) => l.id === selectedLab);
        const labModelCount = MARKETPLACE_MODELS.filter((m) => m.lab === selectedLab).length;
        if (!lab) return null;
        return (
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              py: 1.5,
              bgcolor: 'var(--card)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: `${lab.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                flexShrink: 0,
              }}
            >
              {lab.icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    color: 'var(--text)',
                  }}
                >
                  {lab.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'var(--text3)',
                    bgcolor: 'var(--bg)',
                    px: 1,
                    py: 0.125,
                    borderRadius: '2rem',
                    border: '1px solid var(--border)',
                  }}
                >
                  {t('marketplace.modelCount_' + (labModelCount === 1 ? 'singular' : 'plural'), { count: labModelCount })}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.4 }}>
                {LAB_DESCRIPTIONS[selectedLab] ?? t('marketplace.exploreLab', { lab: lab.name })}
              </Typography>
            </Box>
          </Box>
        );
      })()}

      {/* Body: sidebar + content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Filter sidebar */}
        {sidebarOpen && (
          <MarketplaceFilterSidebar filters={filters} onChange={setFilters} />
        )}

        {/* Main content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          {/* Toolbar row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.5,
              py: 1.25,
              bgcolor: 'var(--card)',
              borderBottom: '1px solid var(--border)',
              gap: 1.5,
              flexWrap: 'wrap',
            }}
          >
            {/* Left: toggle sidebar + capability chips */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Tooltip title={sidebarOpen ? t('marketplace.hideFilters') : t('marketplace.showFilters')}>
                <Button
                  size="small"
                  startIcon={<TuneRounded sx={{ fontSize: 16 }} />}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.8125rem',
                    color: 'var(--text2)',
                    borderRadius: '8px',
                    px: 1.25,
                    py: 0.5,
                    border: '1px solid var(--border)',
                    bgcolor: activeFiltersCount > 0 ? 'var(--accent-lt)' : 'transparent',
                    '&:hover': { bgcolor: 'var(--bg2)' },
                  }}
                >
                  {t('marketplace.filters')}{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
                </Button>
              </Tooltip>

              {CAPABILITY_CHIPS.map(({ id, label }) => (
                <Chip
                  key={id || 'all'}
                  label={label}
                  size="small"
                  onClick={() => setCapability(id)}
                  sx={{
                    height: 28,
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: capability === id ? 600 : 500,
                    bgcolor: capability === id ? 'var(--accent-lt)' : 'transparent',
                    color: capability === id ? 'var(--accent)' : 'var(--text2)',
                    border: `1px solid ${capability === id ? 'var(--accent-border)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'var(--bg2)' },
                  }}
                />
              ))}
            </Box>

            {/* Right: sort + view toggle + count */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                {t('marketplace.resultCount', { count: filtered.length })}
              </Typography>
              <FormControl size="small">
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  sx={{
                    fontSize: '0.8125rem',
                    borderRadius: '8px',
                    bgcolor: 'var(--bg)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border2)' },
                    '& .MuiSelect-select': { py: 0.625, pr: 3.5, pl: 1.25 },
                  }}
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <MenuItem key={value} value={value} sx={{ fontSize: '0.8125rem' }}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <Tooltip title="Grid view">
                  <Box
                    onClick={() => setGridView(true)}
                    sx={{
                      px: 1,
                      py: 0.625,
                      cursor: 'pointer',
                      bgcolor: gridView ? 'var(--accent-lt)' : 'transparent',
                      color: gridView ? 'var(--accent)' : 'var(--text3)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <GridView sx={{ fontSize: 16 }} />
                  </Box>
                </Tooltip>
                <Tooltip title="List view">
                  <Box
                    onClick={() => setGridView(false)}
                    sx={{
                      px: 1,
                      py: 0.625,
                      cursor: 'pointer',
                      bgcolor: !gridView ? 'var(--accent-lt)' : 'transparent',
                      color: !gridView ? 'var(--accent)' : 'var(--text3)',
                      display: 'flex',
                      alignItems: 'center',
                      borderLeft: '1px solid var(--border)',
                    }}
                  >
                    <ViewList sx={{ fontSize: 16 }} />
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Model grid */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
            {filtered.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ fontSize: '2.5rem', mb: 1.5 }}>🔍</Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', mb: 0.75 }}>
                  {t('marketplace.noResults')}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text2)', mb: 2 }}>
                  {t('marketplace.noResultsHint')}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => { setSearch(''); setSelectedLab(''); setCapability(''); setFilters(DEFAULT_FILTERS); }}
                  sx={{ textTransform: 'none', borderRadius: '8px', borderColor: 'var(--border)', color: 'var(--text2)' }}
                >
                  {t('common.clearFilters')}
                </Button>
              </Box>
            ) : (
              <Box
                sx={
                  gridView
                    ? {
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: 'repeat(2, 1fr)',
                          md: 'repeat(3, 1fr)',
                          lg: 'repeat(4, 1fr)',
                          xl: 'repeat(5, 1fr)',
                        },
                        gap: 1.5,
                      }
                    : {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }
                }
              >
                {filtered.map((model) => (
                  <MarketplaceModelCard key={model.id} model={model} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
