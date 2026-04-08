'use client';

import { useMemo } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { theme } from '@/lib/theme';
import { useDirection } from '@/hooks/useDirection';

// Create caches lazily to avoid module-level side effects
let ltrCache: ReturnType<typeof createCache> | null = null;
let rtlCache: ReturnType<typeof createCache> | null = null;

function getLtrCache() {
  if (!ltrCache) {
    ltrCache = createCache({ key: 'mui-ltr' });
    ltrCache.compat = true;
  }
  return ltrCache;
}

function getRtlCache() {
  if (!rtlCache) {
    rtlCache = createCache({ key: 'mui-rtl', stylisPlugins: [prefixer, rtlPlugin] });
    rtlCache.compat = true;
  }
  return rtlCache;
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { direction } = useDirection();

  const activeCache = direction === 'rtl' ? getRtlCache() : getLtrCache();

  const themeWithDirection = useMemo(
    () => createTheme({ ...theme, direction }),
    [direction]
  );

  // Collect SSR styles
  useServerInsertedHTML(() => {
    // Only collect LTR styles during SSR (direction is always ltr on server)
    const cache = getLtrCache();
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) return null;

    const insertedNames: string[] = [];
    let styles = '';
    for (const [name, value] of entries) {
      if (typeof value === 'string') {
        insertedNames.push(name);
        styles += value;
      }
    }
    if (insertedNames.length === 0) return null;

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${insertedNames.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={activeCache}>
      <ThemeProvider theme={themeWithDirection}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
