'use client';

import { useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  startOnboarding,
  answerQuestion,
  nextStep,
  skipStep,
  completeOnboarding,
} from '@/store/slices/onboardingSlice';
import type { RootState } from '@/store';
import QuestionStep from './QuestionStep';

const QUESTION_KEYS = ['goal', 'experience', 'content_type', 'timeline', 'budget', 'help_needed', 'industry', 'team_size', 'language'];

export default function OnboardingFlow() {
  const dispatch = useDispatch();
  const { currentStep, isComplete, isActive } = useSelector((state: RootState) => state.onboarding);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isActive) {
      dispatch(startOnboarding());
    }
  }, [isActive, dispatch]);

  const handleAnswer = (answer: any) => {
    dispatch(answerQuestion({ key: QUESTION_KEYS[currentStep], value: answer }));

    if (currentStep < 8) {
      dispatch(nextStep());
    } else {
      dispatch(completeOnboarding());
    }
  };

  const handleSkip = () => {
    if (currentStep < 8) {
      dispatch(nextStep());
    } else {
      dispatch(completeOnboarding());
    }
  };

  if (isComplete) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            animation: 'fadeIn 0.5s ease',
          }}
        >
          {'\uD83C\uDF89'} {t('home.onboarding.perfect')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('home.onboarding.building')}
        </Typography>
        <Box sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}>
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'background.default',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #C8622A 0%, #A34D1E 100%)',
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  const progress = ((currentStep + 1) / 9) * 100;

  return (
    <Box>
      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t('home.onboarding.stepOf', { current: currentStep + 1, total: 9 })}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight={600}>
            {t('home.onboarding.progress', { percent: Math.round(progress) })}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'background.default',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #C8622A 0%, #A34D1E 100%)',
            },
          }}
        />
      </Box>

      {/* Question Step */}
      <QuestionStep
        step={currentStep}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
      />
    </Box>
  );
}
