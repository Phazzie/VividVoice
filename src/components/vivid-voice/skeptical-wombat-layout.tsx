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
