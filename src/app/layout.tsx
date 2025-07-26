'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Header } from '@/components/vivid-voice/Header';
import { type Theme } from '@/lib/types';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('skeptical-wombat');

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.className = `theme-${currentTheme}`;

    // Load theme-specific CSS
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
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Header onThemeChange={handleThemeChange} />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <ThemeToggle currentTheme={currentTheme} onThemeChange={handleThemeChange} />
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
