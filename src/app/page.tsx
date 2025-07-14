"use client";

import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { StoryForm } from "@/components/vivid-voice/StoryForm";
import { StoryDisplay } from "@/components/vivid-voice/StoryDisplay";
import { type StorySegmentWithAudio, processStory } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function VividVoicePage() {
  const [segments, setSegments] = useState<StorySegmentWithAudio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage);
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
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-muted to-background">
      <main className="w-full max-w-4xl flex flex-col gap-8">
        <header className="text-center space-y-2">
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-gradient bg-gradient-to-r from-primary via-accent to-primary">
            VividVoice
          </h1>
          <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
            Bring your stories to life with AI <Sparkles className="w-5 h-5 text-accent" />
          </p>
        </header>

        <StoryForm onSubmit={handleGenerateStory} isLoading={isLoading} />
        
        {error && (
          <div className="text-center p-4 rounded-lg bg-destructive/10 text-destructive">
            <p>{error}</p>
          </div>
        )}
        
        {segments.length > 0 && (
           <div className="animate-in fade-in duration-500">
             <StoryDisplay segments={segments} />
           </div>
        )}

        {!isLoading && segments.length === 0 && !error && (
          <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-4 border-2 border-dashed rounded-xl">
             <BookOpen className="w-16 h-16 "/>
            <p className="font-headline text-2xl">Your story awaits</p>
            <p className="max-w-md">Paste your narrative into the box above and let our AI create a unique audio experience for you.</p>
          </div>
        )}
      </main>
      <footer className="w-full max-w-4xl text-center mt-12 py-4">
        <p className="text-sm text-muted-foreground">Powered by Firebase and Google AI</p>
      </footer>
    </div>
  );
}
