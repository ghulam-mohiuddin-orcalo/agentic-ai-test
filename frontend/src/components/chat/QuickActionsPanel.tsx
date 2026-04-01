'use client';

import { Box, Typography, List, ListItemButton } from '@mui/material';
import {
  Store,
  SmartToy,
  HelpOutline,
  AttachMoney,
  Assessment,
  Image,
  Audiotrack,
  Videocam,
  Slideshow,
  BarChart,
  Quiz,
  FlashOn,
  AccountTree,
  AnalyticsOutlined,
  EditNote,
  Code,
  Description,
  Translate,
} from '@mui/icons-material';

const QUICK_SECTIONS = [
  {
    label: 'NAVIGATION & TOOLS',
    items: [
      { icon: Store, label: 'Browse Marketplace' },
      { icon: SmartToy, label: 'Build an Agent' },
      { icon: HelpOutline, label: 'How to use Guide' },
      { icon: EditNote, label: 'Prompt Engineering' },
      { icon: AttachMoney, label: 'View Pricing' },
      { icon: Assessment, label: 'AI Models Analysis' },
    ],
  },
  {
    label: 'CREATE & GENERATE',
    items: [
      { icon: Image, label: 'Create image' },
      { icon: Audiotrack, label: 'Generate Audio' },
      { icon: Videocam, label: 'Create video' },
      { icon: Slideshow, label: 'Create slides' },
      { icon: BarChart, label: 'Create Infographic' },
      { icon: Quiz, label: 'Create quiz' },
      { icon: FlashOn, label: 'Create Flashcards' },
      { icon: AccountTree, label: 'Create Mind-map' },
    ],
  },
  {
    label: 'ANALYSE & WRITE',
    items: [
      { icon: AnalyticsOutlined, label: 'Analyse Data' },
      { icon: EditNote, label: 'Write content' },
      { icon: Code, label: 'Code Generation' },
      { icon: Description, label: 'Document Analysis' },
      { icon: Translate, label: 'Translate' },
    ],
  },
];

export default function QuickActionsPanel() {
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
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
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
          QUICK ACTIONS
        </Typography>
      </Box>

      {QUICK_SECTIONS.map((section) => (
        <Box key={section.label} sx={{ mb: 1 }}>
          <Typography
            sx={{
              px: 2,
              py: 0.75,
              fontSize: '0.625rem',
              fontWeight: 700,
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {section.label}
          </Typography>
          <List sx={{ py: 0, px: 0.5 }}>
            {section.items.map(({ icon: Icon, label }) => (
              <ListItemButton
                key={label}
                sx={{
                  borderRadius: '8px',
                  px: 1.5,
                  py: 0.75,
                  mb: 0.125,
                  gap: 1.25,
                  '&:hover': { bgcolor: 'var(--bg)' },
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    bgcolor: 'var(--bg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 14, color: 'var(--text2)' }} />
                </Box>
                <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text)', fontWeight: 500, lineHeight: 1.3 }}>
                  {label}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}
