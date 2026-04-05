'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Tabs,
  Tab,
  Rating,
  IconButton,
  Chip,
  Button,
  Divider,
  Slider,
  LinearProgress,
  TextField,
  Stack,
} from '@mui/material';
import {
  Close,
  Star,
  ContentCopy,
  Check,
  Send,
} from '@mui/icons-material';
import { ModelData } from '@/components/models/ModelCard';
import { MODEL_DETAILS, ModelDetailData, ModelReview } from '@/lib/modelDetails';

const BADGE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  hot: { label: '🔥 Hot', bg: 'linear-gradient(135deg, #FF6B6B, #FF4757)', color: '#fff' },
  new: { label: '✨ New', bg: '#E2F5EF', color: '#0A5E49' },
  open: { label: '🌐 Open', bg: '#EBF0FC', color: '#1E4DA8' },
};

const TAB_LABELS = ['Overview', 'How to Use', 'Pricing', 'Prompt Guide', 'Agent Creation', 'Reviews'];

/* ─── Overview Tab ─── */
function OverviewTab({ data }: { data: ModelDetailData }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, mb: 3 }}>
        {data.overview.description}
      </Typography>

      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', mb: 1.5 }}>
        Capabilities
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {data.overview.capabilities.map((cap) => (
          <Chip
            key={cap}
            label={cap}
            size="small"
            sx={{
              bgcolor: '#E2F5EF',
              color: '#0A5E49',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: '8px',
            }}
          />
        ))}
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', mb: 1.5 }}>
        Limitations
      </Typography>
      <Box sx={{ mb: 3 }}>
        {data.overview.limitations.map((lim, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
            <Typography sx={{ color: '#FF4757', fontSize: '0.8125rem', lineHeight: 1.5 }}>•</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.5 }}>{lim}</Typography>
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', mb: 1.5 }}>
        Benchmarks
      </Typography>
      <Box
        sx={{
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            bgcolor: 'var(--bg2)',
            px: 2,
            py: 1,
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text3)' }}>Benchmark</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text3)', textAlign: 'right' }}>Score</Typography>
        </Box>
        {data.overview.benchmarks.map((b, i) => (
          <Box
            key={i}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              px: 2,
              py: 1.25,
              borderTop: i > 0 ? '1px solid var(--border)' : 'none',
            }}
          >
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{b.name}</Typography>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)', textAlign: 'right' }}>{b.score}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ─── How to Use Tab ─── */
function HowToUseTab({ data }: { data: ModelDetailData }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <Box>
      {data.howToUse.steps.map((step, i) => (
        <Box key={i} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'var(--accent)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>
              {step.title}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.6, ml: 5.5, mb: 1 }}>
            {step.description}
          </Typography>
          {step.code && (
            <Box sx={{ ml: 5.5, position: 'relative' }}>
              <Box
                sx={{
                  bgcolor: '#1E1E2E',
                  borderRadius: '10px',
                  p: 2,
                  overflow: 'auto',
                  '& pre': {
                    margin: 0,
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '0.75rem',
                    lineHeight: 1.6,
                    color: '#CDD6F4',
                    whiteSpace: 'pre-wrap',
                  },
                }}
              >
                <pre>{step.code}</pre>
              </Box>
              <IconButton
                size="small"
                onClick={() => handleCopy(step.code!, i)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#CDD6F4',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                {copiedIdx === i ? <Check sx={{ fontSize: 14 }} /> : <ContentCopy sx={{ fontSize: 14 }} />}
              </IconButton>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

/* ─── Pricing Tab ─── */
function PricingTab({ data }: { data: ModelDetailData }) {
  const [tokens, setTokens] = useState(1000);

  const inputCost = ((data.pricing.inputPerMillion * tokens) / 1000000).toFixed(4);
  const outputCost = ((data.pricing.outputPerMillion * tokens) / 1000000).toFixed(4);
  const totalCost = (parseFloat(inputCost) + parseFloat(outputCost)).toFixed(4);

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ border: '1px solid var(--border)', borderRadius: '12px', p: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)', mb: 0.5 }}>Input Price</Typography>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
            ${data.pricing.inputPerMillion}<Typography component="span" sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}> / 1M tokens</Typography>
          </Typography>
        </Box>
        <Box sx={{ border: '1px solid var(--border)', borderRadius: '12px', p: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)', mb: 0.5 }}>Output Price</Typography>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>
            ${data.pricing.outputPerMillion}<Typography component="span" sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}> / 1M tokens</Typography>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ border: '1px solid var(--border)', borderRadius: '12px', p: 2, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Context Window</Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{data.pricing.contextWindow}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Batch Size</Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{data.pricing.batchSize}</Typography>
          </Box>
        </Box>
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', mb: 2 }}>
        Cost Calculator
      </Typography>
      <Box sx={{ border: '1px solid var(--border)', borderRadius: '12px', p: 2.5, mb: 3 }}>
        <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)', mb: 1 }}>
          Estimated tokens per request: {tokens.toLocaleString()}
        </Typography>
        <Slider
          value={tokens}
          onChange={(_, v) => setTokens(v as number)}
          min={100}
          max={100000}
          step={100}
          sx={{ color: 'var(--accent)', mb: 2 }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>Input Cost</Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>${inputCost}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>Output Cost</Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>${outputCost}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>Total (est.)</Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>${totalCost}</Typography>
          </Box>
        </Box>
      </Box>

      {data.pricing.notes && (
        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text3)', fontStyle: 'italic' }}>
          {data.pricing.notes}
        </Typography>
      )}
    </Box>
  );
}

/* ─── Prompt Guide Tab ─── */
function PromptGuideTab({ data }: { data: ModelDetailData }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', mb: 1.5 }}>
        Best Practices
      </Typography>
      <Box sx={{ mb: 3 }}>
        {data.promptGuide.bestPractices.map((bp, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
            <Typography sx={{ color: 'var(--accent)', fontSize: '0.8125rem', lineHeight: 1.5 }}>✓</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.5 }}>{bp}</Typography>
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', mb: 1.5 }}>
        Example Prompts
      </Typography>
      <Box sx={{ mb: 3 }}>
        {data.promptGuide.examples.map((ex, i) => (
          <Box
            key={i}
            sx={{
              border: '1px solid var(--border)',
              borderRadius: '12px',
              p: 2,
              mb: 1.5,
              position: 'relative',
            }}
          >
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', mb: 0.75 }}>
              {ex.title}
            </Typography>
            <Typography
              sx={{
                color: 'var(--text2)',
                lineHeight: 1.6,
                bgcolor: 'var(--bg2)',
                p: 1.5,
                borderRadius: '8px',
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.75rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {ex.prompt}
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(ex.prompt);
                setCopiedIdx(i);
                setTimeout(() => setCopiedIdx(null), 2000);
              }}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              {copiedIdx === i ? <Check sx={{ fontSize: 14, color: '#0A5E49' }} /> : <ContentCopy sx={{ fontSize: 14, color: 'var(--text3)' }} />}
            </IconButton>
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', mb: 1.5 }}>
        Pro Tips
      </Typography>
      {data.promptGuide.tips.map((tip, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
          <Typography sx={{ color: '#F5A623', fontSize: '0.8125rem', lineHeight: 1.5 }}>💡</Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.5 }}>{tip}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/* ─── Agent Creation Tab ─── */
function AgentCreationTab({ data }: { data: ModelDetailData }) {
  const [copied, setCopied] = useState(false);
  const config = data.agentCreation.suggestedConfig;

  return (
    <Box>
      <Typography sx={{ fontSize: '0.9375rem', color: 'var(--text2)', lineHeight: 1.7, mb: 2 }}>
        {data.agentCreation.description}
      </Typography>

      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', mb: 1.5 }}>
        Steps to Create an Agent
      </Typography>
      <Box sx={{ mb: 3 }}>
        {data.agentCreation.steps.map((step, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: 'var(--accent-lt)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6875rem',
                fontWeight: 700,
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              {i + 1}
            </Box>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.5 }}>{step}</Typography>
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', mb: 1.5 }}>
        Suggested Configuration
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            bgcolor: '#1E1E2E',
            borderRadius: '10px',
            p: 2,
            '& pre': {
              margin: 0,
              fontFamily: "'Fira Code', monospace",
              fontSize: '0.75rem',
              lineHeight: 1.6,
              color: '#CDD6F4',
              whiteSpace: 'pre-wrap',
            },
          }}
        >
          <pre>{`{
  "model": "your-model-id",
  "temperature": ${config.temperature},
  "maxTokens": ${config.maxTokens},
  "topP": ${config.topP},
  "systemPrompt": "${config.systemPrompt}"
}`}</pre>
        </Box>
        <IconButton
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(config, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.1)',
            color: '#CDD6F4',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
          }}
        >
          {copied ? <Check sx={{ fontSize: 14 }} /> : <ContentCopy sx={{ fontSize: 14 }} />}
        </IconButton>
      </Box>
    </Box>
  );
}

/* ─── Reviews Tab ─── */
function ReviewsTab({ data }: { data: ModelDetailData }) {
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const maxCount = Math.max(...data.reviews.distribution.map((d) => d.count));

  return (
    <Box>
      {/* Rating summary */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'flex-start' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
            {data.reviews.averageRating.toFixed(1)}
          </Typography>
          <Rating value={data.reviews.averageRating} precision={0.1} readOnly size="small" sx={{ mb: 0.5 }} />
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
            {data.reviews.totalReviews.toLocaleString()} reviews
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          {data.reviews.distribution.map((d) => (
            <Box key={d.stars} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)', width: 20, textAlign: 'right' }}>
                {d.stars}
              </Typography>
              <Star sx={{ fontSize: 12, color: '#F5A623' }} />
              <LinearProgress
                variant="determinate"
                value={maxCount > 0 ? (d.count / maxCount) * 100 : 0}
                sx={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'var(--bg2)',
                  '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#F5A623' },
                }}
              />
              <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)', width: 35 }}>
                {d.count.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Write review */}
      <Box sx={{ mb: 3, p: 2, border: '1px solid var(--border)', borderRadius: '12px' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', mb: 1 }}>
          Write a Review
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)' }}>Your rating:</Typography>
          <Rating
            value={reviewRating}
            onChange={(_, v) => setReviewRating(v ?? 0)}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Share your experience with this model..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            multiline
            rows={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '0.8125rem',
                '& fieldset': { borderColor: 'var(--border)' },
                '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
              },
            }}
          />
          <IconButton
            sx={{
              bgcolor: 'var(--accent)',
              color: '#fff',
              borderRadius: '10px',
              alignSelf: 'flex-end',
              '&:hover': { bgcolor: 'var(--accent2)' },
              '&.Mui-disabled': { bgcolor: 'var(--bg2)', color: 'var(--text3)' },
            }}
            disabled={!reviewText.trim() || reviewRating === 0}
          >
            <Send sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Reviews list */}
      <Stack spacing={2}>
        {data.reviews.items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Stack>
    </Box>
  );
}

function ReviewCard({ review }: { review: ModelReview }) {
  return (
    <Box sx={{ p: 2, border: '1px solid var(--border)', borderRadius: '12px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'var(--accent-lt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              color: 'var(--accent)',
              fontWeight: 700,
            }}
          >
            {review.avatar}
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)' }}>
              {review.user}
            </Typography>
            <Rating value={review.rating} readOnly size="small" sx={{ '& .MuiRating-icon': { fontSize: '0.75rem' } }} />
          </Box>
        </Box>
        <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>{review.date}</Typography>
      </Box>
      <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)', lineHeight: 1.6, mb: 1 }}>
        {review.comment}
      </Typography>
      <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>
        {review.helpful} people found this helpful
      </Typography>
    </Box>
  );
}

/* ─── Main Dialog ─── */
interface ModelDetailDialogProps {
  model: ModelData | null;
  open: boolean;
  onClose: () => void;
}

export default function ModelDetailDialog({ model, open, onClose }: ModelDetailDialogProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!model) return null;

  const details = MODEL_DETAILS[model.id];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          maxHeight: '90vh',
          bgcolor: 'var(--card)',
          border: '1px solid var(--border)',
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
          pt: 4,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              bgcolor: model.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
            }}
          >
            {model.icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.25 }}>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'var(--text)',
                  lineHeight: 1.2,
                }}
              >
                {model.name}
              </Typography>
              {model.badge && BADGE_CONFIG[model.badge] && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: '2rem',
                    background: BADGE_CONFIG[model.badge].bg,
                    color: BADGE_CONFIG[model.badge].color,
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {BADGE_CONFIG[model.badge].label}
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text3)' }}>{model.org}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.375 }}>
                <Star sx={{ fontSize: 14, color: '#F5A623' }} />
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)' }}>
                  {model.rating.toFixed(1)}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                  ({model.reviews.toLocaleString()} reviews)
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'var(--text3)', mt: -0.5, mr: -1 }}>
          <Close />
        </IconButton>
      </Box>

      {/* Tags + CTA */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {model.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                bgcolor: 'var(--bg2)',
                color: 'var(--text2)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                borderRadius: '8px',
                border: '1px solid var(--border)',
              }}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            px: 2.5,
            py: 0.75,
            fontWeight: 600,
            fontSize: '0.8125rem',
            bgcolor: 'var(--accent)',
            '&:hover': { bgcolor: 'var(--accent2)' },
          }}
        >
          Use in Chat →
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid var(--border)', px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text3)',
              minHeight: 40,
              px: 1.5,
              '&.Mui-selected': {
                color: 'var(--accent)',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'var(--accent)',
              height: 2.5,
              borderRadius: '2px 2px 0 0',
            },
          }}
        >
          {TAB_LABELS.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {details ? (
          <>
            {activeTab === 0 && <OverviewTab data={details} />}
            {activeTab === 1 && <HowToUseTab data={details} />}
            {activeTab === 2 && <PricingTab data={details} />}
            {activeTab === 3 && <PromptGuideTab data={details} />}
            {activeTab === 4 && <AgentCreationTab data={details} />}
            {activeTab === 5 && <ReviewsTab data={details} />}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>📋</Typography>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', mb: 0.5 }}>
              Detailed information coming soon
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text3)' }}>
              We&apos;re working on adding comprehensive details for {model.name}.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
