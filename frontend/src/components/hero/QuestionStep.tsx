'use client';

import { Box, Typography, Button, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Option {
  emoji: string;
  labelKey: string;
  subtitleKey?: string;
  value: string;
}

interface Question {
  key: string;
  titleKey: string;
  subtitleKey?: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    key: 'goal',
    titleKey: 'home.questions.q1Title',
    subtitleKey: 'home.questions.q1Subtitle',
    options: [
      { emoji: '\uD83C\uDFA8', labelKey: 'home.questions.q1Opt1', value: 'create' },
      { emoji: '\uD83D\uDCBB', labelKey: 'home.questions.q1Opt2', value: 'code' },
      { emoji: '\uD83D\uDCCA', labelKey: 'home.questions.q1Opt3', value: 'analyze' },
      { emoji: '\uD83D\uDD0D', labelKey: 'home.questions.q1Opt4', value: 'explore' },
    ],
  },
  {
    key: 'experience',
    titleKey: 'home.questions.q2Title',
    subtitleKey: 'home.questions.q2Subtitle',
    options: [
      { emoji: '\uD83C\uDF31', labelKey: 'home.questions.q2Opt1', subtitleKey: 'home.questions.q2Opt1Desc', value: 'beginner' },
      { emoji: '\uD83D\uDE80', labelKey: 'home.questions.q2Opt2', subtitleKey: 'home.questions.q2Opt2Desc', value: 'intermediate' },
      { emoji: '\u2B50', labelKey: 'home.questions.q2Opt3', subtitleKey: 'home.questions.q2Opt3Desc', value: 'advanced' },
    ],
  },
  {
    key: 'content_type',
    titleKey: 'home.questions.q3Title',
    options: [
      { emoji: '\u270D\uFE0F', labelKey: 'home.questions.q3Opt1', value: 'text' },
      { emoji: '\uD83D\uDDBC\uFE0F', labelKey: 'home.questions.q3Opt2', value: 'images' },
      { emoji: '\uD83D\uDCAC', labelKey: 'home.questions.q3Opt3', value: 'chat' },
      { emoji: '\uD83C\uDFB5', labelKey: 'home.questions.q3Opt4', value: 'audio' },
    ],
  },
  {
    key: 'timeline',
    titleKey: 'home.questions.q4Title',
    options: [
      { emoji: '\u26A1', labelKey: 'home.questions.q4Opt1', value: 'immediate' },
      { emoji: '\uD83D\uDCC5', labelKey: 'home.questions.q4Opt2', value: 'week' },
      { emoji: '\uD83D\uDCC3\uFE0F', labelKey: 'home.questions.q4Opt3', value: 'month' },
      { emoji: '\uD83D\uDD2E', labelKey: 'home.questions.q4Opt4', value: 'planning' },
    ],
  },
  {
    key: 'budget',
    titleKey: 'home.questions.q5Title',
    options: [
      { emoji: '\uD83C\uDD93', labelKey: 'home.questions.q5Opt1', value: 'free' },
      { emoji: '\uD83D\uDCB5', labelKey: 'home.questions.q5Opt2', value: 'payg' },
      { emoji: '\uD83D\uDCBC', labelKey: 'home.questions.q5Opt3', value: 'business' },
      { emoji: '\uD83C\uDFE2', labelKey: 'home.questions.q5Opt4', value: 'enterprise' },
    ],
  },
  {
    key: 'help_needed',
    titleKey: 'home.questions.q6Title',
    options: [
      { emoji: '\uD83D\uDC4B', labelKey: 'home.questions.q6Opt1', value: 'yes' },
      { emoji: '\uD83C\uDFAF', labelKey: 'home.questions.q6Opt2', value: 'no' },
    ],
  },
  {
    key: 'industry',
    titleKey: 'home.questions.q7Title',
    options: [
      { emoji: '\uD83D\uDCBC', labelKey: 'home.questions.q7Opt1', value: 'business' },
      { emoji: '\uD83C\uDF93', labelKey: 'home.questions.q7Opt2', value: 'education' },
      { emoji: '\uD83C\uDFE5', labelKey: 'home.questions.q7Opt3', value: 'healthcare' },
      { emoji: '\uD83C\uDFA8', labelKey: 'home.questions.q7Opt4', value: 'creative' },
      { emoji: '\uD83D\uDD27', labelKey: 'home.questions.q7Opt5', value: 'tech' },
      { emoji: '\uD83C\uDF10', labelKey: 'home.questions.q7Opt6', value: 'other' },
    ],
  },
  {
    key: 'team_size',
    titleKey: 'home.questions.q8Title',
    options: [
      { emoji: '\uD83D\uDC64', labelKey: 'home.questions.q8Opt1', value: 'solo' },
      { emoji: '\uD83D\uDC65', labelKey: 'home.questions.q8Opt2', value: 'small' },
      { emoji: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66', labelKey: 'home.questions.q8Opt3', value: 'medium' },
      { emoji: '\uD83C\uDFE2', labelKey: 'home.questions.q8Opt4', value: 'large' },
    ],
  },
  {
    key: 'language',
    titleKey: 'home.questions.q9Title',
    options: [
      { emoji: '\uD83C\uDDFA\uD83C\uDDF8', labelKey: 'home.questions.q9Opt1', value: 'en' },
      { emoji: '\uD83C\uDDEA\uD83C\uDDF8', labelKey: 'home.questions.q9Opt2', value: 'es' },
      { emoji: '\uD83C\uDDEB\uD83C\uDDF7', labelKey: 'home.questions.q9Opt3', value: 'fr' },
      { emoji: '\uD83C\uDDE9\uD83C\uDDEA', labelKey: 'home.questions.q9Opt4', value: 'de' },
      { emoji: '\uD83C\uDDE8\uD83C\uDDF3', labelKey: 'home.questions.q9Opt5', value: 'zh' },
      { emoji: '\uD83C\uDDEF\uD83C\uDDF5', labelKey: 'home.questions.q9Opt6', value: 'ja' },
    ],
  },
];

interface QuestionStepProps {
  step: number;
  onAnswer: (answer: any) => void;
  onSkip: () => void;
}

export default function QuestionStep({ step, onAnswer, onSkip }: QuestionStepProps) {
  const { t } = useTranslation();
  const question = QUESTIONS[step];

  if (!question) return null;

  return (
    <Box
      sx={{
        animation: 'slideUp 0.3s ease',
      }}
    >
      {/* Question */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            mb: 1,
            fontSize: { xs: '1.25rem', md: '1.5rem' },
          }}
        >
          {t(question.titleKey)}
        </Typography>
        {question.subtitleKey && (
          <Typography variant="body2" color="text.secondary">
            {t(question.subtitleKey)}
          </Typography>
        )}
      </Box>

      {/* Options */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: question.options.length > 4 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
        {question.options.map((option) => (
          <Paper
            key={option.value}
            onClick={() => onAnswer(option.value)}
            sx={{
              p: 2.5,
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-4px)',
                boxShadow: 3,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: '2rem',
                mb: 1,
                display: 'block',
              }}
            >
              {option.emoji}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ mb: option.subtitleKey ? 0.5 : 0 }}
            >
              {t(option.labelKey)}
            </Typography>
            {option.subtitleKey && (
              <Typography variant="caption" color="text.secondary">
                {t(option.subtitleKey)}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>

      {/* Skip Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          onClick={onSkip}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'transparent',
              color: 'text.primary',
            },
          }}
        >
          {t('home.questions.skip')}
        </Button>
      </Box>
    </Box>
  );
}
