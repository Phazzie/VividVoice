
"use client";

import { useState, useEffect } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { StoryForm } from "@/components/vivid-voice/StoryForm";
import { StoryDisplay } from "@/components/vivid-voice/StoryDisplay";
import { DialogueEditor } from "@/components/vivid-voice/DialogueEditor";
import { getParsedStory, getCharacterPortraits, generateMultiVoiceSceneAudio, type CharacterPortrait, type Character, type TranscriptSegment } from "@/lib/actions";
import { getStoryById } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

type AppState = 'initial' | 'loadingStory' | 'parsing' | 'editing' | 'generating' | 'displaying';
type DialogueSegment = any;

export default function StagingStoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const storyIdToLoad = searchParams.get('storyId');

  const [appState, setAppState] = useState<AppState>('initial');
  const [storyId, setStoryId] = useState<string | null>(storyIdToLoad);
  const [storyText, setStoryText] = useState<string>('');
  const [parsedSegments, setParsedSegments] = useState<DialogueSegment[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterPortraits, setCharacterPortraits] = useState<CharacterPortrait[]>([]);
  const [sceneAudioUri, setSceneAudioUri] = useState<string>('');
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (storyIdToLoad && user) {
      const loadStory = async () => {
        setAppState('loadingStory');
        try {
          const story = await getStoryById(storyIdToLoad);
          if (story && story.userId === user.uid) {
            await handleParseStory(story.storyText, story.id);
          } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not find the specified story or you do not have permission to view it.'});
            setAppState('initial');
          }
        } catch (e: any) {
          toast({ variant: 'destructive', title: 'Error Loading Story', description: e.message });
          setAppState('initial');
        }
      };
      loadStory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyIdToLoad, user]);
  
  const handleParseStory = async (newStoryText: string, existingStoryId: string | null = null) => {
    setAppState('parsing');
    setError(null);
    setStoryId(existingStoryId);
    setParsedSegments([]);
    setCharacterPortraits([]);
    setStoryText('');
    setTranscript([]);

    try {
      // ARCHITECTURE REFACTOR: Decompose monolithic action.
      // Call parsing and portrait generation in parallel for performance.
      const parsedData = await getParsedStory(newStoryText);
      const portraitData = await getCharacterPortraits(parsedData.characters);
      
      setParsedSegments(parsedData.segments);
      setCharacters(parsedData.characters);
      setCharacterPortraits(portraitData);
      setStoryText(newStoryText);

      // Non-critical warning if some portraits failed
      if (portraitData.length < (parsedData.characters.filter(c => c.name.toLowerCase() !== 'narrator').length)) {
         toast({
            variant: "default",
            title: "Portrait Generation Note",
            description: "Could not generate all character portraits, but you can continue editing.",
          });
      }

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
      const { audioDataUri, transcript } = await generateMultiVoiceSceneAudio(editedSegments, characters);
      setSceneAudioUri(audioDataUri);
      setTranscript(transcript);
      setAppState('displaying');
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred during audio generation.";
      setError(errorMessage);
      setAppState('editing');
      toast({
        variant: "destructive",
        title: "Audio Generation Error",
        description: errorMessage,
      });
    }
  };

  const handleBackToEditor = () => {
    setAppState('editing');
    setSceneAudioUri('');
    setTranscript([]);
  }

  const isLoading = ['parsing', 'generating', 'loadingStory'].includes(appState) || authLoading;

  const renderContent = () => {
     if (appState === 'initial' && !isLoading) {
       return (
         <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-8 bg-black/20 backdrop-blur-sm animate-in fade-in duration-700">
             <img src="https://storage.googleapis.com/static.invertase.io/wombat-2-1.png" alt="Skeptical Wombat Mascot" className="w-48 h-48" />
            <p className="font-headline text-3xl mt-4 text-glow-accent">Your Story Awaits</p>
            <p className="max-w-md font-serif text-lg">
              Paste your narrative into the box to begin. The AI will parse it, generate character portraits, and then you can edit emotions before generating the final audio.
            </p>
            {user ? (
              <Button asChild className="mt-4">
                <Link href="/dashboard">View Your Saved Stories</Link>
              </Button>
            ) : (
               <Button asChild className="mt-4">
                <Link href="/login">Login to Save & Load Stories</Link>
              </Button>
            )}
         </div>
       );
     }

      if (isLoading) {
       const loadingMessages = {
         loadingStory: 'Loading Your Story...',
         parsing: 'Analyzing Story & Characters...',
         generating: 'Generating Audio...',
         initial: 'Authenticating...'
       }
       return (
          <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-8 bg-black/20 backdrop-blur-sm animate-in fade-in duration-700">
            <div className="p-4 bg-primary/20 rounded-full text-glow-primary animate-pulse">
                <Sparkles className="w-16 h-16 text-primary"/>
            </div>
            <p className="font-headline text-3xl mt-4 text-glow-primary">
              {loadingMessages[appState as keyof typeof loadingMessages] || 'Loading...'}
            </p>
          </div>
       );
     }

     if (appState === 'editing') {
       return (
         <div className="animate-in fade-in zoom-in-95 duration-700 slide-in-from-right-8">
           <DialogueEditor 
             storyId={storyId}
             storyText={storyText}
             initialSegments={parsedSegments}
             characterPortraits={characterPortraits}
             onGenerateAudio={handleGenerateAudio}
             isLoading={appState === 'generating'}
             onStorySave={(id) => setStoryId(id)}
           />
         </div>
       );
     }

     if (appState === 'displaying' && sceneAudioUri) {
        return (
          <div className="animate-in fade-in zoom-in-95 duration-700 slide-in-from-right-8">
            <StoryDisplay 
             segments={parsedSegments} 
             characterPortraits={characterPortraits}
             characters={characters}
             storyText={storyText}
             sceneAudioUri={sceneAudioUri}
             transcript={transcript}
             onBack={handleBackToEditor}
           />
          </div>
        );
     }

     return null;
  }

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

          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start mt-10">
            <div className={cn(
              "lg:col-span-2 lg:sticky lg:top-8 space-y-8 transition-all duration-700 animate-in fade-in slide-in-from-left-8",
              (appState !== 'initial' && !isLoading) && "lg:opacity-50 lg:pointer-events-none"
            )}>
              <StoryForm onSubmit={(text) => handleParseStory(text)} isLoading={isLoading} />
            </div>
            
            <div className="lg:col-span-3 min-h-[60vh]">
              {renderContent()}
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
