'use client';

import { CSSProperties, ReactNode, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { Add, CheckCircle, Close, PlayArrow } from '@mui/icons-material';
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
import {
  AgentsSidebar,
  ChecklistPanel,
  HeroComposer,
  TemplatesRow,
  pageShellSx,
  sectionCardSx,
} from './AgentStudioShared';

import {
  agentTemplates,
  checklistItems,
  quickUseCases,
  suggestedPrompts,
} from './agentStudioData';

type MemoryMode = 'no-memory' | 'short-term' | 'long-term';

const inputStyle: CSSProperties = {
  width: '100%',
  borderRadius: '12px',
  border: '1px solid rgba(108,74,42,0.12)',
  background: '#FFFDFC',
  padding: '12px 14px',
  fontSize: '14px',
  color: '#2A241D',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

/** Tab navigation bar inside the modal */
const STEP_TABS = ['Purpose', 'System Prompt', 'Tools & APIs', 'Memory', 'Test', 'Deploy'];
const STEP_ICONS = ['🎯', '📝', '🔧', '🧠', '🧪', '🚀'];

export default function AgentBuilderPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true); // Modal is open by default when navigating to /agents/create

  const [stepIndex, setStepIndex] = useState(0);
  const [agentName, setAgentName] = useState('Support Bot');
  const [agentType, setAgentType] = useState('Customer Support');
  const [agentJob, setAgentJob] = useState(
    "Answer customer questions, handle returns, and create support tickets for issues we can't resolve."
  );
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
    return `You are ${agentName || 'an AI agent'}, a ${agentType.toLowerCase()} specialist.\n\nPrimary job:\n${agentJob}\n\nAudience:\n${audience.join(', ') || 'General users'}\n\nTone:\n${tone.join(', ') || 'Helpful'}\n\nUse connected tools when they improve accuracy. Escalate policy, billing, and security issues to a human agent.`;
  }, [agentJob, agentName, agentType, audience, tone]);

  const toggleValue = useCallback(
    (value: string, items: string[], setItems: (next: string[]) => void) => {
      setItems(items.includes(value) ? items.filter((i) => i !== value) : [...items, value]);
    },
    []
  );

  const nextStep = () => setStepIndex((v) => Math.min(builderSteps.length - 1, v + 1));
  const prevStep = () => setStepIndex((v) => Math.max(0, v - 1));

  const handleClose = () => {
    setOpen(false);
    router.push('/agents/my-agents');
  };

  const handleFinish = () => {
    router.push('/agents/customer-support-agent');
  };

  return (
    <>
      {/* Background page (blurred) */}
      <Box
        sx={{
          ...pageShellSx,
          filter: 'blur(4px)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: '1480px', pt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>
            <Box sx={{ width: { xs: '100%', lg: 260 }, flexShrink: 0 }}>
              <AgentsSidebar />
              <ChecklistPanel items={checklistItems} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <HeroComposer
                title={<>Agent works <Box component="span" sx={{ color: '#B96836' }}>for you.</Box></>}
                subtitle="Your AI agent takes care of everything, end to end."
                useCases={quickUseCases}
                prompts={suggestedPrompts}
              />
              <TemplatesRow title="Agent Templates" templates={agentTemplates.slice(0, 5)} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Builder Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxWidth: 680,
            m: 2,
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(30,20,10,0.22)',
          },
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            px: 3,
            pt: 2.5,
            pb: 0,
            bgcolor: '#FFFDFC',
            borderBottom: '1px solid rgba(108,74,42,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Step icon pill */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  bgcolor: '#7C5CE8',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}
              >
                {STEP_ICONS[stepIndex]}
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: '#231D17',
                    lineHeight: 1.2,
                  }}
                >
                  {stepIndex === 0 && "Define your agent's purpose"}
                  {stepIndex === 1 && 'Write the system prompt'}
                  {stepIndex === 2 && 'Connect tools & APIs'}
                  {stepIndex === 3 && 'Set up memory'}
                  {stepIndex === 4 && 'Test & iterate'}
                  {stepIndex === 5 && 'Deploy & monitor'}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#A2978B' }}>{activeStep.stepLabel}</Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} size="small" sx={{ color: '#9A8F84', mt: 0.5 }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Step tab bar */}
          <Box
            sx={{
              display: 'flex',
              gap: 0,
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {STEP_TABS.map((tab, index) => (
              <Box
                key={tab}
                onClick={() => setStepIndex(index)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.75,
                  py: 1,
                  cursor: 'pointer',
                  borderBottom: '2px solid',
                  borderColor: index === stepIndex ? '#B96836' : 'transparent',
                  color: index === stepIndex ? '#B96836' : index < stepIndex ? '#6B5C4E' : '#A2978B',
                  fontWeight: index === stepIndex ? 700 : 500,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    bgcolor: index < stepIndex ? '#B96836' : index === stepIndex ? '#FFF1E8' : '#EDE8E2',
                    color: index < stepIndex ? '#fff' : index === stepIndex ? '#B96836' : '#9A8F84',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                  }}
                >
                  {index < stepIndex ? '✓' : index + 1}
                </Box>
                {tab}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Modal Content */}
        <DialogContent sx={{ p: 0, bgcolor: '#FBF7F3' }}>
          <Box sx={{ p: 3 }}>
            {/* STEP 1: Purpose */}
            {stepIndex === 0 && (
              <Box>
                <StepLabel label="STEP 1 OF 6" />
                <Typography sx={{ color: '#76695E', mb: 2.5, lineHeight: 1.6 }}>
                  Answer a few quick questions — we&apos;ll use your answers to build the perfect agent.
                </Typography>

                <BuilderField label="🤖 What do you want to call your agent?">
                  <input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g. Support Bot, Research Assistant, Code Reviewer..."
                    style={inputStyle}
                  />
                </BuilderField>

                <BuilderField label="🤖 What kind of agent is this?">
                  <TagPicker
                    items={purposeTypes}
                    selected={[agentType]}
                    onToggle={(v) => setAgentType(v)}
                  />
                </BuilderField>

                <BuilderField label="🤖 What's the main job? (in plain English)">
                  <textarea
                    value={agentJob}
                    onChange={(e) => setAgentJob(e.target.value)}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, minHeight: 110 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.25 }}>
                    {starterIdeas.map((idea) => (
                      <Chip
                        key={idea}
                        label={idea}
                        onClick={() => setAgentJob(idea)}
                        size="small"
                        sx={{ bgcolor: '#FFF1E8', color: '#B96836', cursor: 'pointer', fontSize: '0.78rem' }}
                      />
                    ))}
                  </Box>
                </BuilderField>

                <BuilderField label="🤖 Who will be talking to this agent?">
                  <TagPicker
                    items={audienceTypes}
                    selected={audience}
                    onToggle={(v) => toggleValue(v, audience, setAudience)}
                  />
                </BuilderField>

                <BuilderField label="🤖 How should the agent sound?">
                  <TagPicker
                    items={toneOptions}
                    selected={tone}
                    onToggle={(v) => toggleValue(v, tone, setTone)}
                  />
                </BuilderField>
              </Box>
            )}

            {/* STEP 2: System Prompt */}
            {stepIndex === 1 && (
              <Box>
                <StepLabel label="STEP 2 OF 6" />
                <Typography sx={{ color: '#76695E', mb: 2.5, lineHeight: 1.6 }}>
                  The system prompt defines the agent&apos;s persona, scope, and behaviour. Be explicit about what it should and shouldn&apos;t do.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: '#2A241D' }}>System Prompt</Typography>
                  <Button
                    onClick={() => setSystemPrompt(generatedPrompt)}
                    size="small"
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      borderRadius: '999px',
                      borderColor: 'rgba(185,104,54,0.2)',
                      color: '#B96836',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    ↻ Regenerate from answers
                  </Button>
                </Box>

                <Paper elevation={0} sx={{ p: 1.25, borderRadius: '12px', bgcolor: '#ECFBF1', color: '#47735D', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.82rem' }}>
                    Auto-generated from your Step 1 answers — edit freely below.
                  </Typography>
                </Paper>

                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={12}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.7, minHeight: 260 }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mt: 2 }}>
                  <InfoChecklist
                    title="✅ Include"
                    items={['Agent persona & role', 'Scope (what it handles)', 'Tone & response length', 'Escalation rules', 'What it must never do']}
                    bg="#F5FBF6"
                    color="#2E7D4E"
                  />
                  <InfoChecklist
                    title="❌ Avoid"
                    items={['Vague instructions', 'Contradictory rules', 'Unnecessary jargon', 'Overly long prompts', 'Missing edge cases']}
                    bg="#FFF8F3"
                    color="#B96836"
                  />
                </Box>
              </Box>
            )}

            {/* STEP 3: Tools & APIs */}
            {stepIndex === 2 && (
              <Box>
                <StepLabel label="STEP 3 OF 6" />
                <Typography sx={{ color: '#76695E', mb: 2.5, lineHeight: 1.6 }}>
                  Equip your agent with tools: web search, database lookup, email sender, calendar API, Slack webhook. Click any tool to see configuration steps.
                </Typography>

                {/* Filter tabs */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['All', 'Connected', 'Available', 'Suggested'].map((tab, i) => (
                      <Chip
                        key={tab}
                        label={tab}
                        size="small"
                        sx={{
                          bgcolor: i === 0 ? '#B96836' : '#FFFDFC',
                          color: i === 0 ? '#fff' : '#5E5349',
                          border: i === 0 ? 'none' : '1px solid rgba(108,74,42,0.10)',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </Box>
                  <Chip label="All categories" size="small" sx={{ bgcolor: '#FFFDFC', border: '1px solid rgba(108,74,42,0.10)', color: '#5E5349' }} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.25 }}>
                  {toolsCatalog.map((tool) => {
                    const active = connectedTools.includes(tool.id);
                    return (
                      <Paper
                        key={tool.id}
                        elevation={0}
                        onClick={() => toggleValue(tool.id, connectedTools, setConnectedTools)}
                        sx={{
                          p: 1.75,
                          borderRadius: '14px',
                          border: '1px solid',
                          borderColor: active ? '#B96836' : 'rgba(108,74,42,0.10)',
                          bgcolor: active ? '#FFF4EB' : '#FFFDFC',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                              <Typography sx={{ fontSize: '1rem' }}>{tool.emoji}</Typography>
                              <Typography sx={{ fontWeight: 800, color: '#231D17', fontSize: '0.88rem' }}>
                                {tool.name}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.82rem', color: '#76695E', lineHeight: 1.5 }}>
                              {tool.description}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: '5px',
                              border: '1.5px solid',
                              borderColor: active ? '#B96836' : 'rgba(108,74,42,0.22)',
                              bgcolor: active ? '#B96836' : '#fff',
                              mt: 0.25,
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '0.65rem',
                            }}
                          >
                            {active && '✓'}
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#B96836', mt: 1.25, fontWeight: 600 }}>
                          How to configure ›
                        </Typography>
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
                    borderRadius: '12px',
                    borderStyle: 'dashed',
                    borderColor: 'rgba(108,74,42,0.18)',
                    color: '#5E5349',
                  }}
                >
                  Add more tools
                </Button>

                <Paper elevation={0} sx={{ mt: 2, p: 2, borderRadius: '14px', bgcolor: '#EEF3FF', color: '#445CB4' }}>
                  <Typography sx={{ fontSize: '0.83rem', lineHeight: 1.6 }}>
                    <strong>GPT-5.4, Claude Opus 4.6, Grok-4</strong> all support function calling — define tools in JSON schema and the model will invoke them automatically when needed.
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* STEP 4: Memory */}
            {stepIndex === 3 && (
              <Box>
                <StepLabel label="STEP 4 OF 6" />
                <Typography sx={{ color: '#76695E', mb: 2.5, lineHeight: 1.6 }}>
                  Configure short-term (conversation history) and long-term memory (vector store). Let the agent remember user preferences across sessions.
                </Typography>

                {[
                  {
                    id: 'no-memory' as MemoryMode,
                    icon: '🔘',
                    title: 'No Memory',
                    desc: 'Stateless — each conversation starts fresh. Best for simple Q&A agents.',
                  },
                  {
                    id: 'short-term' as MemoryMode,
                    icon: '🔹',
                    title: 'Short-term Only',
                    desc: 'Maintains conversation history within a session. Forgets after the session ends.',
                  },
                  {
                    id: 'long-term' as MemoryMode,
                    icon: '🧠',
                    title: 'Short + Long-term',
                    desc: 'Persists key facts, preferences, and user data to a vector store across all sessions.',
                  },
                ].map((option) => (
                  <MemoryCard
                    key={option.id}
                    icon={option.icon}
                    title={option.title}
                    description={option.desc}
                    selected={memoryMode === option.id}
                    onClick={() => setMemoryMode(option.id)}
                  />
                ))}

                <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', bgcolor: '#FFF7E6', mt: 1.5 }}>
                  <Typography sx={{ fontSize: '0.83rem', color: '#8C6A2A', lineHeight: 1.6 }}>
                    <strong>Pro tip:</strong> Long-term memory uses a vector store (Pinecone, Weaviate, or NexusAI-managed). Store user preferences, past resolutions, and context summaries — not raw conversation logs.
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* STEP 5: Test */}
            {stepIndex === 4 && (
              <Box>
                <StepLabel label="STEP 5 OF 6" />

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
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: active ? 'rgba(108,74,42,0.18)' : 'rgba(108,74,42,0.08)',
                          bgcolor: active ? '#FFF4EB' : '#FFFDFC',
                          cursor: 'pointer',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '4px',
                                border: '1.5px solid',
                                borderColor: active ? '#B96836' : 'rgba(108,74,42,0.22)',
                                bgcolor: active ? '#B96836' : '#fff',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '0.6rem',
                              }}
                            >
                              {active && '✓'}
                            </Box>
                            <Typography sx={{ color: '#4D433A', fontSize: '0.88rem' }}>{scenario}</Typography>
                          </Box>
                          <Typography sx={{ color: '#A09388', fontSize: '0.75rem', flexShrink: 0 }}>
                            Scenario {index + 1}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    color: '#9B8E82',
                    textAlign: 'center',
                    my: 2,
                    fontSize: '0.72rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  MANUAL SCENARIOS
                </Typography>

                <Typography sx={{ fontWeight: 700, color: '#2A241D', mb: 1, fontSize: '0.9rem' }}>
                  Add Your Own Test Scenarios
                </Typography>
                <Typography sx={{ color: '#76695E', fontSize: '0.82rem', mb: 1 }}>
                  Write a scenario description, then optionally add expected behaviour. Press Enter or click Add.
                </Typography>
                <textarea
                  value={customScenario}
                  onChange={(e) => setCustomScenario(e.target.value)}
                  placeholder="e.g. User asks in a language the agent wasn't trained for..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                />
                <Button
                  startIcon={<Add />}
                  onClick={() => {
                    const v = customScenario.trim();
                    if (v) {
                      setSelectedScenarios((prev) => [...prev, v]);
                      setCustomScenario('');
                    }
                  }}
                  sx={{
                    mt: 1,
                    textTransform: 'none',
                    borderRadius: '999px',
                    bgcolor: '#B96836',
                    color: '#fff',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#A45C30' },
                  }}
                >
                  Add scenario
                </Button>

                <Paper elevation={0} sx={{ mt: 2, p: 2, borderRadius: '14px', bgcolor: '#EAF8F2' }}>
                  <Typography sx={{ fontSize: '0.83rem', color: '#47735D', lineHeight: 1.6 }}>
                    <strong>Agent Playground:</strong> Use the NexusAI Playground to run test conversations, inspect tool calls, and debug failures before deployment. Aim for a 90% pass rate on your test suite.
                  </Typography>
                </Paper>

                <Button
                  startIcon={<PlayArrow />}
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 1.5,
                    textTransform: 'none',
                    borderRadius: '12px',
                    borderColor: 'rgba(185,104,54,0.18)',
                    color: '#B96836',
                    fontWeight: 700,
                    py: 1.25,
                  }}
                >
                  Open Playground
                </Button>
              </Box>
            )}

            {/* STEP 6: Deploy */}
            {stepIndex === 5 && (
              <Box>
                <StepLabel label="STEP 6 OF 6" />
                <Typography sx={{ color: '#76695E', mb: 2.5, lineHeight: 1.6 }}>
                  Choose how to launch your agent and monitor its quality, latency, token usage, and satisfaction scores.
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.25 }}>
                  {deploymentChannels.map((channel) => (
                    <Paper key={channel.id} elevation={0} sx={{ ...sectionCardSx, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                        <Typography sx={{ fontSize: '1.1rem' }}>{channel.emoji}</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#231D17', fontSize: '0.9rem' }}>{channel.title}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.83rem', color: '#77695E', lineHeight: 1.5, mb: 1.25 }}>
                        {channel.description}
                      </Typography>
                      <Chip label={channel.badge} size="small" sx={{ bgcolor: '#FFF1E8', color: '#B96836', fontSize: '0.75rem' }} />
                    </Paper>
                  ))}
                </Box>

                <Paper elevation={0} sx={{ ...sectionCardSx, p: 2, mt: 2 }}>
                  <Typography sx={{ fontWeight: 800, color: '#2A241D', mb: 1.5 }}>📊 Dashboard Metrics</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                    {metrics.map((metric) => (
                      <Paper
                        key={metric.label}
                        elevation={0}
                        sx={{ p: 1.25, borderRadius: '12px', bgcolor: '#FFFDFC', textAlign: 'center', border: '1px solid rgba(108,74,42,0.08)' }}
                      >
                        <Typography sx={{ fontWeight: 800, color: '#221B15', fontSize: '1.05rem' }}>{metric.value}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#7B6F64', mt: 0.25 }}>{metric.label}</Typography>
                      </Paper>
                    ))}
                  </Box>
                </Paper>

                <Paper elevation={0} sx={{ p: 3, mt: 2, borderRadius: '18px', bgcolor: '#FFF5EE', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.5rem', mb: 1 }}>🎉</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#231D17', fontSize: '1.15rem', mb: 0.5 }}>
                    Your agent is ready to deploy!
                  </Typography>
                  <Typography sx={{ color: '#7B6F64', fontSize: '0.86rem', mb: 2, lineHeight: 1.6 }}>
                    Review your configuration in the summary and click Deploy to go live.
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
                      '&:hover': { bgcolor: '#A45C30' },
                    }}
                  >
                    🚀 Deploy Agent
                  </Button>
                  {isDeployed && (
                    <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <CheckCircle sx={{ color: '#47735D', fontSize: 18 }} />
                      <Typography sx={{ color: '#47735D', fontWeight: 700, fontSize: '0.9rem' }}>
                        Agent deployed successfully!
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            )}
          </Box>
        </DialogContent>

        {/* Modal Footer */}
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: '#FFFDFC',
            borderTop: '1px solid rgba(108,74,42,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button
            onClick={prevStep}
            disabled={stepIndex === 0}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: '999px',
              borderColor: 'rgba(108,74,42,0.14)',
              color: '#5E5349',
              minWidth: 90,
            }}
          >
            ← Back
          </Button>

          <Box sx={{ display: 'flex', gap: 0.65, alignItems: 'center' }}>
            {builderSteps.map((step, index) => (
              <Box
                key={step.id}
                onClick={() => setStepIndex(index)}
                sx={{
                  width: index === stepIndex ? 22 : 8,
                  height: 8,
                  borderRadius: '999px',
                  bgcolor: index === stepIndex ? '#B96836' : index < stepIndex ? '#D4A484' : '#D9CEC3',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
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
                minWidth: 90,
                '&:hover': { bgcolor: '#A45C30' },
              }}
            >
              Next →
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              variant="contained"
              disableElevation
              sx={{
                textTransform: 'none',
                borderRadius: '999px',
                bgcolor: '#47735D',
                fontWeight: 700,
                px: 2.5,
                minWidth: 90,
                '&:hover': { bgcolor: '#3A6050' },
              }}
            >
              ✓ Finish
            </Button>
          )}
        </Box>
      </Dialog>
    </>
  );
}

// ─────────────── Sub-components ───────────────

function StepLabel({ label }: { label: string }) {
  return (
    <Typography
      sx={{
        color: '#B96836',
        fontWeight: 800,
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        mb: 1,
      }}
    >
      {label}
    </Typography>
  );
}

function BuilderField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography sx={{ fontWeight: 700, color: '#2A241D', mb: 1, fontSize: '0.9rem' }}>{label}</Typography>
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
  onToggle: (v: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
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
              fontSize: '0.83rem',
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
    <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', bgcolor: bg }}>
      <Typography sx={{ fontWeight: 800, color, mb: 1, fontSize: '0.9rem' }}>{title}</Typography>
      {items.map((item) => (
        <Typography key={item} sx={{ color: '#62574D', fontSize: '0.83rem', py: 0.3, lineHeight: 1.5 }}>
          • {item}
        </Typography>
      ))}
    </Paper>
  );
}

function MemoryCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: string;
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
        borderRadius: '14px',
        border: '2px solid',
        borderColor: selected ? '#B96836' : 'rgba(108,74,42,0.10)',
        bgcolor: selected ? '#FFF4EB' : '#FFFDFC',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: selected ? '#B96836' : 'rgba(108,74,42,0.22)',
            bgcolor: selected ? '#B96836' : '#fff',
            mt: 0.2,
            flexShrink: 0,
          }}
        />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
            <Typography sx={{ fontSize: '0.9rem' }}>{icon}</Typography>
            <Typography sx={{ fontWeight: 800, color: '#2A241D', fontSize: '0.9rem' }}>{title}</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.83rem', color: '#78695E', lineHeight: 1.55 }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
