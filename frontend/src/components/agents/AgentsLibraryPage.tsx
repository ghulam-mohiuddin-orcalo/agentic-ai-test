'use client';

import Link from 'next/link';
import { Box, Button, Chip, Container, Paper, Typography } from '@mui/material';
import { Add, Close, Search } from '@mui/icons-material';
import { agentTemplates, checklistItems, myAgents } from './agentStudioData';
import { AgentsSidebar, ChecklistPanel, TemplatesRow, pageShellSx, sectionCardSx } from './AgentStudioShared';

export default function AgentsLibraryPage() {
  return (
    <Box sx={pageShellSx}>
      <Container maxWidth={false} sx={{ maxWidth: '1480px', pt: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>
          <Box sx={{ width: { xs: '100%', lg: 260 } }}>
            <AgentsSidebar />
            <ChecklistPanel items={checklistItems} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={0} sx={{ ...sectionCardSx, overflow: 'hidden' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '320px 1fr' } }}>
                <Box sx={{ p: 2.5, borderRight: { md: '1px solid rgba(108,74,42,0.08)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
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
                        }}
                      >
                        <Add sx={{ fontSize: 18 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 800, color: '#231D17' }}>My Agents</Typography>
                    </Box>
                    <Close sx={{ color: '#9A8F84', fontSize: 20 }} />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    {myAgents.map((agent) => (
                      <Paper
                        key={agent.id}
                        component={Link}
                        href={`/agents/${agent.id}`}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: '16px',
                          border: '1px solid rgba(108,74,42,0.10)',
                          textDecoration: 'none',
                          color: 'inherit',
                          bgcolor: agent.id === 'research-agent' ? '#FFF4EB' : '#FBF7F3',
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, color: '#231D17' }}>{agent.name}</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#8A7E72' }}>{agent.subtitle}</Typography>
                      </Paper>
                    ))}
                  </Box>

                  <Button
                    component={Link}
                    href="/agents/create"
                    fullWidth
                    variant="contained"
                    disableElevation
                    startIcon={<Add />}
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      borderRadius: '999px',
                      bgcolor: '#B96836',
                      fontWeight: 700,
                    }}
                  >
                    Create Custom Agent
                  </Button>
                </Box>

                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#231D17' }}>Agent Library</Typography>
                      <Typography sx={{ fontSize: '0.88rem', color: '#7A6D61' }}>
                        Choose a default agent or build your own
                      </Typography>
                    </Box>
                    <Chip label="Default Agents" sx={{ bgcolor: '#1F1B18', color: '#fff', fontWeight: 700 }} />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(4, 1fr)' }, gap: 1.5 }}>
                    {agentTemplates.map((agent) => (
                      <Paper
                        key={agent.id}
                        component={Link}
                        href={`/agents/${agent.id}`}
                        elevation={0}
                        sx={{ ...sectionCardSx, p: 2, textDecoration: 'none', color: 'inherit' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: '10px',
                              bgcolor: '#F8ECDD',
                              color: '#B96836',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Search sx={{ fontSize: 16 }} />
                          </Box>
                          <Typography sx={{ fontWeight: 800, color: '#231D17', lineHeight: 1.2 }}>{agent.name}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.84rem', color: '#77695E', lineHeight: 1.5, mb: 1.5 }}>
                          {agent.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                          <Chip label={agent.model} size="small" sx={{ bgcolor: '#EAF1FF', color: '#4561D6' }} />
                          {agent.tags.slice(0, 2).map((tag) => (
                            <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#FFF1E8', color: '#B96836' }} />
                          ))}
                        </Box>
                      </Paper>
                    ))}

                    <Paper
                      component={Link}
                      href="/agents/create"
                      elevation={0}
                      sx={{
                        ...sectionCardSx,
                        p: 2,
                        minHeight: 180,
                        textDecoration: 'none',
                        color: '#B96836',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        borderStyle: 'dashed',
                        bgcolor: '#FFF7F2',
                      }}
                    >
                      <Add />
                      <Typography sx={{ fontWeight: 700, mt: 1 }}>Build from Scratch</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#8B7D72', mt: 0.5 }}>
                        Create a fully custom agent
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <TemplatesRow title="Agent Templates" templates={agentTemplates.slice(0, 5)} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
