'use client';

import { useState, useEffect } from 'react';
import i18n, { getDirection } from '@/i18n';

export function useDirection() {
  // Always start 'ltr' for SSR/hydration consistency
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // Set direction based on current language (applied by Providers)
    const updateDirection = (lang: string) => {
      const dir = getDirection(lang);
      setDirection(dir);
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
    };

    // Set initial direction
    updateDirection(i18n.language);

    // Listen for future changes
    i18n.on('languageChanged', updateDirection);
    return () => {
      i18n.off('languageChanged', updateDirection);
    };
  }, []);

  return { direction };
}
