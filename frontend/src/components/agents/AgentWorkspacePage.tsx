'use client';

import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  ContentCopy,
  Edit,
  MonitorHeart,
  OpenInNew,
  Settings,
} from '@mui/icons-material';
import {
  agentTemplates,
  myAgents,
  sampleChips,
} from './agentStudioData';
import {
  InfoAction,
  SideInfoCard,
  StatCard,
  pageShellSx,
  sectionCardSx,
} from './AgentStudioShared';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  role: 'agent' | 'user';
  text: string;
}

// Simulated responses the agent cycles through
const AGENT_REPLIES = [
  "I'm on it! Let me look that up for you right now.",
  "Great question. Based on what you've shared, here's what I'd recommend…",
  "I can definitely help with that. Could you give me a bit more detail so I can assist you better?",
  "Thanks for reaching out. I've checked your account and found the relevant information.",
  "I understand — that can be frustrating. Let me escalate this to the right team immediately.",
  "Sure! Here's a step-by-step walkthrough based on your request.",
];

let replyIndex = 0;
function nextReply() {
  const reply = AGENT_REPLIES[replyIndex % AGENT_REPLIES.length];
  replyIndex++;
  return reply;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AgentWorkspacePage() {
  const params = useParams<{ agentId: string }>();
  const router = useRouter();

  const agentId = Array.isArray(params?.agentId) ? params.agentId[0] : params?.agentId;
  const fallback = agentTemplates[1];
  const agent = [...myAgents, ...agentTemplates].find((a) => a.id === agentId) ?? fallback;
  const isLive = agent.status === 'Deployed & Live';

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'agent',
      text: `👋 Hello! I'm your ${agent.name} — I'm here to help with ${agent.description?.toLowerCase() ?? 'your requests'}\n\nHow can I assist you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Reset height then set to scrollHeight for auto-grow
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setMessageCount((c) => c + 1);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate agent typing then reply
    setIsTyping(true);
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const agentMsg: Message = { id: Date.now() + 1, role: 'agent', text: nextReply() };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChipClick = (chip: string) => {
    setInput(chip);
    textareaRef.current?.focus();
  };

  return (
    <Box sx={pageShellSx}>
      <Container maxWidth={false} sx={{ maxWidth: '1480px', pt: 3 }}>
        <Paper elevation={0} sx={{ ...sectionCardSx, overflow: 'hidden' }}>

          {/* ── Top bar ── */}
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.75,
              borderBottom: '1px solid rgba(108,74,42,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                onClick={() => router.push('/agents')}
                startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
                size="small"
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: '999px',
                  borderColor: 'rgba(108,74,42,0.14)',
                  color: '#4F463D',
                  fontWeight: 600,
                }}
              >
                Agents
              </Button>

              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  bgcolor: '#B96836',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                }}
              >
                {agent.emoji || agent.name.slice(0, 1)}
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#231D17' }}>
                    {agent.name}
                  </Typography>
                  {isLive && (
                    <Chip
                      label="+ Live"
                      size="small"
                      sx={{ bgcolor: '#EAF8F2', color: '#47735D', fontWeight: 700, fontSize: '0.75rem', height: 22 }}
                    />
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.82rem', color: '#7A6D61' }}>
                  Tools: {agent.tools?.join(', ') || 'No tools'} · Memory: {agent.memory || 'No memory'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[
                { label: 'Settings', icon: <Settings sx={{ fontSize: 16 }} /> },
                { label: 'Monitor', icon: <MonitorHeart sx={{ fontSize: 16 }} /> },
              ].map(({ label, icon }) => (
                <Button
                  key={label}
                  startIcon={icon}
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '999px',
                    borderColor: 'rgba(108,74,42,0.14)',
                    color: '#4A4037',
                    fontWeight: 600,
                  }}
                >
                  {label}
                </Button>
              ))}
              <Button
                onClick={() => router.push('/agents/create')}
                startIcon={<Edit sx={{ fontSize: 16 }} />}
                size="small"
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: '999px',
                  borderColor: 'rgba(108,74,42,0.14)',
                  color: '#4A4037',
                  fontWeight: 600,
                }}
              >
                Edit Agent
              </Button>
            </Box>
          </Box>

          {/* ── Try chips row ── */}
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.25,
              borderBottom: '1px solid rgba(108,74,42,0.08)',
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: '0.78rem', color: '#9A8F84', fontWeight: 700, mr: 0.5, flexShrink: 0 }}>
              TRY:
            </Typography>
            {sampleChips.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                size="small"
                onClick={() => handleChipClick(chip)}
                sx={{
                  bgcolor: '#F5F2EE',
                  color: '#5E5349',
                  border: '1px solid rgba(108,74,42,0.10)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  '&:hover': { bgcolor: '#EDE8E2' },
                }}
              />
            ))}
          </Box>

          {/* ── Main body: chat + sidebar ── */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', xl: '1fr 300px' },
              minHeight: '72vh',
            }}
          >
            {/* Chat column */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#F8F5F0',
                overflow: 'hidden',
              }}
            >
              {/* Scrollable messages area */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  p: { xs: 2, md: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  minHeight: 0,
                  maxHeight: 'calc(72vh - 120px)',
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'flex-start',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      maxWidth: { xs: '100%', md: '85%' },
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {/* Avatar */}
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        bgcolor: msg.role === 'agent' ? '#B96836' : '#2A241D',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: msg.role === 'agent' ? '1rem' : '0.75rem',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {msg.role === 'agent' ? (agent.emoji || agent.name.slice(0, 1)) : 'You'}
                    </Box>

                    {/* Bubble */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                        bgcolor: msg.role === 'user' ? '#2A241D' : '#FFFDFC',
                        border: msg.role === 'user' ? 'none' : '1px solid rgba(108,74,42,0.10)',
                        boxShadow: '0 2px 8px rgba(51,38,24,0.06)',
                      }}
                    >
                      {msg.text.split('\n').map((line, li) => (
                        <Typography
                          key={li}
                          sx={{
                            color: msg.role === 'user' ? '#F4EFE9' : '#40372F',
                            fontSize: '0.92rem',
                            lineHeight: 1.65,
                            mb: li < msg.text.split('\n').length - 1 ? 0.75 : 0,
                          }}
                        >
                          {line || '\u00A0'}
                        </Typography>
                      ))}
                    </Paper>
                  </Box>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', alignSelf: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        bgcolor: '#B96836',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {agent.emoji || agent.name.slice(0, 1)}
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: '4px 18px 18px 18px',
                        bgcolor: '#FFFDFC',
                        border: '1px solid rgba(108,74,42,0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <CircularProgress size={12} sx={{ color: '#B96836' }} />
                      <Typography sx={{ color: '#A09388', fontSize: '0.85rem' }}>Thinking…</Typography>
                    </Paper>
                  </Box>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input bar — pinned to bottom */}
              <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: '#F8F5F0' }}>
                <Paper elevation={0} sx={{ ...sectionCardSx, p: 1.5 }}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your project, ask a question, or just say hi — I'm here to help..."
                    rows={2}
                    style={{
                      width: '100%',
                      border: 'none',
                      resize: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '14px',
                      color: '#2A241D',
                      padding: '4px 0 10px 0',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      maxHeight: '160px',
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 2,
                      alignItems: 'center',
                      borderTop: '1px solid rgba(108,74,42,0.08)',
                      pt: 1.25,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                      {['🎙️', '📎', '🖼️', '📊', '📝', '✨'].map((icon) => (
                        <Box
                          key={icon}
                          sx={{
                            fontSize: '1rem',
                            cursor: 'pointer',
                            opacity: 0.55,
                            transition: 'opacity 0.15s',
                            '&:hover': { opacity: 1 },
                            userSelect: 'none',
                          }}
                        >
                          {icon}
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label="Agent"
                        size="small"
                        sx={{ bgcolor: '#EFE7DF', color: '#675B4E', fontSize: '0.78rem' }}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping}
                        variant="contained"
                        disableElevation
                        sx={{
                          minWidth: 44,
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          bgcolor: '#B96836',
                          fontSize: '1.1rem',
                          transition: 'background-color 0.15s',
                          '&:hover': { bgcolor: '#A45C30' },
                          '&:disabled': { bgcolor: '#D9CEC3', color: '#fff' },
                        }}
                      >
                        →
                      </Button>
                    </Box>
                  </Box>
                </Paper>

                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    color: '#B0A498',
                    textAlign: 'center',
                    mt: 1,
                  }}
                >
                  Live preview of your deployed agent · Edit configuration →
                </Typography>
              </Box>
            </Box>

            {/* ── Right sidebar ── */}
            <Box
              sx={{
                p: 2,
                borderLeft: { xl: '1px solid rgba(108,74,42,0.08)' },
                borderTop: { xs: '1px solid rgba(108,74,42,0.08)', xl: 'none' },
                bgcolor: '#FFFDFC',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                overflowY: 'auto',
              }}
            >
              {/* Agent Info */}
              <SideInfoCard title="Agent Info">
                <InfoRow label="Status" value={agent.status || 'Draft'} accent={isLive} />
                <InfoRow label="Memory" value={agent.memory || 'No memory'} />
                <Box sx={{ mt: 1.25 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#9A8F84', mb: 0.75 }}>
                    Tools Connected
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {(agent.tools || []).map((tool) => (
                      <Chip
                        key={tool}
                        label={tool}
                        size="small"
                        sx={{ bgcolor: '#FFF1E8', color: '#B96836', fontSize: '0.75rem' }}
                      />
                    ))}
                    {(!agent.tools || agent.tools.length === 0) && (
                      <Typography sx={{ fontSize: '0.82rem', color: '#9A8F84' }}>None</Typography>
                    )}
                  </Box>
                </Box>
              </SideInfoCard>

              {/* Live Metrics */}
              <Box sx={{ mb: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#A2978B',
                    letterSpacing: '0.09em',
                    mb: 1,
                  }}
                >
                  LIVE METRICS
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <StatCard label="Messages" value={String(messageCount)} />
                  <StatCard label="Avg latency" value={messageCount > 0 ? '~0.9s' : '—'} />
                  <StatCard label="Tokens used" value={messageCount > 0 ? String(messageCount * 142) : '0'} />
                </Box>
              </Box>

              {/* Actions */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#A2978B',
                    letterSpacing: '0.09em',
                    mb: 1,
                  }}
                >
                  ACTIONS
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <InfoAction
                    label="Edit configuration"
                    icon={<Edit sx={{ fontSize: 15 }} />}
                    onClick={() => router.push('/agents/create')}
                  />
                  <InfoAction
                    label="Copy endpoint URL"
                    icon={<ContentCopy sx={{ fontSize: 15 }} />}
                  />
                  <InfoAction
                    label="View dashboard"
                    icon={<OpenInNew sx={{ fontSize: 15 }} />}
                  />
                  <InfoAction
                    label="← Back to Agents"
                    icon={<ArrowBack sx={{ fontSize: 15 }} />}
                    onClick={() => router.push('/agents')}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <Box sx={{ mb: 1.25 }}>
      <Typography sx={{ fontSize: '0.75rem', color: '#9A8F84', mb: 0.25 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 700, color: accent ? '#47735D' : '#2F2821', fontSize: '0.88rem' }}>
        {accent ? `+ ${value}` : value}
      </Typography>
    </Box>
  );
}
