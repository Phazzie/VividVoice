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
