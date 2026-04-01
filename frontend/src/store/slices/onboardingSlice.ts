import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
  currentStep: number;
  answers: Record<string, any>;
  isComplete: boolean;
  isActive: boolean;
}

const initialState: OnboardingState = {
  currentStep: 0,
  answers: {},
  isComplete: false,
  isActive: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    startOnboarding: (state) => {
      state.isActive = true;
      state.currentStep = 0;
      state.answers = {};
      state.isComplete = false;
    },
    answerQuestion: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.answers[action.payload.key] = action.payload.value;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    skipStep: (state) => {
      state.currentStep += 1;
    },
    completeOnboarding: (state) => {
      state.isComplete = true;
      state.isActive = false;
    },
    resetOnboarding: (state) => {
      state.currentStep = 0;
      state.answers = {};
      state.isComplete = false;
      state.isActive = false;
    },
  },
});

export const {
  startOnboarding,
  answerQuestion,
  nextStep,
  previousStep,
  skipStep,
  completeOnboarding,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
