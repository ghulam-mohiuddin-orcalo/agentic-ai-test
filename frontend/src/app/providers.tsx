'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { I18nextProvider } from 'react-i18next';
import { store } from '@/store';
import AuthHydration from '@/components/auth/AuthHydration';
import { ToastInitializer } from '@/components/ui/Toast';
import ThemeRegistry from '@/components/ThemeRegistry';
import i18n, { applySavedLanguage } from '@/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  // Apply saved language AFTER mount to avoid hydration mismatch.
  // SSR always renders with English (lng: 'en'). The first client render
  // also uses English. After this effect fires, the saved language is applied.
  useEffect(() => {
    applySavedLanguage();
  }, []);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AuthHydration>
          <ThemeRegistry>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              autoHideDuration={3000}
            >
              <ToastInitializer />
              {children}
            </SnackbarProvider>
          </ThemeRegistry>
        </AuthHydration>
      </I18nextProvider>
    </Provider>
  );
}
