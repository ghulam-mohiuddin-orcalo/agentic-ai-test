'use client';

import { useState } from 'react';
import { Box, Typography, Button, Chip, IconButton, Paper, TextField, InputAdornment } from '@mui/material';
import { Add, Search, Delete, MoreVert, Computer, RocketLaunch } from '@mui/icons-material';
import NewAgentModal from '@/components/agents/NewAgentModal';
import { useAuth } from '@/hooks/useAuth';

const AGENT_SUGGESTIONS = [
  { icon: '\uD83C\uDFA7', title: 'Customer Support Bot', desc: 'Auto-respond to tickets, route issues', color: '#2563EB', bg: '#EFF6FF' },
  { icon: '\uD83D\uDCBB', title: 'Code Review Agent', desc: 'Review PRs, find bugs, suggest fixes', color: '#7C3AED', bg: '#F3EEFF' },
  { icon: '\uD83D\uDCCA', title: 'Data Pipeline Agent', desc: 'ETL, transform, and analyze datasets', color: '#059669', bg: '#ECFDF5' },
  { icon: '\uD83D\uDCC5', title: 'Content Scheduler', desc: 'Plan and publish content automatically', color: '#D97706', bg: '#FFFBEB' },
  { icon: '\uD83D\uDD2C', title: 'Research Assistant', desc: 'Find papers, summarize findings', color: '#0891B2', bg: '#E0F7FA' },
  { icon: '\uD83D\uDCE7', title: 'Sales Outreach Agent', desc: 'Personalized outreach at scale', color: '#DC2626', bg: '#FEF2F2' },
];

// Mock agents for display
const MOCK_AGENTS = [
  { id: '1', name: 'Support Bot v2', description: 'Handles tier-1 customer inquiries', model: 'Claude Sonnet 4.6', status: 'deployed' as const },
  { id: '2', name: 'Code Reviewer', description: 'Reviews PRs on GitHub', model: 'GPT-5', status: 'testing' as const },
  { id: '3', name: 'Data Analyst', description: 'Weekly report generation', model: 'Gemini 3.1 Pro', status: 'draft' as const },
];

const STATUS_STYLES = {
  draft: { color: '#6B7280', bg: '#F3F4F6', label: 'Draft' },
  deployed: { color: '#059669', bg: '#ECFDF5', label: 'Deployed' },
  testing: { color: '#2563EB', bg: '#EFF6FF', label: 'Testing' },
};

export default function AgentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F2EE' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>

          {/* Left Panel - Agent Builder */}
          <Box sx={{ flex: '1 1 55%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.5rem' }}>
                  Your Agents
                </Typography>
                <Chip label={MOCK_AGENTS.length} size="small" sx={{ bgcolor: 'rgba(200,98,42,0.1)', color: '#C8622A', fontWeight: 600 }} />
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setModalOpen(true)}
                disableElevation
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '10px',
                  px: 2.5,
                }}
              >
                New Agent
              </Button>
            </Box>

            {/* Agent List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {MOCK_AGENTS.map((agent) => {
                const statusStyle = STATUS_STYLES[agent.status];
                return (
                  <Paper
                    key={agent.id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: '14px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'rgba(200,98,42,0.25)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{agent.name}</Typography>
                          <Chip
                            label={statusStyle.label}
                            size="small"
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 22,
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.5)', mb: 0.5 }}>
                          {agent.description}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)' }}>
                          Model: {agent.model}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small"><MoreVert sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton size="small" sx={{ color: '#DC2626' }}><Delete sx={{ fontSize: 18 }} /></IconButton>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>

            {MOCK_AGENTS.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '14px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}
              >
                <Computer sx={{ fontSize: 48, color: 'rgba(0,0,0,0.2)', mb: 1 }} />
                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>No agents yet</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', mb: 2 }}>
                  Create your first AI agent to automate tasks
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setModalOpen(true)} disableElevation sx={{ textTransform: 'none' }}>
                  Create Agent
                </Button>
              </Paper>
            )}
          </Box>

          {/* Right Panel - Agent Works for You */}
          <Box sx={{ flex: '1 1 45%' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <Computer sx={{ fontSize: 22, color: '#C8622A' }} />
                <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem' }}>
                  Agent works for you
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)' }}>
                Build, deploy, and manage AI agents
              </Typography>
            </Box>

            {/* Search */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search agent templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: 'rgba(0,0,0,0.3)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#fff',
                  fontSize: '0.85rem',
                },
              }}
            />

            {/* Suggestion Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
              {AGENT_SUGGESTIONS
                .filter(s => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((suggestion) => (
                <Paper
                  key={suggestion.title}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'rgba(200,98,42,0.25)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36, height: 36, borderRadius: '10px',
                      bgcolor: suggestion.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', mb: 1,
                    }}
                  >
                    {suggestion.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.25 }}>
                    {suggestion.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.45)', lineHeight: 1.4, mb: 1 }}>
                    {suggestion.desc}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<RocketLaunch sx={{ fontSize: 14 }} />}
                    onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#C8622A',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    Deploy
                  </Button>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <NewAgentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
}
