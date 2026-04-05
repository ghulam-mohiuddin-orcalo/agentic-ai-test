'use client';

import { Box, Typography, LinearProgress, Divider } from '@mui/material';
import { ModelData } from '@/components/models/ModelCard';

interface UsageOverviewProps {
  activeModel: ModelData | null;
  messagesCount: number;
  estimatedTokens: number;
}

export default function UsageOverview({ activeModel, messagesCount, estimatedTokens }: UsageOverviewProps) {
  const contextLimit = activeModel ? getContextLimit(activeModel) : 128000;
  const usagePercent = Math.min((estimatedTokens / contextLimit) * 100, 100);

  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        bgcolor: 'var(--card)',
        borderLeft: '1px solid var(--border)',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text)', mb: 0.25 }}>
          Usage Overview
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', color: 'var(--text3)' }}>
          Current session stats
        </Typography>
      </Box>

      {/* Active Model */}
      {activeModel && (
        <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
            Active Model
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: activeModel.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0,
              }}
            >
              {activeModel.icon}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text)', lineHeight: 1.2 }}>
                {activeModel.name}
              </Typography>
              <Typography sx={{ fontSize: '0.625rem', color: 'var(--text3)' }}>
                {activeModel.org}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <InfoRow label="Price" value={activeModel.price} />
            <InfoRow label="Rating" value={`${activeModel.rating.toFixed(1)} ⭐`} />
          </Box>
        </Box>
      )}

      {/* Session Stats */}
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
          Session Stats
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Messages</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>{messagesCount}</Typography>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Est. Tokens</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                {estimatedTokens.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Context Used</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: usagePercent > 80 ? '#FF4757' : 'var(--text)' }}>
                {usagePercent.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={usagePercent}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: 'var(--bg2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                  bgcolor: usagePercent > 80 ? '#FF4757' : 'var(--accent)',
                },
              }}
            />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Context Limit</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                {(contextLimit / 1000).toFixed(0)}K
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Cost Estimate */}
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
          Cost Estimate
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <InfoRow label="Session Cost" value={`$${estimateCost(activeModel, estimatedTokens)}`} />
          <InfoRow label="Avg per Message" value={`$${estimateCost(activeModel, Math.max(estimatedTokens / Math.max(messagesCount, 1), 0))}`} />
        </Box>
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography sx={{ fontSize: '0.75rem', color: 'var(--text2)' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>{value}</Typography>
    </Box>
  );
}

function getContextLimit(model: ModelData): number {
  if (model.price === 'Free') return 128000;
  if (model.id.includes('gpt-4.1') || model.id.includes('gpt-5')) return 1000000;
  if (model.id.includes('gemini')) return 1000000;
  if (model.id.includes('llama-4')) return 10000000;
  if (model.id.includes('claude')) return 200000;
  return 128000;
}

function estimateCost(model: ModelData | null, tokens: number): string {
  if (!model || model.price === 'Free') return '0.00';
  const costPerMillion = model.priceStart;
  const cost = (costPerMillion * tokens) / 1000000;
  return cost < 0.01 ? cost.toFixed(4) : cost.toFixed(2);
}
