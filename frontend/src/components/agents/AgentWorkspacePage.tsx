'use client';

import { useParams } from 'next/navigation';
import { Box, Button, Chip, Container, Paper, Typography } from '@mui/material';
import { Edit, MonitorHeart, Settings } from '@mui/icons-material';
import {
  agentTemplates,
  detailConversation,
  myAgents,
  sampleChips,
} from './agentStudioData';
import {
  BackPill,
  InfoAction,
  SideInfoCard,
  StatCard,
  TopAction,
  pageShellSx,
  sectionCardSx,
} from './AgentStudioShared';

export default function AgentWorkspacePage() {
  const params = useParams<{ agentId: string }>();
  const agentId = Array.isArray(params?.agentId) ? params.agentId[0] : params?.agentId;
  const fallback = agentTemplates[1];
  const agent = [...myAgents, ...agentTemplates].find((item) => item.id === agentId) ?? fallback;

  return (
    <Box sx={pageShellSx}>
      <Container maxWidth={false} sx={{ maxWidth: '1480px', pt: 3 }}>
        <Paper elevation={0} sx={{ ...sectionCardSx, overflow: 'hidden' }}>
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderBottom: '1px solid rgba(108,74,42,0.08)', display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <BackPill href="/agents" label="Agents" />
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '12px',
                  bgcolor: '#B96836',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                {agent.name.slice(0, 1)}
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#231D17' }}>{agent.name}</Typography>
                  <Chip label="Live" size="small" sx={{ bgcolor: '#EAF8F2', color: '#47735D', fontWeight: 700 }} />
                </Box>
                <Typography sx={{ fontSize: '0.86rem', color: '#7A6D61' }}>
                  Tools: {agent.tools?.join(', ') || 'No tools'} • Memory: {agent.memory || 'No memory'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <TopAction label="Settings" icon={<Settings sx={{ fontSize: 18 }} />} />
              <TopAction label="Monitor" icon={<MonitorHeart sx={{ fontSize: 18 }} />} />
              <TopAction label="Edit Agent" icon={<Edit sx={{ fontSize: 18 }} />} href="/agents/create" />
            </Box>
          </Box>

          <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, borderBottom: '1px solid rgba(108,74,42,0.08)', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {sampleChips.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                sx={{ bgcolor: '#F5F2EE', color: '#5E5349', border: '1px solid rgba(108,74,42,0.10)' }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 300px' }, minHeight: '74vh' }}>
            <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#F8F5F0', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', maxWidth: 760 }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '12px',
                      bgcolor: '#B96836',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {agent.name.slice(0, 1)}
                  </Box>
                  <Paper elevation={0} sx={{ ...sectionCardSx, p: 2, flex: 1 }}>
                    {detailConversation.map((line) => (
                      <Typography key={line} sx={{ color: '#40372F', fontSize: '0.95rem', lineHeight: 1.7, mb: 1 }}>
                        {line}
                      </Typography>
                    ))}
                  </Paper>
                </Box>
              </Box>

              <Paper elevation={0} sx={{ ...sectionCardSx, p: 1.5 }}>
                <textarea
                  rows={2}
                  placeholder="Describe your project, ask a question, or just say hi. I'm here to help..."
                  style={{
                    width: '100%',
                    border: 'none',
                    resize: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: '#2A241D',
                    padding: '4px 0 12px 0',
                    boxSizing: 'border-box',
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', borderTop: '1px solid rgba(108,74,42,0.08)', pt: 1.25 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="Voice" size="small" sx={{ bgcolor: '#F4ECFF', color: '#7C3AED' }} />
                    <Chip label="Video" size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB' }} />
                    <Chip label="Share" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669' }} />
                  </Box>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      minWidth: 46,
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      bgcolor: '#B96836',
                    }}
                  >
                    →
                  </Button>
                </Box>
              </Paper>
            </Box>

            <Box sx={{ p: 2, borderLeft: { xl: '1px solid rgba(108,74,42,0.08)' }, bgcolor: '#FFFDFC' }}>
              <SideInfoCard title="Agent Info">
                <InfoRow label="Status" value={agent.status || 'Draft'} accent />
                <InfoRow label="Memory" value={agent.memory || 'No memory'} />
                <Box sx={{ mt: 1.5 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#9A8F84', mb: 0.75 }}>Tools Connected</Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {(agent.tools || []).map((tool) => (
                      <Chip key={tool} label={tool} size="small" sx={{ bgcolor: '#FFF1E8', color: '#B96836' }} />
                    ))}
                  </Box>
                </Box>
              </SideInfoCard>

              <Box sx={{ my: 1.5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#A2978B', letterSpacing: '0.08em', mb: 1 }}>
                  LIVE METRICS
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
                  <StatCard label="Messages" value="0" />
                  <StatCard label="Avg latency" value="-" />
                  <StatCard label="Tokens used" value="0" />
                </Box>
              </Box>

              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#A2978B', letterSpacing: '0.08em', mb: 1 }}>
                ACTIONS
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InfoAction label="Edit configuration" />
                <InfoAction label="Copy dashboard URL" />
                <InfoAction label="View dashboard" />
                <InfoAction label="Back to Agents" />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

function InfoRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <Box sx={{ mb: 1.25 }}>
      <Typography sx={{ fontSize: '0.78rem', color: '#9A8F84' }}>{label}</Typography>
      <Typography sx={{ fontWeight: 700, color: accent ? '#47735D' : '#2F2821' }}>{value}</Typography>
    </Box>
  );
}
