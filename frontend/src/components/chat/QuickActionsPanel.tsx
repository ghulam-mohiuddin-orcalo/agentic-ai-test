'use client';

import {
  Box,
  Typography,
  List,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Storefront,
  SmartToy,
  MenuBook,
  AutoAwesome,
  Payments,
  Analytics,
  Image,
  GraphicEq,
  Videocam,
  Slideshow,
  Quiz,
  Style,
  AccountTree,
  BarChart,
  EditNote,
  Code,
  Description,
  Translate,
  Explore,
  Brush,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface SidebarItem {
  icon: typeof Storefront;
  label: string;
  color: string;
  bg: string;
  route?: string;
  action?: string;
}

const NAVIGATION_TOOLS: SidebarItem[] = [
  { icon: Storefront, label: 'chat.quickActions.browseMarketplace', color: '#2563EB', bg: '#EFF6FF', route: '/marketplace' },
  { icon: SmartToy, label: 'chat.quickActions.buildAgent', color: '#7C3AED', bg: '#F3EEFF', route: '/agents' },
  { icon: MenuBook, label: 'chat.quickActions.howToGuide', color: '#059669', bg: '#ECFDF5', action: 'guide' },
  { icon: AutoAwesome, label: 'chat.quickActions.promptEngineering', color: '#D97706', bg: '#FFFBEB', action: 'prompt_eng' },
  { icon: Payments, label: 'chat.quickActions.viewPricing', color: '#0891B2', bg: '#E0F7FA', action: 'pricing' },
  { icon: Analytics, label: 'chat.quickActions.aiModelsAnalysis', color: '#9B2042', bg: '#FDEDF1', route: '/discover' },
];

const CREATE_GENERATE: SidebarItem[] = [
  { icon: Image, label: 'chat.quickActions.createImage', color: '#0A5E49', bg: '#E2F5EF', action: 'create_image' },
  { icon: GraphicEq, label: 'chat.quickActions.generateAudio', color: '#7C3AED', bg: '#F3EEFF', action: 'gen_audio' },
  { icon: Videocam, label: 'chat.quickActions.createVideo', color: '#2563EB', bg: '#EFF6FF', action: 'create_video' },
  { icon: Slideshow, label: 'chat.quickActions.createSlides', color: '#D97706', bg: '#FFFBEB', action: 'create_slides' },
  { icon: Brush, label: 'chat.quickActions.createInfographics', color: '#9B2042', bg: '#FDEDF1', action: 'create_infographic' },
  { icon: Quiz, label: 'chat.quickActions.createQuiz', color: '#059669', bg: '#ECFDF5', action: 'create_quiz' },
  { icon: Style, label: 'chat.quickActions.createFlashcards', color: '#0891B2', bg: '#E0F7FA', action: 'create_flashcards' },
  { icon: AccountTree, label: 'chat.quickActions.createMindmap', color: '#0A5E49', bg: '#E2F5EF', action: 'create_mindmap' },
];

const ANALYZE_WRITE: SidebarItem[] = [
  { icon: BarChart, label: 'chat.quickActions.analyzeData', color: '#9B2042', bg: '#FDEDF1', action: 'analyze_data' },
  { icon: EditNote, label: 'chat.quickActions.writeContent', color: '#2563EB', bg: '#EFF6FF', action: 'write_content' },
  { icon: Code, label: 'chat.quickActions.codeGeneration', color: '#7C3AED', bg: '#F3EEFF', action: 'code_gen' },
  { icon: Description, label: 'chat.quickActions.documentAnalysis', color: '#D97706', bg: '#FFFBEB', action: 'doc_analysis' },
  { icon: Translate, label: 'chat.quickActions.translate', color: '#059669', bg: '#ECFDF5', action: 'translate' },
];

interface QuickActionsPanelProps {
  onNewChat?: () => void;
  onClearHistory?: () => void;
  onExportChat?: () => void;
}

export default function QuickActionsPanel({
  onNewChat,
  onClearHistory,
  onExportChat,
}: QuickActionsPanelProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleItemClick = (item: SidebarItem) => {
    if (item.route) {
      router.push(item.route);
      return;
    }
    // For action items, we could trigger a chat prompt or modal
    // For now, these are placeholders that can be wired up later
  };

  const renderSection = (title: string, items: SidebarItem[]) => (
    <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.5, mb: 1 }}>
        <Explore sx={{ fontSize: 14, color: 'var(--accent)' }} />
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '0.7rem',
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {title}
        </Typography>
      </Box>

      <List sx={{ py: 0 }}>
        {items.map(({ icon: Icon, label, color, bg, ...rest }) => (
          <ListItemButton
            key={label}
            onClick={() => handleItemClick({ icon: Icon, label, color, bg, ...rest })}
            sx={{
              borderRadius: '8px',
              px: 1.25,
              py: 0.625,
              mb: 0.25,
              gap: 1,
              '&:hover': {
                bgcolor: bg,
              },
            }}
          >
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: '7px',
                bgcolor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.18s ease',
              }}
            >
              <Icon sx={{ fontSize: 13, color }} />
            </Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'var(--text)',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {t(label)}
            </Typography>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        width: 230,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'var(--card)',
        borderLeft: '1px solid var(--border)',
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'var(--border)',
          borderRadius: 2,
        },
      }}
    >
      {renderSection(t('chat.quickActions.navTitle'), NAVIGATION_TOOLS)}
      <Divider sx={{ borderColor: 'var(--border)', mx: 1.5 }} />
      {renderSection(t('chat.quickActions.createTitle'), CREATE_GENERATE)}
      <Divider sx={{ borderColor: 'var(--border)', mx: 1.5 }} />
      {renderSection(t('chat.quickActions.analyzeTitle'), ANALYZE_WRITE)}
    </Box>
  );
}
