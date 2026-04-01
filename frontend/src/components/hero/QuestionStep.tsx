'use client';

import { Box, Typography, Button, Paper } from '@mui/material';

interface Option {
  emoji: string;
  label: string;
  subtitle?: string;
  value: string;
}

interface Question {
  key: string;
  question: string;
  hint?: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    key: 'goal',
    question: 'What brings you here today?',
    hint: 'Help us understand your needs',
    options: [
      { emoji: '🎨', label: 'Create content', value: 'create' },
      { emoji: '💻', label: 'Build software', value: 'code' },
      { emoji: '📊', label: 'Analyze data', value: 'analyze' },
      { emoji: '🔍', label: 'Just exploring', value: 'explore' },
    ],
  },
  {
    key: 'experience',
    question: "What's your experience level?",
    hint: 'This helps us tailor recommendations',
    options: [
      { emoji: '🌱', label: 'Beginner', subtitle: 'New to AI', value: 'beginner' },
      { emoji: '🚀', label: 'Intermediate', subtitle: 'Some experience', value: 'intermediate' },
      { emoji: '⭐', label: 'Advanced', subtitle: 'AI expert', value: 'advanced' },
    ],
  },
  {
    key: 'content_type',
    question: 'What type of content?',
    options: [
      { emoji: '✍️', label: 'Text & Writing', value: 'text' },
      { emoji: '🖼️', label: 'Images & Art', value: 'images' },
      { emoji: '💬', label: 'Chat & Conversation', value: 'chat' },
      { emoji: '🎵', label: 'Audio & Voice', value: 'audio' },
    ],
  },
  {
    key: 'timeline',
    question: "What's your timeline?",
    options: [
      { emoji: '⚡', label: 'Right now', value: 'immediate' },
      { emoji: '📅', label: 'This week', value: 'week' },
      { emoji: '🗓️', label: 'This month', value: 'month' },
      { emoji: '🔮', label: 'Just planning', value: 'planning' },
    ],
  },
  {
    key: 'budget',
    question: "What's your budget?",
    options: [
      { emoji: '🆓', label: 'Free tier', value: 'free' },
      { emoji: '💵', label: 'Pay as you go', value: 'payg' },
      { emoji: '💼', label: 'Business plan', value: 'business' },
      { emoji: '🏢', label: 'Enterprise', value: 'enterprise' },
    ],
  },
  {
    key: 'help_needed',
    question: 'Do you need help getting started?',
    options: [
      { emoji: '👋', label: 'Yes, guide me', value: 'yes' },
      { emoji: '🎯', label: 'I know what I need', value: 'no' },
    ],
  },
  {
    key: 'industry',
    question: 'What industry are you in?',
    options: [
      { emoji: '💼', label: 'Business', value: 'business' },
      { emoji: '🎓', label: 'Education', value: 'education' },
      { emoji: '🏥', label: 'Healthcare', value: 'healthcare' },
      { emoji: '🎨', label: 'Creative', value: 'creative' },
      { emoji: '🔧', label: 'Technology', value: 'tech' },
      { emoji: '🌐', label: 'Other', value: 'other' },
    ],
  },
  {
    key: 'team_size',
    question: 'Team size?',
    options: [
      { emoji: '👤', label: 'Just me', value: 'solo' },
      { emoji: '👥', label: 'Small team (2-10)', value: 'small' },
      { emoji: '👨‍👩‍👧‍👦', label: 'Medium (11-50)', value: 'medium' },
      { emoji: '🏢', label: 'Large (50+)', value: 'large' },
    ],
  },
  {
    key: 'language',
    question: 'Preferred language?',
    options: [
      { emoji: '🇺🇸', label: 'English', value: 'en' },
      { emoji: '🇪🇸', label: 'Español', value: 'es' },
      { emoji: '🇫🇷', label: 'Français', value: 'fr' },
      { emoji: '🇩🇪', label: 'Deutsch', value: 'de' },
      { emoji: '🇨🇳', label: '中文', value: 'zh' },
      { emoji: '🇯🇵', label: '日本語', value: 'ja' },
    ],
  },
];

interface QuestionStepProps {
  step: number;
  onAnswer: (answer: any) => void;
  onSkip: () => void;
}

export default function QuestionStep({ step, onAnswer, onSkip }: QuestionStepProps) {
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
          {question.question}
        </Typography>
        {question.hint && (
          <Typography variant="body2" color="text.secondary">
            {question.hint}
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
              sx={{ mb: option.subtitle ? 0.5 : 0 }}
            >
              {option.label}
            </Typography>
            {option.subtitle && (
              <Typography variant="caption" color="text.secondary">
                {option.subtitle}
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
          Skip this question
        </Button>
      </Box>
    </Box>
  );
}
