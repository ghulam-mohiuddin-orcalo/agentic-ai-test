'use client';

import {
  Box,
  Typography,
  List,
  ListItemButton,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import {
  AddComment,
  DeleteOutline,
  FileDownload,
  Share,
  Bolt,
  SmartToy,
  BarChart,
  SwapHoriz,
} from '@mui/icons-material';

const QUICK_ACTIONS = [
  { icon: AddComment, label: 'New Chat', color: '#2563EB', bg: '#EFF6FF' },
  { icon: DeleteOutline, label: 'Clear History', color: '#D97706', bg: '#FFFBEB' },
  { icon: FileDownload, label: 'Export Chat', color: '#0A5E49', bg: '#E2F5EF' },
  { icon: Share, label: 'Share Conversation', color: '#7C3AED', bg: '#F3EEFF' },
];

const USAGE_STATS = [
  { label: 'Tokens used today', value: '12,450' },
  { label: 'Conversations', value: '8' },
  { label: 'Active agents', value: '2' },
];

interface QuickActionsPanelProps {
  selectedModel?: string;
  selectedModelProvider?: string;
}

export default function QuickActionsPanel({
  selectedModel = 'GPT-5.4',
  selectedModelProvider = 'OpenAI',
}: QuickActionsPanelProps) {
  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'var(--card)',
        borderLeft: '1px solid var(--border)',
        height: '100%',
        overflow: 'auto',
      }}
    >
      {/* Section 1: Quick Actions */}
      <Box sx={{ px: 1.5, pt: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.5, mb: 1 }}>
          <Bolt sx={{ fontSize: 14, color: 'var(--accent)' }} />
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '0.75rem',
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Quick Actions
          </Typography>
        </Box>

        <List sx={{ py: 0 }}>
          {QUICK_ACTIONS.map(({ icon: Icon, label, color, bg }) => (
            <ListItemButton
              key={label}
              sx={{
                borderRadius: '8px',
                px: 1.25,
                py: 0.75,
                mb: 0.25,
                gap: 1,
                '&:hover': { bgcolor: 'var(--bg)' },
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  bgcolor: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.18s ease',
                }}
              >
                <Icon sx={{ fontSize: 14, color }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: 'var(--text)',
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {label}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'var(--border)', mx: 1.5 }} />

      {/* Section 2: Active Model */}
      <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.5, mb: 1 }}>
          <SmartToy sx={{ fontSize: 14, color: 'var(--accent)' }} />
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '0.75rem',
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Active Model
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            bgcolor: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            p: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.3,
            }}
          >
            {selectedModel}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.6875rem',
              color: 'var(--text3)',
              mt: 0.25,
              mb: 1,
            }}
          >
            {selectedModelProvider}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SwapHoriz sx={{ fontSize: 14 }} />}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              borderColor: 'var(--border)',
              color: 'var(--accent)',
              py: 0.375,
              px: 1.5,
              '&:hover': {
                borderColor: 'var(--accent)',
                bgcolor: 'var(--accent-lt)',
              },
            }}
          >
            Change
          </Button>
        </Paper>
      </Box>

      <Divider sx={{ borderColor: 'var(--border)', mx: 1.5 }} />

      {/* Section 3: Usage Overview */}
      <Box sx={{ px: 1.5, pt: 1.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.5, mb: 1 }}>
          <BarChart sx={{ fontSize: 14, color: 'var(--accent)' }} />
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '0.75rem',
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Usage Overview
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            bgcolor: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {USAGE_STATS.map(({ label, value }) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'var(--text3)',
                  lineHeight: 1.3,
                }}
              >
                {label}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1.3,
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}
