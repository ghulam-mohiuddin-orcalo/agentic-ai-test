'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { store } from '@/store';
import { theme } from '@/lib/theme';
import AuthHydration from '@/components/auth/AuthHydration';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydration>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            autoHideDuration={3000}
          >
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </AuthHydration>
    </Provider>
  );
}
