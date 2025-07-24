
"use client";

import { useState, useEffect } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { StoryForm } from "@/components/vivid-voice/StoryForm";
import { StoryDisplay } from "@/components/vivid-voice/StoryDisplay";
import { DialogueEditor } from "@/components/vivid-voice/DialogueEditor";
import { getFullStoryAnalysis, generateMultiVoiceSceneAudio, type CharacterPortrait, type Character, type TranscriptSegment, type DialogueDynamics, type LiteraryDevice, type PacingSegment, type Trope, type ShowDontTellSuggestion, type ConsistencyIssue, type SubtextAnalysis, type SoundEffectWithUrl, type EmotionalTone } from "@/lib/actions";
import { getStoryById } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { chunkTextByParagraph } from "@/lib/chunking";

type AppState = 'initial' | 'loadingStory' | 'analyzing' | 'editing' | 'generating' | 'displaying';
type DialogueSegment = any; // Assuming DialogueSegment is defined elsewhere, or replace with a more specific type.

interface FullAnalysis {
  segments: DialogueSegment[];
  characters: Character[];
  characterPortraits: CharacterPortrait[];
  dialogueDynamics: DialogueDynamics;
  literaryDevices: { devices: LiteraryDevice[] };
  pacing: { segments: PacingSegment[] };
  tropes: { tropes: Trope[] };
  showDontTellSuggestions: { suggestions: ShowDontTellSuggestion[] };
  consistencyIssues: { issues: ConsistencyIssue[] };
  subtextAnalyses: { analyses: SubtextAnalysis[] };
  emotionalTones: { tones: EmotionalTone[] };
  soundEffects: SoundEffectWithUrl[];
}

export default function StagingStoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const storyIdToLoad = searchParams.get('storyId');

  const [appState, setAppState] = useState<AppState>('initial');
  const [storyId, setStoryId] = useState<string | null>(storyIdToLoad);
  const [storyText, setStoryText] = useState<string>('');
  const [fullAnalysis, setFullAnalysis] = useState<FullAnalysis | null>(null);
  const [analysisErrors, setAnalysisErrors] = useState<Record<string, string>>({});
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
            await handleFullAnalysis(story.storyText, story.id);
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
const CHUNK_THRESHOLD = 10000;

export default function StagingStoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const storyIdToLoad = searchParams.get('storyId');

  const [appState, setAppState] = useState<AppState>('initial');
  const [storyId, setStoryId] = useState<string | null>(storyIdToLoad);
  const [storyText, setStoryText] = useState<string>('');
  const [fullAnalysis, setFullAnalysis] = useState<FullAnalysis | null>(null);
  const [analysisErrors, setAnalysisErrors] = useState<Record<string, string>>({});
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
            await handleFullAnalysis(story.storyText, story.id);
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
  const handleFullAnalysis = async (newStoryText: string, existingStoryId: string | null = null) => {
    const isProUser = user?.isPro || false;
    if (isProUser && newStoryText.length > CHUNK_THRESHOLD) {
      return handleFullAnalysisChunked(newStoryText, existingStoryId);
    }

    setAppState('analyzing');
    setError(null);
    setStoryId(existingStoryId);
    setFullAnalysis(null);
    setStoryText('');
    setTranscript([]);

    try {
      const analysisResult = await getFullStoryAnalysis(newStoryText);

      setFullAnalysis(analysisResult);
      setStoryText(newStoryText);
      setAnalysisErrors(analysisResult.errors);

      const errorCount = Object.keys(analysisResult.errors).length;
      if (errorCount > 0) {
        toast({
          variant: "destructive",
          title: `Analysis Incomplete`,
          description: `Encountered ${errorCount} error(s) during analysis. Some tabs may be empty.`
        })
      }

      // Non-critical warning if some portraits failed
      if (!analysisResult.characterPortraits || analysisResult.characterPortraits.length < (analysisResult.characters.filter(c => c.name.toLowerCase() !== 'narrator').length)) {
         toast({
            variant: "default",
            title: "Portrait Generation Note",
            description: "Could not generate all character portraits, but you can continue editing.",
          });
      }

      setAppState('editing');
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred during analysis.";
      setError(errorMessage);
      setAppState('initial');
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: errorMessage,
      });
    }
  };

  const handleFullAnalysisChunked = async (newStoryText: string, existingStoryId: string | null = null) => {
    setAppState('analyzing');
    setError(null);
    setStoryId(existingStoryId);
    setFullAnalysis(null);
    setStoryText('');
    setTranscript([]);

    try {
      const chunks = chunkTextByParagraph(newStoryText);
      let combinedAnalysis: FullAnalysis = {
        segments: [],
        characters: [],
        characterPortraits: [],
        dialogueDynamics: { characterInsights: {}, interactionMatrix: [], summary: '' },
        literaryDevices: { devices: [] },
        pacing: { segments: [] },
        tropes: { tropes: [] },
        showDontTellSuggestions: { suggestions: [] },
        consistencyIssues: { issues: [] },
        subtextAnalyses: { analyses: [] },
        emotionalTones: { tones: [] },
        soundEffects: [],
      };
      let combinedErrors: Record<string, string> = {};

      for (const chunk of chunks) {
        const analysisResult = await getFullStoryAnalysis(chunk);
        combinedAnalysis.segments.push(...analysisResult.segments);
        combinedAnalysis.characters.push(...analysisResult.characters);
        combinedAnalysis.characterPortraits.push(...analysisResult.characterPortraits);
        combinedAnalysis.literaryDevices.devices.push(...analysisResult.literaryDevices.devices);
        combinedAnalysis.pacing.segments.push(...analysisResult.pacing.segments);
        combinedAnalysis.tropes.tropes.push(...analysisResult.tropes.tropes);
        combinedAnalysis.showDontTellSuggestions.suggestions.push(...analysisResult.showDontTellSuggestions.suggestions);
        combinedAnalysis.consistencyIssues.issues.push(...analysisResult.consistencyIssues.issues);
        combinedAnalysis.subtextAnalyses.analyses.push(...analysisResult.subtextAnalyses.analyses);
        combinedAnalysis.emotionalTones.tones.push(...analysisResult.emotionalTones.tones);
        combinedAnalysis.soundEffects.push(...analysisResult.soundEffects);
        Object.assign(combinedErrors, analysisResult.errors);
      }

      // De-duplicate characters and portraits
      const uniqueCharacters = Array.from(new Map(combinedAnalysis.characters.map(char => [char.name, char])).values());
      combinedAnalysis.characters = uniqueCharacters;
      const uniquePortraits = Array.from(new Map(combinedAnalysis.characterPortraits.map(p => [p.name, p])).values());
      combinedAnalysis.characterPortraits = uniquePortraits;

      setFullAnalysis(combinedAnalysis);
      setStoryText(newStoryText);
      setAnalysisErrors(combinedErrors);
      setAppState('editing');
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred during chunked analysis.";
      setError(errorMessage);
      setAppState('initial');
      toast({
        variant: "destructive",
        title: "Chunked Analysis Error",
        description: errorMessage,
      });
    }
  };

  const handleGenerateAudio = async (editedSegments: DialogueSegment[]) => {
    setAppState('generating');
    setError(null);
    
    try {
      // Pass the rich character objects to the audio generation flow.
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

  const isLoading = ['analyzing', 'generating', 'loadingStory'].includes(appState) || authLoading;

  const renderContent = () => {
     if (appState === 'initial' && !isLoading) {
       return (
         <div className="text-center text-foreground/80 h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border/50 rounded-2xl p-8 bg-black/20 backdrop-blur-sm animate-in fade-in duration-700">
             <img src="https://storage.googleapis.com/static.invertase.io/wombat-2-1.png" alt="Skeptical Wombat Mascot" className="w-48 h-48 rounded-full shadow-2xl shadow-primary/20" />
            <p className="font-headline text-3xl mt-4 text-glow-primary">Your Story Awaits</p>
            <p className="max-w-md font-body text-lg">
              Paste your narrative into the box. The Wombat will direct the performance.
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
         analyzing: 'Analyzing Script & Director Notes...',
         generating: 'Recording Scene...',
         initial: 'Authenticating...'
       }
       const currentMessage = appState === 'analyzing'
        ? 'Analyzing Script & Director Notes...'
        : authLoading 
          ? 'Authenticating...'
          : loadingMessages[appState as keyof typeof loadingMessages] || 'Loading...';

       return (
          <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border/50 rounded-2xl p-8 bg-black/20 backdrop-blur-sm animate-in fade-in duration-700">
            <div className="p-4 bg-primary/20 rounded-full text-glow-primary animate-pulse">
                <Sparkles className="w-16 h-16 text-primary"/>
            </div>
            <p className="font-headline text-3xl mt-4 text-glow-primary">
              {currentMessage}
            </p>
          </div>
       );
     }

     if (appState === 'editing' && fullAnalysis) {
       return (
         <div className="animate-in fade-in zoom-in-95 duration-700 slide-in-from-right-8">
           <DialogueEditor 
             storyId={storyId}
             storyText={storyText}
             initialSegments={fullAnalysis.segments}
             characters={fullAnalysis.characters}
             characterPortraits={fullAnalysis.characterPortraits}
             dialogueDynamics={fullAnalysis.dialogueDynamics}
             literaryDevices={fullAnalysis.literaryDevices.devices}
             pacing={fullAnalysis.pacing}
             tropes={fullAnalysis.tropes?.tropes || []}
             showDontTellSuggestions={fullAnalysis.showDontTellSuggestions?.suggestions || []}
             consistencyIssues={fullAnalysis.consistencyIssues?.issues || []}
             subtextAnalyses={fullAnalysis.subtextAnalyses?.analyses || []}
             emotionalTones={fullAnalysis.emotionalTones?.tones || []}
             soundEffects={fullAnalysis.soundEffects || []}
             analysisErrors={analysisErrors}
             onGenerateAudio={handleGenerateAudio}
             isLoading={appState === 'generating'}
             onStorySave={(id) => setStoryId(id)}
           />
         </div>
       );
     }

     if (appState === 'displaying' && sceneAudioUri && fullAnalysis) {
        return (
          <div className="animate-in fade-in zoom-in-95 duration-700 slide-in-from-right-8">
            <StoryDisplay 
             segments={fullAnalysis.segments}
             characterPortraits={fullAnalysis.characterPortraits}
             characters={fullAnalysis.characters}
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
    <div className="relative min-h-screen w-full overflow-hidden bg-wombat-scene">
      <div className="absolute inset-0 z-0">
         {/* The new background is handled by the bg-wombat-scene class on the main wrapper */}
      </div>
      
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl mx-auto">

          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start mt-10">
            <div className={cn(
              "lg:col-span-2 lg:sticky lg:top-8 space-y-8 transition-all duration-700 animate-in fade-in slide-in-from-left-8",
              (appState !== 'initial' && !isLoading) && "lg:opacity-50 lg:pointer-events-none"
            )}>
              <StoryForm onSubmit={(text) => handleFullAnalysis(text)} isLoading={isLoading} />
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
