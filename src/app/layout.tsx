'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/vivid-voice/Header';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useState, useEffect } from 'react';
import { type Theme } from '@/lib/types';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className="antialiased min-h-screen bg-background text-foreground">
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
