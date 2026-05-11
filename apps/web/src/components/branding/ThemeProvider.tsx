'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { WeddingTheme } from '@wedding/constants/types';

const ROYAL_THEME: WeddingTheme = {
  colors: {
    primary: '#c41e3a',
    secondary: '#d4af37',
    background: '#0f0a0a',
    surface: '#1a1212',
    text: '#f5f0e6',
    muted: '#a08060',
    accent: '#f5d06a',
    border: 'rgba(212,160,23,0.25)',
  },
  fonts: {
    display: 'var(--font-cinzel), "Cinzel Decorative", serif',
    heading: 'var(--font-playfair), "Playfair Display", serif',
    body: 'var(--font-cormorant), "Cormorant Garamond", serif',
    script: 'var(--font-dancing), "Dancing Script", cursive',
  },
};

interface ThemeContextValue {
  theme: WeddingTheme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: ROYAL_THEME,
  isDark: true,
});

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: WeddingTheme;
}) {
  const [theme, setTheme] = useState<WeddingTheme>(initialTheme ?? ROYAL_THEME);

  // Check system preference for dark mode
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    setIsDark(!mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(!e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const colors = theme.colors;
    const fonts = theme.fonts;

    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-muted', colors.muted);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--font-display', fonts.display);
    root.style.setProperty('--font-heading', fonts.heading);
    root.style.setProperty('--font-body', fonts.body);
    root.style.setProperty('--font-script', fonts.script);

    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    root.classList.toggle('light', !isDark);
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
