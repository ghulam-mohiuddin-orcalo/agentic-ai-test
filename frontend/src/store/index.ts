import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import onboardingReducer from './slices/onboardingSlice';

// Import API files to trigger injectEndpoints
import './api/authApi';
import './api/chatApi';
import './api/modelsApi';
import './api/usersApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer,
    onboarding: onboardingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
