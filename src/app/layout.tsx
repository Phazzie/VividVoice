'use client';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/vivid-voice/Header';
import { Belleza, Alegreya } from 'next/font/google';
import { useState } from 'react';
import HackerLayout from './dashboard/hacker-layout';
import SkepticalWombatLayout from './dashboard/skeptical-wombat-layout';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// export const metadata: Metadata = {
//   title: 'Staging Stories with the Skeptical Wombat',
//   description: 'AI-powered narrative story reader with expressive voice acting.',
// };

const belleza = Belleza({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-headline',
});

const alegreya = Alegreya({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
});

type Theme = 'light' | 'dark' | 'unconventional' | 'crt' | 'minimalist' | 'corporate' | 'playful' | 'living-manuscript' | 'blueprint' | 'sticker-book' | 'skeptical-wombat' | 'hacker';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<Theme>('dark');

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      document.body.className = '';
      document.body.classList.add(newTheme);
    }
  };

  const renderLayout = () => {
    if (theme === 'hacker') {
      return (
        <HackerLayout>
          <ThemeToggle onThemeChange={handleThemeChange} />
          {children}
        </HackerLayout>
      );
    }

    if (theme === 'skeptical-wombat') {
      return (
        <SkepticalWombatLayout>
          {children}
        </SkepticalWombatLayout>
      );
    }

    return (
      <>
        <Header onThemeChange={handleThemeChange} />
        <main>{children}</main>
      </>
    )
  }

  return (
    <html lang="en" className={`${belleza.variable} ${alegreya.variable} ${theme}`}>
      <body className="antialiased min-h-screen bg-background text-foreground font-body">
        <AuthProvider>
          {renderLayout()}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
