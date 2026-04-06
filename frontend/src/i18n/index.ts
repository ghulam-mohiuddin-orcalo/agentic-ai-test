import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';

export const RTL_LANGUAGES = ['ar', 'ur'];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' as const },
  { code: 'ur', label: 'Urdu', nativeLabel: '\u0627\u0631\u062f\u0648', dir: 'rtl' as const },
  { code: 'ar', label: 'Arabic', nativeLabel: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', dir: 'rtl' as const },
];

export function getDirection(lang: string): 'ltr' | 'rtl' {
  return RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
}

const STORAGE_KEY = 'nexusai_language';

// Always initialize with English so SSR and first client render match.
// Language is switched AFTER mount via applySavedLanguage().
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
      ar: { translation: ar },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Force language to 'en' synchronously on the client to ensure hydration match.
// i18next may retain a cached language from a previous session or HMR cycle.
// This runs BEFORE any React component renders.
if (typeof window !== 'undefined' && i18n.language !== 'en') {
  i18n.changeLanguage('en');
}

/**
 * Reads saved language from localStorage and applies it after mount.
 * Must be called inside a useEffect (client-only) to avoid hydration mismatch.
 */
export function applySavedLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      i18n.changeLanguage(saved);
      return saved;
    }
  } catch {
    // localStorage unavailable
  }
  return null;
}

/**
 * Persist language choice to localStorage.
 */
export function persistLanguage(lang: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // localStorage unavailable
  }
}

export default i18n;
