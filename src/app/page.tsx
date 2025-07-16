
"use client";

import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { StoryForm } from "@/components/vivid-voice/StoryForm";
import { StoryDisplay } from "@/components/vivid-voice/StoryDisplay";
import { DialogueEditor } from "@/components/vivid-voice/DialogueEditor";
import { type DialogueSegment, type StorySegmentWithAudio, getParsedStory, getCharacterPortraits, generateStoryAudio, type CharacterPortrait, type Character } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AppState = 'initial' | 'parsing' | 'editing' | 'generating' | 'displaying';

export default function VividVoicePage() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [storyText, setStoryText] = useState<string>('');
  const [parsedSegments, setParsedSegments] = useState<DialogueSegment[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterPortraits, setCharacterPortraits] = useState<CharacterPortrait[]>([]);
  const [finalSegments, setFinalSegments] = useState<StorySegmentWithAudio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleParseStory = async (newStoryText: string) => {
    setAppState('parsing');
    setError(null);
    setParsedSegments([]);
    setCharacterPortraits([]);
    setStoryText('');

    try {
      // Step 1: Parse the story to get segments and character definitions (including AI-chosen voices).
      const { segments, characters } = await getParsedStory(newStoryText);
      setParsedSegments(segments);
      setCharacters(characters);
      setStoryText(newStoryText);
      
      // Step 2 (in parallel): Generate character portraits. This is non-critical.
      // We don't need to await this to show the editor. We can update the state when it's done.
      getCharacterPortraits(characters).then(portraits => {
        setCharacterPortraits(portraits);
      }).catch(e => {
        // Log the error but don't block the user.
         console.error("Non-critical error: Failed to generate portraits.", e);
         toast({
            variant: "default",
            title: "Portrait Generation Note",
            description: "Could not generate all character portraits, but you can continue editing.",
          });
      });

      setAppState('editing');
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred during parsing.";
      setError(errorMessage);
      setAppState('initial');
      toast({
        variant: "destructive",
        title: "Parsing Error",
        description: errorMessage,
      });
    }
  };

  const handleGenerateAudio = async (editedSegments: DialogueSegment[]) => {
    setAppState('generating');
    setError(null);
    
    try {
      const result = await generateStoryAudio(editedSegments, characters);
      setFinalSegments(result);
      setAppState('displaying');
    } catch (e: any) {
       const errorMessage = e.message || "An unexpected error occurred during audio generation.";
      setError(errorMessage);
      setAppState('editing'); // Go back to editor if audio fails
      toast({
        variant: "destructive",
        title: "Audio Generation Error",
        description: errorMessage,
      });
    }
  };

  const handleBackToEditor = () => {
    setAppState('editing');
  }

  const isLoading = appState === 'parsing' || appState === 'generating';

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
              (appState === 'editing' || appState === 'displaying') && "lg:opacity-50 lg:pointer-events-none"
            )}>
              <StoryForm onSubmit={handleParseStory} isLoading={appState === 'parsing'} />
            </div>
            
            <div className="lg:col-span-3 min-h-[60vh]">
              {appState === 'initial' && !isLoading && (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-8 bg-black/20 backdrop-blur-sm animate-in fade-in duration-700">
                   <div className="p-4 bg-accent/20 rounded-full text-glow-accent">
                      <Wand2 className="w-16 h-16 text-accent"/>
                   </div>
                  <p className="font-headline text-3xl mt-4 text-glow-accent">Your Story Awaits</p>
                  <p className="max-w-md font-serif text-lg">
                    Paste your narrative into the box to begin. The AI will parse it, generate character portraits, and then you can edit emotions before generating the final audio.
                  </p>
                </div>
              )}

              {(appState === 'parsing' || appState === 'generating') && (
                 <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-8 bg-black/20 backdrop-blur-sm animate-in fade-in duration-700">
                   <div className="p-4 bg-primary/20 rounded-full text-glow-primary animate-pulse">
                      <Sparkles className="w-16 h-16 text-primary"/>
                   </div>
                  <p className="font-headline text-3xl mt-4 text-glow-primary">
                    {appState === 'parsing' ? 'Analyzing Story & Characters...' : 'Generating Audio...'}
                  </p>
                </div>
              )}

              {appState === 'editing' && (
                <div className="animate-in fade-in zoom-in-95 duration-700 slide-in-from-right-8">
                  <DialogueEditor 
                    storyText={storyText}
                    initialSegments={parsedSegments}
                    characterPortraits={characterPortraits}
                    onGenerateAudio={handleGenerateAudio}
                    isLoading={appState === 'generating'}
                  />
                </div>
              )}
              
              {appState === 'displaying' && finalSegments.length > 0 && (
                 <div className="animate-in fade-in zoom-in-95 duration-700 slide-in-from-right-8">
                   <StoryDisplay 
                    segments={finalSegments} 
                    characterPortraits={characterPortraits}
                    characters={characters}
                    storyText={storyText}
                    onBack={handleBackToEditor}
                  />
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
