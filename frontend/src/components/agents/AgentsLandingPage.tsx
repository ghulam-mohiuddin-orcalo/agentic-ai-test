'use client';

import { Box, Container } from '@mui/material';
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
} from './AgentStudioShared';

export default function AgentsLandingPage() {
  return (
    <Box sx={pageShellSx}>
      <Container maxWidth={false} sx={{ maxWidth: '1480px', pt: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Left sidebar */}
          <Box sx={{ width: { xs: '100%', lg: 260 }, flexShrink: 0 }}>
            <AgentsSidebar />
            <ChecklistPanel items={checklistItems} />
          </Box>

          {/* Main area */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <HeroComposer
              title={
                <>
                  Agent works{' '}
                  <Box component="span" sx={{ fontStyle: 'italic', color: '#B96836' }}>
                    for you.
                  </Box>
                </>
              }
              subtitle="Your AI agent takes care of everything, end to end."
              useCases={quickUseCases}
              prompts={suggestedPrompts}
            />

            <TemplatesRow
              title="Agent Templates"
              templates={agentTemplates.slice(0, 5)}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
