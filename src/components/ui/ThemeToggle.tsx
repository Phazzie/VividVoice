'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';
import { type Theme } from '@/lib/types';

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes: { value: Theme; label: string }[] = [
  { value: 'blueprint', label: 'Blueprint' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'living-manuscript', label: 'Living Manuscript' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'playful', label: 'Playful' },
  { value: 'skeptical-wombat', label: 'Skeptical Wombat' },
  { value: 'sticker-book', label: 'Sticker Book' },
  { value: 'hacker', label: 'Hacker' },
];

export function ThemeToggle({ currentTheme, onThemeChange }: ThemeToggleProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
            <Palette className="h-4 w-4" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background/90 backdrop-blur-sm">
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => onThemeChange(theme.value)}
              className={currentTheme === theme.value ? 'bg-accent' : ''}
            >
              {theme.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
