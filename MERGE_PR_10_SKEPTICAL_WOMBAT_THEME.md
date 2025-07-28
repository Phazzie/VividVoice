# 🎯 AI Agent: Merge PR #10 - Skeptical Wombat Theme & Layout

## Mission
Add the complete "Skeptical Wombat Theme and Layout" features from PR #10 (`feat/skeptical-wombat-theme`) to the current branch (`feature/prompt-audit-and-improvements`).

## What This PR Adds
A comprehensive theming system with:
- New "Skeptical Wombat" dark theme with professional design
- Client-side theme switching capability
- Enhanced layout system with theme-aware components
- Improved Header component with theme change handler
- New theme toggle component with expanded options

---

## 📋 IMPLEMENTATION TASKS

### Task 1: Create Theme Type Definitions
**File:** `/workspaces/VividVoice/src/lib/types.ts` (NEW FILE)
**Action:** Create theme type system

```typescript
export type Theme = 'blueprint' | 'corporate' | 'living-manuscript' | 'minimalist' | 'playful' | 'skeptical-wombat' | 'sticker-book' | 'hacker';
```

### Task 2: Update Layout to Client-Side with Theme Support
**File:** `/workspaces/VividVoice/src/app/layout.tsx`
**Action:** Convert to client-side layout with theme switching

```tsx
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
```

### Task 3: Update Header Component
**File:** `/workspaces/VividVoice/src/components/vivid-voice/Header.tsx`
**Action:** Add theme change handler prop

Find the Header component and update its props to accept onThemeChange:

```tsx
interface HeaderProps {
  onThemeChange: (theme: Theme) => void;
}

export function Header({ onThemeChange }: HeaderProps) {
  // Keep existing Header implementation but accept the onThemeChange prop
  // This enables theme switching from the header if needed
}
```

### Task 4: Enhanced Theme Toggle Component
**File:** `/workspaces/VividVoice/src/components/ui/ThemeToggle.tsx`
**Action:** Update to support all themes including hacker theme

```tsx
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
```

### Task 5: Update Skeptical Wombat CSS Theme
**File:** `/workspaces/VividVoice/public/themes/skeptical-wombat.css`
**Action:** Ensure the enhanced skeptical wombat theme exists

```css
/* Enhanced Skeptical Wombat Theme */
.theme-skeptical-wombat {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 142 76% 36%;
  --primary-foreground: 355 7% 97%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 142 76% 36%;
  --accent-foreground: 355 7% 97%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 142 76% 36%;
  --radius: 0.5rem;
}

.theme-skeptical-wombat body {
  background: linear-gradient(135deg, hsl(222.2 84% 4.9%) 0%, hsl(217.2 32.6% 17.5%) 100%);
  color: hsl(210 40% 98%);
}

.theme-skeptical-wombat .card-glow-primary {
  box-shadow: 0 0 20px hsla(142, 76%, 36%, 0.3);
}

.theme-skeptical-wombat .text-glow-primary {
  text-shadow: 0 0 10px hsla(142, 76%, 36%, 0.5);
}
```

### Task 6: Add Hacker Theme CSS
**File:** `/workspaces/VividVoice/public/themes/hacker.css` (NEW FILE)
**Action:** Create new hacker theme

```css
/* Hacker Theme */
.theme-hacker {
  --background: 0 0% 0%;
  --foreground: 120 100% 50%;
  --card: 0 0% 5%;
  --card-foreground: 120 100% 50%;
  --popover: 0 0% 5%;
  --popover-foreground: 120 100% 50%;
  --primary: 120 100% 50%;
  --primary-foreground: 0 0% 0%;
  --secondary: 0 0% 10%;
  --secondary-foreground: 120 100% 50%;
  --muted: 0 0% 10%;
  --muted-foreground: 120 50% 50%;
  --accent: 60 100% 50%;
  --accent-foreground: 0 0% 0%;
  --destructive: 0 100% 50%;
  --destructive-foreground: 120 100% 50%;
  --border: 0 0% 20%;
  --input: 0 0% 10%;
  --ring: 120 100% 50%;
  --radius: 0rem;
}

.theme-hacker {
  font-family: 'Courier New', monospace;
}

.theme-hacker body {
  background: #000000;
  background-image: 
    linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  color: #00ff00;
}

.theme-hacker .card-glow-primary {
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
}

.theme-hacker .text-glow-primary {
  text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
}

.theme-hacker button {
  border: 1px solid #00ff00;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.theme-hacker button:hover {
  background: rgba(0, 255, 0, 0.1);
  box-shadow: 0 0 10px #00ff00;
}
```

### Task 7: Create Alternative Layout Components (Optional)
**File:** `/workspaces/VividVoice/src/components/vivid-voice/skeptical-wombat-layout.tsx` (NEW FILE)
**Action:** Create theme-specific layout if needed

```tsx
'use client';

import { ReactNode } from 'react';

interface SkepticalWombatLayoutProps {
  children: ReactNode;
}

export function SkepticalWombatLayout({ children }: SkepticalWombatLayoutProps) {
  return (
    <div className="skeptical-wombat-layout">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Task 8: Create Hacker Layout Component (Optional)
**File:** `/workspaces/VividVoice/src/components/vivid-voice/hacker-layout.tsx` (NEW FILE)
**Action:** Create hacker-specific layout

```tsx
'use client';

import { ReactNode } from 'react';

interface HackerLayoutProps {
  children: ReactNode;
}

export function HackerLayout({ children }: HackerLayoutProps) {
  return (
    <div className="hacker-layout font-mono">
      <div className="bg-black text-green-500 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="border border-green-500 p-4 mb-4">
            <pre className="text-xs">
{`> ACCESSING VIVID_VOICE_SYSTEM...
> AUTHENTICATION: [APPROVED]
> LOADING NARRATIVE_ANALYSIS_MODULE...
> READY FOR INPUT...`}
            </pre>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ VERIFICATION

After implementation, verify:
1. `npm run typecheck` passes
2. `npm run lint` passes  
3. `npm run build` succeeds
4. Theme toggle appears in bottom-right corner
5. All themes (including Skeptical Wombat and Hacker) work correctly
6. Layout switches properly between themes
7. Header component accepts theme change prop
8. Theme persistence works across page refreshes

## 🎯 Expected Result
Users will have a fully functional theming system with:
- Professional "Skeptical Wombat" dark theme as default
- Optional "Hacker" theme for a terminal aesthetic
- Smooth theme switching with proper CSS loading
- Theme-aware components and layouts
- Persistent theme selection

## 🚨 Important Notes
- This PR focuses on theming infrastructure
- Ensures all existing components work with new themes
- Maintains backward compatibility with existing functionality
- Provides foundation for future theme additions
