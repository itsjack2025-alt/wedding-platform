import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Dancing_Script, Cinzel_Decorative } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/branding/ThemeProvider';
import { createBrowserClient } from '@/lib/supabase/client';
import { ROYAL_THEME } from '@wedding/constants/theme';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
});

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Vinay Kumar & Sneha — Wedding Memories',
    template: '%s | Vinay Kumar & Sneha',
  },
  description:
    'Relive every magical moment from Vinay Kumar and Sneha\'s wedding celebration. Browse photos, videos, and memories from their special day.',
  keywords: ['wedding', 'Vinay Kumar', 'Sneha', 'wedding photos', 'wedding film', 'Bengaluru', 'Bidar'],
  openGraph: {
    title: 'Vinay Kumar & Sneha — Wedding Memories',
    description: 'Two souls. One journey. Forever together.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vinay Kumar & Sneha — Wedding Memories',
    description: 'Two souls. One journey. Forever together.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${cormorant.variable} ${dancingScript.variable} ${cinzel.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-wedding-background text-wedding-text font-body antialiased">
        <ThemeProvider initialTheme={ROYAL_THEME}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
