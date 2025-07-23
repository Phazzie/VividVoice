import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/vivid-voice/Header';
import { StoryForm } from '@/components/vivid-voice/StoryForm';
import { StoryDisplay } from '@/components/vivid-voice/StoryDisplay';
import { ActorStudio } from '@/components/vivid-voice/ActorStudio';
import { PacingAnalysis } from '@/components/vivid-voice/PacingAnalysis';
import { DialogueDynamicsAnalysis } from '@/components/vivid-voice/DialogueDynamicsAnalysis';
import { LiteraryAnalysis } from '@/components/vivid-voice/LiteraryAnalysis';
import { PerspectiveShifter } from '@/components/vivid-voice/PerspectiveShifter';
import { ShowDontTell } from '@/components/vivid-voice/ShowDontTell';
import { TropeInverter } from '@/components/vivid-voice/TropeInverter';
import { UnreliableNarrator } from '@/components/vivid-voice/UnreliableNarrator';
import { ConsistencyGuardian } from '@/components/vivid-voice/ConsistencyGuardian';
import { SubtextAnalyzer } from '@/components/vivid-voice/SubtextAnalyzer';
import { SkepticalWombat } from '@/components/vivid-voice/SkepticalWombat';

const HackerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full bg-dark-purple text-neon-green font-mono grid grid-cols-12 grid-rows-6 gap-2 p-2">
      <div className="col-span-3 row-span-6 border border-neon-blue p-2 overflow-y-auto">
        <h2 className="text-neon-pink glow">VividVoice OS</h2>
        <Sidebar />
      </div>
      <div className="col-span-6 row-span-4 border border-neon-blue p-2 overflow-y-auto">
        <h2 className="text-neon-pink glow">Mainframe</h2>
        {children}
      </div>
      <div className="col-span-3 row-span-2 border border-neon-blue p-2 overflow-y-auto">
        <h2 className="text-neon-pink glow">Comms</h2>
        <ActorStudio />
      </div>
      <div className="col-span-3 row-span-4 border border-neon-blue p-2 overflow-y-auto">
        <h2 className="text-neon-pink glow">Diagnostics</h2>
        <PacingAnalysis />
        <DialogueDynamicsAnalysis />
      </div>
      <div className="col-span-6 row-span-2 border border-neon-blue p-2 overflow-y-auto">
        <h2 className="text-neon-pink glow">Subroutines</h2>
        <div className="grid grid-cols-3 gap-2">
            <LiteraryAnalysis />
            <PerspectiveShifter />
            <ShowDontTell />
            <TropeInverter />
            <UnreliableNarrator />
            <ConsistencyGuardian />
            <SubtextAnalyzer />
            <SkepticalWombat />
        </div>
      </div>
    </div>
  );
};

export default HackerLayout;
