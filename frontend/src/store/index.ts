import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import { authApi } from './api/authApi';
import { chatApi } from './api/chatApi';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import onboardingReducer from './slices/onboardingSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer,
    onboarding: onboardingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware, chatApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
