'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Box, Button, Chip, Container, Paper, Typography } from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';
import { agentTemplates, checklistItems, myAgents } from './agentStudioData';
import { AgentsSidebar, ChecklistPanel, TemplatesRow, pageShellSx, sectionCardSx } from './AgentStudioShared';

const libraryAgents = agentTemplates;

export default function AgentsLibraryPage() {
  const [selectedMyAgent, setSelectedMyAgent] = useState<string>(myAgents[0]?.id ?? '');

  return (
    <Box sx={pageShellSx}>
      <Container maxWidth={false} sx={{ maxWidth: '1480px', pt: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Left sidebar */}
          <Box sx={{ width: { xs: '100%', lg: 260 }, flexShrink: 0 }}>
            <AgentsSidebar />
            <ChecklistPanel items={checklistItems} />
          </Box>

          {/* Main panel: My Agents left + Agent Library right */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={0} sx={{ ...sectionCardSx, overflow: 'hidden', mb: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, minHeight: 520 }}>
                {/* My Agents panel */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRight: { md: '1px solid rgba(108,74,42,0.08)' },
                    borderBottom: { xs: '1px solid rgba(108,74,42,0.08)', md: 'none' },
                  }}
                >
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '10px',
                          bgcolor: '#B96836',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Add sx={{ fontSize: 18 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 800, color: '#231D17', fontSize: '1rem' }}>My Agents</Typography>
                    </Box>
                    <Button
                      component={Link}
                      href="/agents"
                      startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
                      size="small"
                      sx={{ textTransform: 'none', color: '#9A8F84', minWidth: 0, p: 0.5 }}
                    />
                  </Box>

                  {/* Agent list */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {myAgents.map((agent) => {
                      const active = agent.id === selectedMyAgent;
                      return (
                        <Paper
                          key={agent.id}
                          component={Link}
                          href={`/agents/${agent.id}`}
                          elevation={0}
                          onClick={() => setSelectedMyAgent(agent.id)}
                          sx={{
                            p: 1.5,
                            borderRadius: '14px',
                            border: '1px solid',
                            borderColor: active ? '#D4956A' : 'rgba(108,74,42,0.10)',
                            textDecoration: 'none',
                            color: 'inherit',
                            bgcolor: active ? '#FFF4EB' : '#FBF7F3',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            '&:hover': { bgcolor: '#FFF4EB', borderColor: '#D4956A' },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '8px',
                                bgcolor: '#F8ECDD',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                                flexShrink: 0,
                              }}
                            >
                              {agent.emoji || '🤖'}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography noWrap sx={{ fontWeight: 700, color: '#231D17', fontSize: '0.9rem' }}>
                                {agent.name}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#8A7E72' }}>{agent.subtitle}</Typography>
                            </Box>
                            {/* Status dot */}
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: agent.status === 'Deployed & Live' ? '#47735D' : agent.status === 'Testing' ? '#B96836' : '#C0B8AF',
                                flexShrink: 0,
                              }}
                            />
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>

                  <Button
                    component={Link}
                    href="/agents/create"
                    fullWidth
                    variant="contained"
                    disableElevation
                    startIcon={<Add />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '999px',
                      bgcolor: '#B96836',
                      fontWeight: 700,
                      '&:hover': { bgcolor: '#A45C30' },
                    }}
                  >
                    Create Custom Agent
                  </Button>
                </Box>

                {/* Agent Library panel */}
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start', mb: 2.5 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.35rem', color: '#231D17' }}>Agent Library</Typography>
                      <Typography sx={{ fontSize: '0.88rem', color: '#7A6D61' }}>
                        Choose a default agent or build your own
                      </Typography>
                    </Box>
                    <Chip
                      label="Default Agents"
                      sx={{ bgcolor: '#1F1B18', color: '#fff', fontWeight: 700 }}
                    />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                    {libraryAgents.map((agent) => (
                      <Paper
                        key={agent.id}
                        component={Link}
                        href={`/agents/${agent.id}`}
                        elevation={0}
                        sx={{
                          ...sectionCardSx,
                          p: 2,
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'box-shadow 0.15s ease',
                          '&:hover': { boxShadow: '0 4px 20px rgba(108,74,42,0.14)' },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '10px',
                              bgcolor: '#F8ECDD',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1rem',
                              flexShrink: 0,
                            }}
                          >
                            {agent.emoji || '🤖'}
                          </Box>
                          <Typography sx={{ fontWeight: 800, color: '#231D17', lineHeight: 1.2, fontSize: '0.9rem' }}>
                            {agent.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.83rem', color: '#77695E', lineHeight: 1.5, mb: 1.5 }}>
                          {agent.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                          <Chip
                            label={agent.model}
                            size="small"
                            sx={{ bgcolor: '#EAF1FF', color: '#4561D6', fontSize: '0.72rem' }}
                          />
                          {agent.tags.slice(0, 2).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ bgcolor: '#FFF1E8', color: '#B96836', fontSize: '0.72rem' }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    ))}

                    {/* Build from Scratch card */}
                    <Paper
                      component={Link}
                      href="/agents/create"
                      elevation={0}
                      sx={{
                        ...sectionCardSx,
                        p: 2,
                        minHeight: 160,
                        textDecoration: 'none',
                        color: '#B96836',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 1,
                        borderStyle: 'dashed',
                        bgcolor: '#FFF7F2',
                        transition: 'background-color 0.15s ease',
                        '&:hover': { bgcolor: '#FFF1E8' },
                      }}
                    >
                      <Add sx={{ fontSize: 28 }} />
                      <Typography sx={{ fontWeight: 700 }}>Build from Scratch</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#8B7D72', textAlign: 'center' }}>
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
