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
  Rating,
} from '@mui/material';

export interface FilterState {
  providers: string[];
  types: string[];
  priceRange: [number, number];
  pricingModel: string;
  minRating: number;
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
  { id: 'language', label: 'Language' },
  { id: 'vision', label: 'Vision' },
  { id: 'code', label: 'Code' },
  { id: 'audio', label: 'Audio' },
  { id: 'image-gen', label: 'Image Gen' },
  { id: 'embedding', label: 'Embedding' },
];

const CONTEXT_SIZES = [
  { value: 'any', label: 'Any' },
  { value: '8k', label: '8K+' },
  { value: '32k', label: '32K+' },
  { value: '128k', label: '128K+' },
  { value: '1m', label: '1M+' },
];

const PRICING_MODEL_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
];

const LICENSE_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'open', label: 'Open Source' },
  { value: 'research', label: 'Research only' },
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
            🎯 Not sure which model?
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text2)', lineHeight: 1.4 }}>
            Tell me what you're trying to achieve and I'll help you find it
          </Typography>
        </Box>

        {/* Provider */}
        <SectionHeader label="PROVIDER" />
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
        <SectionHeader label="MODEL TYPE" />
        {MODEL_TYPES.map(({ id, label }) => (
          <FormControlLabel
            key={id}
            control={
              <Checkbox
                size="small"
                checked={filters.types.includes(id)}
                onChange={() => toggleType(id)}
              />
            }
            label={label}
            sx={checkboxSx}
          />
        ))}
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* Pricing Model */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <SectionHeader label="PRICING MODEL" />
        <RadioGroup
          value={filters.pricingModel}
          onChange={(e) => onChange({ ...filters, pricingModel: e.target.value })}
        >
          {PRICING_MODEL_OPTIONS.map(({ value, label }) => (
            <FormControlLabel key={value} value={value} control={<Radio size="small" />} label={label} sx={radioSx} />
          ))}
        </RadioGroup>
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* Min Rating */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <SectionHeader label="MIN RATING" />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating
            value={filters.minRating}
            onChange={(_, v) => onChange({ ...filters, minRating: v ?? 0 })}
            precision={0.5}
            size="small"
            sx={{ color: '#F5A623' }}
          />
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
            {filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* Price range */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <SectionHeader label="PRICE / 1M TOKENS" />
        <Box sx={{ px: 0.5, pt: 1 }}>
          <Slider
            value={filters.priceRange}
            onChange={(_e, v) => onChange({ ...filters, priceRange: v as [number, number] })}
            min={0}
            max={50}
            step={0.5}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => (v === 0 ? 'Free' : `$${v}`)}
            sx={{
              color: 'var(--accent)',
              '& .MuiSlider-thumb': { width: 14, height: 14 },
              '& .MuiSlider-track': { height: 3 },
              '& .MuiSlider-rail': { height: 3, bgcolor: 'var(--bg3)' },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>
              {filters.priceRange[0] === 0 ? 'Free' : `$${filters.priceRange[0]}`}
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
        <SectionHeader label="CONTEXT SIZE" />
        <RadioGroup
          value={filters.contextSize}
          onChange={(e) => onChange({ ...filters, contextSize: e.target.value })}
        >
          {CONTEXT_SIZES.map(({ value, label }) => (
            <FormControlLabel key={value} value={value} control={<Radio size="small" />} label={label} sx={radioSx} />
          ))}
        </RadioGroup>
      </Box>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* License */}
      <Box sx={{ p: 2, pb: 2 }}>
        <SectionHeader label="LICENSE" />
        <RadioGroup
          value={filters.license}
          onChange={(e) => onChange({ ...filters, license: e.target.value })}
        >
          {LICENSE_OPTIONS.map(({ value, label }) => (
            <FormControlLabel key={value} value={value} control={<Radio size="small" />} label={label} sx={radioSx} />
          ))}
        </RadioGroup>
      </Box>
    </Box>
  );
}
