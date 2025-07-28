'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Header } from '@/components/vivid-voice/Header';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { type Theme } from '@/lib/types';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Staging Stories with the Skeptical Wombat',
  description:
    'AI-powered narrative story reader with expressive voice acting. Transform your stories into immersive audio experiences with advanced AI analysis.',
  keywords: ['AI', 'voice acting', 'story analysis', 'text-to-speech', 'narrative', 'fiction writing'],
  authors: [{ name: 'VividVoice Team' }],
  creator: 'VividVoice',
  openGraph: {
    title: 'Staging Stories with the Skeptical Wombat',
    description:
      'Transform your stories into immersive audio experiences with AI-powered voice acting and narrative analysis.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staging Stories with the Skeptical Wombat',
    description: 'AI-powered narrative story reader with expressive voice acting.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('skeptical-wombat');

  useEffect(() => {
    document.documentElement.className = `theme-${currentTheme}`;

    const existingLink = document.querySelector('link[data-theme]');
    if (existingLink) {
      existingLink.remove();
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/${currentTheme}.css`;
    link.setAttribute('data-theme', currentTheme);
    document.head.appendChild(link);
  }, [currentTheme]);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  return (
    <html lang="en" className="dark">
      <body className={`antialiased min-h-screen bg-background text-foreground ${inter.className}`}> 
        <ErrorBoundary>
          <AuthProvider>
            <Header onThemeChange={handleThemeChange} />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <ThemeToggle currentTheme={currentTheme} onThemeChange={handleThemeChange} />
            <Toaster />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
