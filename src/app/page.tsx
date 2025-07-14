"use client";

import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { StoryForm } from "@/components/vivid-voice/StoryForm";
import { StoryDisplay } from "@/components/vivid-voice/StoryDisplay";
import { type StorySegmentWithAudio, processStory } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function VividVoicePage() {
  const [segments, setSegments] = useState<StorySegmentWithAudio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(false);
  const { toast } = useToast();

  const handleGenerateStory = async (storyText: string) => {
    setIsLoading(true);
    setError(null);
    setSegments([]);

    try {
      const result = await processStory(storyText);
      if (!result || result.length === 0) {
        throw new Error("Failed to parse the story. Please check the text format.");
      }
      setSegments(result);
      setShowStory(true);
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage);
      setShowStory(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background"></div>
        <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full bg-primary/20 blur-[150px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full bg-secondary/20 blur-[150px] opacity-30 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <header className="text-center space-y-4 mb-10">
            <h1 className="font-headline text-6xl md:text-8xl font-bold text-glow-primary text-gradient bg-gradient-to-r from-primary via-accent to-secondary animate-in fade-in slide-in-from-top-4 duration-1000">
              VividVoice
            </h1>
            <p className="text-muted-foreground text-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-6 duration-1000 delay-200">
              AI-Powered Expressive Storytelling <Sparkles className="w-5 h-5 text-accent text-glow-accent" />
            </p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className={cn(
              "lg:col-span-2 lg:sticky lg:top-8 space-y-8 transition-all duration-700 animate-in fade-in slide-in-from-left-8",
            )}>
              <StoryForm onSubmit={handleGenerateStory} isLoading={isLoading} />
              {error && (
                <div className="text-center p-4 rounded-lg bg-destructive/20 text-destructive-foreground font-semibold animate-in fade-in">
                  <p>{error}</p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-3 min-h-[60vh]">
              {showStory && segments.length > 0 && (
                 <div className="animate-in fade-in zoom-in-95 duration-700 slide-in-from-right-8">
                   <StoryDisplay segments={segments} />
                 </div>
              )}

              {!isLoading && !showStory && (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-8 bg-black/20 backdrop-blur-sm animate-in fade-in duration-700">
                   <div className="p-4 bg-accent/20 rounded-full text-glow-accent">
                      <Wand2 className="w-16 h-16 text-accent"/>
                   </div>
                  <p className="font-headline text-3xl mt-4 text-glow-accent">Your Story Awaits</p>
                  <p className="max-w-md font-serif text-lg">
                    Paste your narrative into the box and let our AI create a unique audio experience for you.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
        <footer className="w-full max-w-4xl text-center mt-16 py-4">
          <p className="text-sm text-muted-foreground">Powered by Firebase and Google AI</p>
        </footer>
      </div>
    </div>
  );
}
