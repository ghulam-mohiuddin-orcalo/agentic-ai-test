'use client';

import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AI_LABS } from '@/lib/constants';

const LAB_DESCRIPTIONS: Record<string, string> = {
  openai: '3 models - GPT-5.4, Sora 2',
  anthropic: '3 models - Claude Opus 4.6, Sonnet 4.6',
  google: '5 models - Gemini 3.1, Veo 3',
  meta: '4 models - Llama 4 Maverick, Scout',
  mistral: '2 models - Large 3, Codestral',
  cohere: '2 models - Command R+, Embed',
  nvidia: '3 models - Nemotron Ultra, Nano',
  deepseek: '2 models - R1, V3',
  qwen: '3 models - Qwen3-Max, Coder',
  microsoft: '2 models - Phi-4, MAI-1',
  amazon: '2 models - Nova Premier, Lite',
  xai: '2 models - Grok-4, Grok-4 Fast',
  stability: '2 models - SD 3.5, SDXL',
  perplexity: '1 model - Sonar Pro',
  together: '3 models - hosted open-source',
  moonshot: '2 models - Kimi K2.5, K2',
  zhipu: '2 models - GLM-4.7, CodeGeeX',
  baidu: '2 models - ERNIE 5, ERNIE Speed',
  ai21: '2 models - Jamba 2, Jamba Mini',
  inflection: '1 model - Pi 3',
  allenai: '2 models - OLMo-3, Tulu',
};

export default function BrowseByLab() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
          {t('landing.browseLab.title')}
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            fontSize: '0.875rem',
            '&:hover': { bgcolor: 'primary.light' },
          }}
          href="/marketplace"
        >
          {t('landing.browseLab.allLabs')}
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            sm: 'repeat(5, 1fr)',
            md: 'repeat(8, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {AI_LABS.map((lab) => (
          <Box
            key={lab.id}
            onClick={() => router.push('/marketplace?lab=' + lab.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              {lab.icon}
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: '0.6875rem',
                color: 'text.secondary',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              {lab.name.split(' ')[0]}
            </Typography>
            {LAB_DESCRIPTIONS[lab.id] && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.5625rem',
                  color: 'text.disabled',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {LAB_DESCRIPTIONS[lab.id]}
              </Typography>
            )}
          </Box>
        ))}

        {/* Browse All card */}
        <Box
          onClick={() => router.push('/marketplace')}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            p: 2,
            borderRadius: 2,
            bgcolor: 'primary.light',
            border: '1px solid',
            borderColor: 'rgba(200,98,42,0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 2,
            },
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'rgba(200,98,42,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.375rem',
            }}
          >
            🌐
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              fontSize: '0.6875rem',
              color: 'primary.main',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            {t('landing.browseLab.allLabsCount', { count: 28 })}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
