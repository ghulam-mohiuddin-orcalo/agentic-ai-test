'use client';

import { CSSProperties, ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, Button, Chip, Container, Paper, Typography } from '@mui/material';
import { Add, CheckCircle, ChevronRight, PlayArrow } from '@mui/icons-material';
import {
  audienceTypes,
  builderSteps,
  deploymentChannels,
  metrics,
  purposeTypes,
  starterIdeas,
  starterSystemPrompt,
  testScenarios,
  toneOptions,
  toolsCatalog,
} from './agentStudioData';
import { pageShellSx, sectionCardSx } from './AgentStudioShared';

type MemoryMode = 'no-memory' | 'short-term' | 'long-term';

const inputStyle: CSSProperties = {
  width: '100%',
  borderRadius: '16px',
  border: '1px solid rgba(108,74,42,0.12)',
  background: '#FFFDFC',
  padding: '14px 16px',
  fontSize: '14px',
  color: '#2A241D',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function AgentBuilderPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [agentName, setAgentName] = useState('Support Bot');
  const [agentType, setAgentType] = useState('Customer Support');
  const [agentJob, setAgentJob] = useState("Answer customer questions, handle returns, and create support tickets for issues we can't resolve.");
  const [audience, setAudience] = useState<string[]>(['Customers']);
  const [tone, setTone] = useState<string[]>(['Professional', 'Friendly']);
  const [systemPrompt, setSystemPrompt] = useState(starterSystemPrompt);
  const [connectedTools, setConnectedTools] = useState<string[]>(['web-search']);
  const [memoryMode, setMemoryMode] = useState<MemoryMode>('short-term');
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(testScenarios.slice(0, 3));
  const [customScenario, setCustomScenario] = useState('');
  const [isDeployed, setIsDeployed] = useState(false);

  const activeStep = builderSteps[stepIndex];

  const generatedPrompt = useMemo(() => {
    return `You are ${agentName || 'an AI agent'}, a ${agentType.toLowerCase()} specialist.

Primary job:
${agentJob}

Audience:
${audience.join(', ') || 'General users'}

Tone:
${tone.join(', ') || 'Helpful'}

Use connected tools when they improve accuracy. Escalate policy, billing, and security issues to a human agent.`;
  }, [agentJob, agentName, agentType, audience, tone]);

  const toggleValue = (value: string, items: string[], setItems: (next: string[]) => void) => {
    setItems(items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
  };

  const nextStep = () => setStepIndex((value) => Math.min(builderSteps.length - 1, value + 1));
  const previousStep = () => setStepIndex((value) => Math.max(0, value - 1));

  return (
    <Box sx={pageShellSx}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Paper elevation={0} sx={{ ...sectionCardSx, maxWidth: 960, mx: 'auto', overflow: 'hidden' }}>
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5, borderBottom: '1px solid rgba(108,74,42,0.08)' }}>
            <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: '#231D17' }}>
              {stepIndex === 0 && "Define your agent's purpose"}
              {stepIndex === 1 && 'Write the system prompt'}
              {stepIndex === 2 && 'Connect tools & APIs'}
              {stepIndex === 3 && 'Set up memory'}
              {stepIndex === 4 && 'Test & iterate'}
              {stepIndex === 5 && 'Deploy & monitor'}
            </Typography>
            <Typography sx={{ color: '#8A7E72', fontSize: '0.9rem' }}>{activeStep.stepLabel}</Typography>
          </Box>

          <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, borderBottom: '1px solid rgba(108,74,42,0.08)', display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
            {builderSteps.map((step, index) => (
              <Chip
                key={step.id}
                label={`${index + 1} ${step.title}`}
                sx={{
                  bgcolor: index === stepIndex ? '#FFF1E8' : index < stepIndex ? '#F5EEE8' : '#F5F2EE',
                  color: index <= stepIndex ? '#B96836' : '#9A8F84',
                  fontWeight: 700,
                }}
              />
            ))}
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#FBF7F3' }}>
            {stepIndex === 0 && (
              <Box>
                <Typography sx={{ color: '#B96836', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', mb: 1.25 }}>
                  STEP 1 OF 6
                </Typography>
                <Typography sx={{ color: '#76695E', mb: 2.5 }}>
                  Answer a few quick questions and we will use your answers to build the perfect agent.
                </Typography>

                <BuilderField label="What do you want to call your agent?">
                  <input
                    value={agentName}
                    onChange={(event) => setAgentName(event.target.value)}
                    placeholder="e.g. Support Bot, Research Assistant, Code Reviewer..."
                    style={inputStyle}
                  />
                </BuilderField>

                <BuilderField label="What kind of agent is this?">
                  <TagPicker items={purposeTypes} selected={[agentType]} onToggle={(value) => setAgentType(value)} />
                </BuilderField>

                <BuilderField label="What's the main job? (in plain English)">
                  <textarea
                    value={agentJob}
                    onChange={(event) => setAgentJob(event.target.value)}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5, minHeight: 110 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.25 }}>
                    {starterIdeas.map((idea) => (
                      <Chip
                        key={idea}
                        label={idea}
                        onClick={() => setAgentJob(idea)}
                        sx={{ bgcolor: '#FFF1E8', color: '#B96836', cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </BuilderField>

                <BuilderField label="Who will be talking to this agent?">
                  <TagPicker items={audienceTypes} selected={audience} onToggle={(value) => toggleValue(value, audience, setAudience)} />
                </BuilderField>

                <BuilderField label="How should the agent sound?">
                  <TagPicker items={toneOptions} selected={tone} onToggle={(value) => toggleValue(value, tone, setTone)} />
                </BuilderField>
              </Box>
            )}

            {stepIndex === 1 && (
              <Box>
                <Typography sx={{ color: '#B96836', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', mb: 1.25 }}>
                  STEP 2 OF 6
                </Typography>
                <Typography sx={{ color: '#76695E', mb: 2.5 }}>
                  The system prompt defines the agent&apos;s persona, scope, and behaviour. Be explicit about what it should and should not do.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: '#2A241D' }}>System Prompt</Typography>
                  <Button
                    onClick={() => setSystemPrompt(generatedPrompt)}
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      borderRadius: '999px',
                      borderColor: 'rgba(185,104,54,0.2)',
                      color: '#B96836',
                      fontWeight: 700,
                    }}
                  >
                    Regenerate from answers
                  </Button>
                </Box>

                <Paper elevation={0} sx={{ p: 1.25, borderRadius: '14px', bgcolor: '#ECFBF1', color: '#47735D', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.82rem' }}>
                    Auto-generated from your Step 1 answers. Edit freely below.
                  </Typography>
                </Paper>

                <textarea
                  value={systemPrompt}
                  onChange={(event) => setSystemPrompt(event.target.value)}
                  rows={13}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    fontFamily: 'monospace',
                    lineHeight: 1.7,
                    minHeight: 300,
                  }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5, mt: 2 }}>
                  <InfoChecklist
                    title="Include"
                    items={['Agent persona & role', 'Scope (what it handles)', 'Tone & response length', 'Escalation rules', 'What it must never do']}
                    bg="#F5FBF6"
                    color="#2E7D4E"
                  />
                  <InfoChecklist
                    title="Avoid"
                    items={['Vague instructions', 'Contradictory rules', 'Unnecessary jargon', 'Overly long prompts', 'Missing edge cases']}
                    bg="#FFF8F3"
                    color="#B96836"
                  />
                </Box>
              </Box>
            )}

            {stepIndex === 2 && (
              <Box>
                <Typography sx={{ color: '#B96836', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', mb: 1.25 }}>
                  STEP 3 OF 6
                </Typography>
                <Typography sx={{ color: '#76695E', mb: 2.5 }}>
                  Equip your agent with tools like web search, database lookup, email sender, calendar API, or custom functions.
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {['All', 'Connected', 'Available', 'Suggested'].map((tab, index) => (
                    <Chip
                      key={tab}
                      label={tab}
                      sx={{
                        bgcolor: index === 0 ? '#B96836' : '#FFFDFC',
                        color: index === 0 ? '#fff' : '#5E5349',
                        border: index === 0 ? 'none' : '1px solid rgba(108,74,42,0.10)',
                        fontWeight: 700,
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                  {toolsCatalog.map((tool) => {
                    const active = connectedTools.includes(tool.id);
                    return (
                      <Paper
                        key={tool.id}
                        elevation={0}
                        onClick={() => toggleValue(tool.id, connectedTools, setConnectedTools)}
                        sx={{
                          p: 2,
                          borderRadius: '16px',
                          border: '1px solid',
                          borderColor: active ? '#B96836' : 'rgba(108,74,42,0.10)',
                          bgcolor: active ? '#FFF4EB' : '#FFFDFC',
                          cursor: 'pointer',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                          <Box>
                            <Typography sx={{ fontWeight: 800, color: '#231D17', mb: 0.5 }}>{tool.name}</Typography>
                            <Typography sx={{ fontSize: '0.84rem', color: '#76695E', lineHeight: 1.5 }}>
                              {tool.description}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: '5px',
                              border: '1px solid rgba(108,74,42,0.18)',
                              bgcolor: active ? '#B96836' : '#fff',
                              mt: 0.5,
                              flexShrink: 0,
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: '0.78rem', color: '#B96836', mt: 1.5 }}>How to configure</Typography>
                      </Paper>
                    );
                  })}
                </Box>

                <Button
                  startIcon={<Add />}
                  variant="outlined"
                  sx={{
                    mt: 1.5,
                    textTransform: 'none',
                    borderRadius: '14px',
                    borderStyle: 'dashed',
                    borderColor: 'rgba(108,74,42,0.18)',
                    color: '#5E5349',
                  }}
                >
                  Add more tools
                </Button>

                <Paper elevation={0} sx={{ mt: 2, p: 2, borderRadius: '16px', bgcolor: '#EEF3FF', color: '#445CB4' }}>
                  <Typography sx={{ fontSize: '0.84rem', lineHeight: 1.5 }}>
                    GPT-5.4, Claude Opus 4.6, and Grok-4 all support function calling. Define tools in JSON schema and the model can invoke them automatically when needed.
                  </Typography>
                </Paper>
              </Box>
            )}

            {stepIndex === 3 && (
              <Box>
                <Typography sx={{ color: '#B96836', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', mb: 1.25 }}>
                  STEP 4 OF 6
                </Typography>
                <Typography sx={{ color: '#76695E', mb: 2.5 }}>
                  Configure short-term conversation history and optional long-term memory so the agent can remember useful user context.
                </Typography>

                <MemoryCard
                  title="No Memory"
                  description="Stateless. Each conversation starts fresh. Best for simple Q&A agents."
                  selected={memoryMode === 'no-memory'}
                  onClick={() => setMemoryMode('no-memory')}
                />
                <MemoryCard
                  title="Short-term Only"
                  description="Maintains conversation history within a session and forgets after the session ends."
                  selected={memoryMode === 'short-term'}
                  onClick={() => setMemoryMode('short-term')}
                />
                <MemoryCard
                  title="Short + Long-term"
                  description="Persists key facts, preferences, and user data to a vector store across all sessions."
                  selected={memoryMode === 'long-term'}
                  onClick={() => setMemoryMode('long-term')}
                />

                <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: '#FFF7E6', mt: 2 }}>
                  <Typography sx={{ fontSize: '0.84rem', color: '#8C6A2A', lineHeight: 1.5 }}>
                    Pro tip: Long-term memory should store preferences, summaries, and resolved issues, not raw conversation logs.
                  </Typography>
                </Paper>
              </Box>
            )}

            {stepIndex === 4 && (
              <Box>
                <Typography sx={{ color: '#B96836', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', mb: 1.25 }}>
                  STEP 5 OF 6
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {testScenarios.map((scenario, index) => {
                    const active = selectedScenarios.includes(scenario);
                    return (
                      <Paper
                        key={scenario}
                        elevation={0}
                        onClick={() => toggleValue(scenario, selectedScenarios, setSelectedScenarios)}
                        sx={{
                          p: 1.5,
                          borderRadius: '14px',
                          border: '1px solid rgba(108,74,42,0.10)',
                          bgcolor: active ? '#FFF4EB' : '#FFFDFC',
                          cursor: 'pointer',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                          <Typography sx={{ color: '#4D433A', fontSize: '0.9rem' }}>{scenario}</Typography>
                          <Typography sx={{ color: '#A09388', fontSize: '0.75rem' }}>{`Scenario ${index + 1}`}</Typography>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>

                <Typography sx={{ fontWeight: 800, color: '#9B8E82', textAlign: 'center', my: 2, fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                  MANUAL SCENARIOS
                </Typography>

                <Typography sx={{ fontWeight: 700, color: '#2A241D', mb: 1 }}>Add your own test scenarios</Typography>
                <textarea
                  value={customScenario}
                  onChange={(event) => setCustomScenario(event.target.value)}
                  placeholder="e.g. User asks in a language the agent wasn't trained for..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 92 }}
                />
                <Button
                  startIcon={<Add />}
                  sx={{
                    mt: 1,
                    textTransform: 'none',
                    borderRadius: '999px',
                    bgcolor: '#B96836',
                    color: '#fff',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#A45C30' },
                  }}
                  onClick={() => {
                    const value = customScenario.trim();
                    if (value) {
                      setSelectedScenarios((items) => [...items, value]);
                      setCustomScenario('');
                    }
                  }}
                >
                  Add scenario
                </Button>

                <Paper elevation={0} sx={{ mt: 2, p: 2, borderRadius: '16px', bgcolor: '#EAF8F2' }}>
                  <Typography sx={{ fontSize: '0.84rem', color: '#47735D', lineHeight: 1.5 }}>
                    Agent Playground: use the NexusAI playground to run test conversations, inspect tool calls, and debug failures before deployment. Aim for at least 90% pass rate.
                  </Typography>
                </Paper>

                <Button
                  startIcon={<PlayArrow />}
                  variant="outlined"
                  sx={{
                    mt: 1.5,
                    width: '100%',
                    textTransform: 'none',
                    borderRadius: '14px',
                    borderColor: 'rgba(185,104,54,0.18)',
                    color: '#B96836',
                    fontWeight: 700,
                  }}
                >
                  Open Playground
                </Button>
              </Box>
            )}

            {stepIndex === 5 && (
              <Box>
                <Typography sx={{ color: '#B96836', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', mb: 1.25 }}>
                  STEP 6 OF 6
                </Typography>
                <Typography sx={{ color: '#76695E', mb: 2.5 }}>
                  Choose how to launch your agent and monitor its quality, latency, and usage after deployment.
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                  {deploymentChannels.map((channel) => (
                    <Paper key={channel.title} elevation={0} sx={{ ...sectionCardSx, p: 2 }}>
                      <Typography sx={{ fontWeight: 800, color: '#231D17', mb: 0.5 }}>{channel.title}</Typography>
                      <Typography sx={{ fontSize: '0.84rem', color: '#77695E', lineHeight: 1.5, mb: 1.25 }}>
                        {channel.description}
                      </Typography>
                      <Chip label={channel.badge} size="small" sx={{ bgcolor: '#FFF1E8', color: '#B96836' }} />
                    </Paper>
                  ))}
                </Box>

                <Paper elevation={0} sx={{ ...sectionCardSx, p: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: 800, color: '#2A241D', mb: 1.25 }}>Dashboard Metrics</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.25 }}>
                    {metrics.map((metric) => (
                      <Paper key={metric.label} elevation={0} sx={{ p: 1.5, borderRadius: '14px', bgcolor: '#FFFDFC', textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 800, color: '#221B15', fontSize: '1.2rem' }}>{metric.value}</Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#7B6F64' }}>{metric.label}</Typography>
                      </Paper>
                    ))}
                  </Box>
                </Paper>

                <Paper elevation={0} sx={{ p: 3, mt: 2, borderRadius: '20px', bgcolor: '#FFF5EE', textAlign: 'center' }}>
                  <CheckCircle sx={{ color: '#B96836', fontSize: 28, mb: 1 }} />
                  <Typography sx={{ fontWeight: 800, color: '#231D17', fontSize: '1.3rem', mb: 0.5 }}>
                    Your agent is ready to deploy!
                  </Typography>
                  <Typography sx={{ color: '#7B6F64', fontSize: '0.88rem', mb: 2 }}>
                    Review your configuration in the summary and click deploy to go live.
                  </Typography>
                  <Button
                    onClick={() => setIsDeployed(true)}
                    variant="contained"
                    disableElevation
                    sx={{
                      textTransform: 'none',
                      borderRadius: '999px',
                      bgcolor: '#B96836',
                      fontWeight: 700,
                      px: 3,
                    }}
                  >
                    Deploy Agent
                  </Button>
                  {isDeployed && (
                    <Typography sx={{ mt: 1.5, color: '#47735D', fontWeight: 700 }}>
                      Agent deployed. Open the live workspace next.
                    </Typography>
                  )}
                </Paper>
              </Box>
            )}
          </Box>

          <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderTop: '1px solid rgba(108,74,42,0.08)', display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Button
              onClick={previousStep}
              disabled={stepIndex === 0}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: '999px',
                borderColor: 'rgba(108,74,42,0.14)',
                color: '#5E5349',
              }}
            >
              Back
            </Button>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', gap: 0.65 }}>
                {builderSteps.map((step, index) => (
                  <Box
                    key={step.id}
                    sx={{
                      width: index === stepIndex ? 22 : 8,
                      height: 8,
                      borderRadius: '999px',
                      bgcolor: index === stepIndex ? '#B96836' : '#D9CEC3',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </Box>
              {stepIndex < builderSteps.length - 1 ? (
                <Button
                  onClick={nextStep}
                  variant="contained"
                  disableElevation
                  sx={{
                    textTransform: 'none',
                    borderRadius: '999px',
                    bgcolor: '#B96836',
                    fontWeight: 700,
                    px: 2.5,
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  component={Link}
                  href="/agents/customer-support-agent"
                  variant="contained"
                  disableElevation
                  endIcon={<ChevronRight />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '999px',
                    bgcolor: '#B96836',
                    fontWeight: 700,
                    px: 2.5,
                  }}
                >
                  Finish
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

function BuilderField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography sx={{ fontWeight: 700, color: '#2A241D', mb: 1 }}>{label}</Typography>
      {children}
    </Box>
  );
}

function TagPicker({
  items,
  selected,
  onToggle,
}: {
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <Chip
            key={item}
            label={item}
            onClick={() => onToggle(item)}
            sx={{
              cursor: 'pointer',
              bgcolor: active ? '#FFF1E8' : '#FFFDFC',
              border: '1px solid',
              borderColor: active ? '#E7B28E' : 'rgba(108,74,42,0.12)',
              color: active ? '#B96836' : '#5E5349',
              fontWeight: active ? 700 : 500,
            }}
          />
        );
      })}
    </Box>
  );
}

function InfoChecklist({
  title,
  items,
  bg,
  color,
}: {
  title: string;
  items: string[];
  bg: string;
  color: string;
}) {
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', bgcolor: bg }}>
      <Typography sx={{ fontWeight: 800, color, mb: 1 }}>{title}</Typography>
      {items.map((item) => (
        <Typography key={item} sx={{ color: '#62574D', fontSize: '0.84rem', py: 0.35 }}>
          • {item}
        </Typography>
      ))}
    </Paper>
  );
}

function MemoryCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2,
        mb: 1.25,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: selected ? '#B96836' : 'rgba(108,74,42,0.10)',
        bgcolor: selected ? '#FFF4EB' : '#FFFDFC',
        cursor: 'pointer',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '1px solid rgba(108,74,42,0.22)',
            bgcolor: selected ? '#B96836' : '#fff',
            mt: 0.2,
          }}
        />
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#2A241D' }}>{title}</Typography>
          <Typography sx={{ fontSize: '0.84rem', color: '#78695E', lineHeight: 1.5 }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
