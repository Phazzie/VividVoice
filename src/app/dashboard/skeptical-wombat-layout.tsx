import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/vivid-voice/Header';
import { Theme } from '@/lib/types';

const SkepticalWombatLayout = ({ children, onThemeChange }: { children: React.ReactNode, onThemeChange: (theme: Theme) => void }) => {
  return (
    <div className="h-screen w-full bg-background text-foreground font-serif grid grid-cols-12 grid-rows-6 gap-4 p-4">
      <div className="col-span-12 row-span-1">
        <Header onThemeChange={onThemeChange} />
      </div>
      <div className="col-span-3 row-span-5 border-r border-border pr-4">
        <Sidebar />
      </div>
      <div className="col-span-9 row-span-5 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SkepticalWombatLayout;
