import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark' | 'unconventional' | 'crt';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'unconventional', 'crt'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Button onClick={cycleTheme} variant="outline" size="icon">
      {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
      {theme === 'unconventional' && <span className="text-glow">U</span>}
      {theme === 'crt' && <span className="text-flicker">C</span>}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
