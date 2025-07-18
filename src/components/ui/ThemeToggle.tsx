import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Brush, Briefcase, Smile, Book, Edit, Star, Meh } from 'lucide-react';

type Theme = 'light' | 'dark' | 'unconventional' | 'crt' | 'minimalist' | 'corporate' | 'playful' | 'living-manuscript' | 'blueprint' | 'sticker-book' | 'skeptical-wombat';

export function ThemeToggle({ onThemeChange }: { onThemeChange: (theme: Theme) => void }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.body.className = theme;
    onThemeChange(theme);
  }, [theme, onThemeChange]);

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'unconventional', 'crt', 'minimalist', 'corporate', 'playful', 'living-manuscript', 'blueprint', 'sticker-book', 'skeptical-wombat'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Button onClick={cycleTheme} variant="outline" size="icon">
      {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'unconventional' && <Brush className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'crt' && <span className="text-flicker">C</span>}
      {theme === 'minimalist' && <span className="font-mono text-sm">M</span>}
      {theme === 'corporate' && <Briefcase className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'playful' && <Smile className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'living-manuscript' && <Book className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'blueprint' && <Edit className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'sticker-book' && <Star className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'skeptical-wombat' && <Meh className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
