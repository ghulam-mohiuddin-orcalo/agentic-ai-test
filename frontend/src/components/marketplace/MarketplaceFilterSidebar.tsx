'use client';

import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface FilterState {
  providers: string[];
  types: string[];
  priceRange: [number, number];
  license: string;
  contextSize: string;
}

const PROVIDERS = [
  { id: 'openai', label: 'OpenAI', count: 12 },
  { id: 'anthropic', label: 'Anthropic', count: 8 },
  { id: 'google', label: 'Google DeepMind', count: 9 },
  { id: 'meta', label: 'Meta AI', count: 6 },
  { id: 'mistral', label: 'Mistral AI', count: 5 },
  { id: 'deepseek', label: 'DeepSeek', count: 4 },
  { id: 'xai', label: 'xAI', count: 3 },
  { id: 'microsoft', label: 'Microsoft', count: 4 },
  { id: 'amazon', label: 'Amazon', count: 3 },
  { id: 'cohere', label: 'Cohere', count: 2 },
];

const MODEL_TYPES = [
  { id: 'language', labelKey: 'filters.language' },
  { id: 'vision', labelKey: 'filters.vision' },
  { id: 'code', labelKey: 'filters.code' },
  { id: 'audio', labelKey: 'filters.audio' },
  { id: 'image-gen', labelKey: 'filters.imageGen' },
  { id: 'embedding', labelKey: 'filters.embedding' },
];

const CONTEXT_SIZES = [
  { value: 'any', labelKey: 'filters.any' },
  { value: '8k', labelKey: 'filters.context8k' },
  { value: '32k', labelKey: 'filters.context32k' },
  { value: '128k', labelKey: 'filters.context128k' },
  { value: '1m', labelKey: 'filters.context1m' },
];

const LICENSE_OPTIONS = [
  { value: 'any', labelKey: 'filters.any' },
  { value: 'commercial', labelKey: 'filters.commercial' },
  { value: 'open', labelKey: 'filters.openSource' },
  { value: 'research', labelKey: 'filters.researchOnly' },
];

const QUICK_GUIDES = [
  { labelKey: 'filters.guideChoose', href: '/discover' },
  { labelKey: 'filters.guidePricing', href: '/discover' },
  { labelKey: 'filters.guideOpenSource', href: '/discover' },
  { labelKey: 'filters.guideBenchmarks', href: '/discover' },
];

interface Props {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <Typography
      sx={{
        fontSize: '0.6875rem',
        fontWeight: 700,
        color: 'var(--text3)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        mb: 1,
      }}
    >
      {label}
    </Typography>
  );
}

export default function MarketplaceFilterSidebar({ filters, onChange }: Props) {
  const { t } = useTranslation();
  const toggleProvider = (id: string) => {
    const next = filters.providers.includes(id)
      ? filters.providers.filter((p) => p !== id)
      : [...filters.providers, id];
    onChange({ ...filters, providers: next });
  };

  const toggleType = (id: string) => {
    const next = filters.types.includes(id)
      ? filters.types.filter((t) => t !== id)
      : [...filters.types, id];
    onChange({ ...filters, types: next });
  };

  const checkboxSx = {
    py: 0.5,
    m: 0,
    '& .MuiTypography-root': { fontSize: '0.8125rem', color: 'var(--text)', lineHeight: 1.4 },
    '& .MuiCheckbox-root': { p: 0.5, color: 'var(--text3)' },
    '& .Mui-checked': { color: 'var(--accent)' },
  };

  const radioSx = {
    py: 0.4,
    m: 0,
    '& .MuiTypography-root': { fontSize: '0.8125rem', color: 'var(--text)' },
    '& .MuiRadio-root': { p: 0.5, color: 'var(--text3)' },
    '& .Mui-checked': { color: 'var(--accent)' },
  };

  return (
    <Box
      sx={{
        width: 200,
        flexShrink: 0,
        bgcolor: 'var(--card)',
        borderRight: '1px solid var(--border)',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Search / what are you looking for */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Box
          sx={{
            bgcolor: 'var(--accent-lt)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-sm)',
            p: 1.25,
            mb: 2,
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, mb: 0.25 }}>
            🎯 {t('filters.notSure')}
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text2)', lineHeight: 1.4 }}>
            {t('filters.notSureDesc')}
          </Typography>
        </Box>

        {/* Provider */}
        <SectionHeader label={t('filters.provider')} />
        {PROVIDERS.map(({ id, label, count }) => (
          <FormControlLabel
            key={id}
            control={
              <Checkbox
                size="small"
                checked={filters.providers.includes(id)}
                onChange={() => toggleProvider(id)}
              />
            }
            label={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{label}</span>
                <Typography component="span" sx={{ fontSize: '0.6875rem', color: 'var(--text3)', ml: 0.5 }}>
                  {count}
                </Typography>
              </Box>
            }
            sx={{ ...checkboxSx, display: 'flex', width: '100%' }}
          />
        ))}
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* Model type */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <SectionHeader label={t('filters.modelType')} />
        {MODEL_TYPES.map(({ id, labelKey }) => (
          <FormControlLabel
            key={id}
            control={
              <Checkbox
                size="small"
                checked={filters.types.includes(id)}
                onChange={() => toggleType(id)}
              />
            }
            label={t(labelKey)}
            sx={checkboxSx}
          />
        ))}
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* Price range */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <SectionHeader label={t('filters.price')} />
        <Box sx={{ px: 0.5, pt: 1 }}>
          <Slider
            value={filters.priceRange}
            onChange={(_e, v) => onChange({ ...filters, priceRange: v as [number, number] })}
            min={0}
            max={50}
            step={0.5}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => (v === 0 ? t('filters.free') : `$${v}`)}
            sx={{
              color: 'var(--accent)',
              '& .MuiSlider-thumb': { width: 14, height: 14 },
              '& .MuiSlider-track': { height: 3 },
              '& .MuiSlider-rail': { height: 3, bgcolor: 'var(--bg3)' },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>
              {filters.priceRange[0] === 0 ? t('filters.free') : `$${filters.priceRange[0]}`}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>
              ${filters.priceRange[1]}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* Context size */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <SectionHeader label={t('filters.contextSize')} />
        <RadioGroup
          value={filters.contextSize}
          onChange={(e) => onChange({ ...filters, contextSize: e.target.value })}
        >
          {CONTEXT_SIZES.map(({ value, labelKey }) => (
            <FormControlLabel key={value} value={value} control={<Radio size="small" />} label={t(labelKey)} sx={radioSx} />
          ))}
        </RadioGroup>
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* License */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <SectionHeader label={t('filters.license')} />
        <RadioGroup
          value={filters.license}
          onChange={(e) => onChange({ ...filters, license: e.target.value })}
        >
          {LICENSE_OPTIONS.map(({ value, labelKey }) => (
            <FormControlLabel key={value} value={value} control={<Radio size="small" />} label={t(labelKey)} sx={radioSx} />
          ))}
        </RadioGroup>
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* Quick Guides */}
      <Box sx={{ p: 2, pb: 2 }}>
        <SectionHeader label={t('filters.quickGuides')} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {QUICK_GUIDES.map(({ labelKey, href }) => (
            <Box
              key={labelKey}
              component="a"
              href={href}
              sx={{
                fontSize: '0.8125rem',
                color: 'var(--accent)',
                textDecoration: 'none',
                py: 0.625,
                px: 0.5,
                borderRadius: '6px',
                cursor: 'pointer',
                lineHeight: 1.4,
                display: 'block',
                '&:hover': {
                  bgcolor: 'var(--accent-lt)',
                  textDecoration: 'underline',
                },
              }}
            >
              {t(labelKey)}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
