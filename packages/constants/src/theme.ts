import type { WeddingTheme } from './types';

export const ROYAL_THEME: WeddingTheme = {
  colors: {
    primary: '#c41e3a',      // Deep crimson
    secondary: '#d4af37',     // Luxury gold
    background: '#0f0a0a',    // Near-black with warm undertone
    surface: '#1a1212',      // Dark surface
    text: '#f5f0e6',         // Warm cream
    muted: '#a08060',        // Muted gold
    accent: '#f5d06a',       // Bright gold
    border: 'rgba(212,160,23,0.25)',
  },
  fonts: {
    display: '"Cinzel Decorative", "Playfair Display", serif',
    heading: '"Playfair Display", serif',
    body: '"Cormorant Garamond", serif',
    script: '"Dancing Script", cursive',
  },
};

export const MODERN_THEME: WeddingTheme = {
  colors: {
    primary: '#1a1a2e',      // Deep navy
    secondary: '#e8d5b7',     // Champagne
    background: '#faf8f5',     // Off-white
    surface: '#ffffff',
    text: '#1a1a2e',
    muted: '#6b6b7b',
    accent: '#c9a96e',
    border: 'rgba(201,169,110,0.2)',
  },
  fonts: {
    display: '"Cormorant Garamond", serif',
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif',
    script: '"Dancing Script", cursive',
  },
};

export const FUSION_THEME: WeddingTheme = {
  colors: {
    primary: '#8b1538',      // Maroon
    secondary: '#daa520',     // Goldenrod
    background: '#fffbf0',    // Warm white
    surface: '#f5ede0',
    text: '#2d1810',
    muted: '#7a5c44',
    accent: '#e8b86d',
    border: 'rgba(218,165,32,0.2)',
  },
  fonts: {
    display: '"Cinzel", serif',
    heading: '"Playfair Display", serif',
    body: '"Poppins", sans-serif',
    script: '"Great Vibes", cursive',
  },
};

export const THEMES = {
  royal: ROYAL_THEME,
  modern: MODERN_THEME,
  fusion: FUSION_THEME,
} as const;

export type ThemeName = keyof typeof THEMES;
