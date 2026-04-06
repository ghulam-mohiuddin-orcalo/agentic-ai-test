'use client';

import Link from 'next/link';
import { Box, Chip, Container, Paper, Typography } from '@mui/material';
import {
  agentTemplates,
  checklistItems,
  quickUseCases,
  suggestedPrompts,
} from './agentStudioData';
import {
  AgentsSidebar,
  ChecklistPanel,
  HeroComposer,
  TemplatesRow,
  pageShellSx,
  sectionCardSx,
} from './AgentStudioShared';

export default function AgentsLandingPage() {
  return (
    <Box sx={pageShellSx}>
      <Container maxWidth={false} sx={{ maxWidth: '1480px', pt: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>
          <Box sx={{ width: { xs: '100%', lg: 260 } }}>
            <AgentsSidebar />
            <ChecklistPanel items={checklistItems} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <HeroComposer
              title={
                <>
                  Agent works <Box component="span" sx={{ color: '#B96836' }}>for you.</Box>
                </>
              }
              subtitle="Your AI agent takes care of everything, end to end."
              useCases={quickUseCases}
              prompts={suggestedPrompts}
            />

            <TemplatesRow title="Agent Templates" templates={agentTemplates.slice(0, 5)} />

            <Paper elevation={0} sx={{ ...sectionCardSx, p: 2.5, mt: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#231D17' }}>
                    Move into the full builder flow
                  </Typography>
                  <Typography sx={{ color: '#78695B', fontSize: '0.9rem' }}>
                    Open the guided 6-step experience for purpose, prompt, tools, memory, testing, and deployment.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['Purpose', 'Prompt', 'Tools', 'Memory', 'Test', 'Deploy'].map((step) => (
                    <Chip key={step} label={step} sx={{ bgcolor: '#FFF1E8', color: '#B96836' }} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, mt: 2 }}>
                <Paper
                  component={Link}
                  href="/agents/my-agents"
                  elevation={0}
                  sx={{
                    ...sectionCardSx,
                    p: 2,
                    textDecoration: 'none',
                    color: 'inherit',
                    bgcolor: '#FBF7F3',
                  }}
                >
                  <Typography sx={{ fontWeight: 800, mb: 0.5 }}>My Agents & library</Typography>
                  <Typography sx={{ fontSize: '0.88rem', color: '#78695B' }}>
                    Browse your saved agents, compare templates, and jump into a specific agent workspace.
                  </Typography>
                </Paper>
                <Paper
                  component={Link}
                  href="/agents/create"
                  elevation={0}
                  sx={{
                    ...sectionCardSx,
                    p: 2,
                    textDecoration: 'none',
                    color: 'inherit',
                    bgcolor: '#FFF7F2',
                  }}
                >
                  <Typography sx={{ fontWeight: 800, mb: 0.5 }}>Create custom agent</Typography>
                  <Typography sx={{ fontSize: '0.88rem', color: '#78695B' }}>
                    Build a full custom agent with the exact wizard flow shown in your reference screenshots.
                  </Typography>
                </Paper>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
