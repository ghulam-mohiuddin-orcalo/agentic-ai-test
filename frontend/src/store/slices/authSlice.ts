import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrate: (state) => {
      // Load from localStorage on client side only
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('nexusai_token');
          const refreshToken = localStorage.getItem('nexusai_refresh_token');
          const userStr = localStorage.getItem('nexusai_user');
          const user = userStr ? JSON.parse(userStr) : null;

          state.token = token;
          state.refreshToken = refreshToken;
          state.user = user;
          state.isAuthenticated = !!token && !!user;
        } catch (error) {
          console.error('Error loading auth state:', error);
        }
      }
      state.isHydrated = true;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string; user: AuthState['user'] }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || state.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexusai_token', action.payload.token);
        if (action.payload.refreshToken) {
          localStorage.setItem('nexusai_refresh_token', action.payload.refreshToken);
        }
        if (action.payload.user) {
          localStorage.setItem('nexusai_user', JSON.stringify(action.payload.user));
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nexusai_token');
        localStorage.removeItem('nexusai_refresh_token');
        localStorage.removeItem('nexusai_user');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<AuthState['user']>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('nexusai_user', JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { hydrate, setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
