
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { type DialogueSegment, type CharacterPortrait, type Character, shiftPerspective, generateElevenLabsAudio } from '@/lib/actions';
import { saveStory } from '@/lib/data';
import { Wand2, Loader2, Edit, Save, BookText, FlaskConical, BarChart3, VenetianMask, MessageSquareQuote, Shuffle, Eye, ShieldCheck, AreaChart, Users } from 'lucide-react';
import { cn, getCharacterColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';

import { LiteraryAnalysisTab } from '@/components/vivid-voice/LiteraryAnalysis';
import { DialogueDynamicsAnalysis } from '@/components/vivid-voice/DialogueDynamicsAnalysis';
import { TropeInverter } from '@/components/vivid-voice/TropeInverter';
import { ActorStudio } from '@/components/vivid-voice/ActorStudio';
import { UnreliableNarrator } from '@/components/vivid-voice/UnreliableNarrator';
import { PacingAnalysis } from '@/components/vivid-voice/PacingAnalysis';
import { ShowDontTell } from './ShowDontTell';
import { ConsistencyGuardian } from './ConsistencyGuardian';
import { SubtextAnalyzer } from './SubtextAnalyzer';
import { PerspectiveShifter } from './PerspectiveShifter';
import { PlaceholderTool } from './PlaceholderTool';
import { AudioPlayer } from './AudioPlayer';
import { SkepticalWombat } from './SkepticalWombat';
import { CharacterArchetypes } from './CharacterArchetypes';
import { PlotStructure } from './PlotStructure';
import { PacingVisualizer } from './PacingVisualizer';
import { CompareToClassics } from './CompareToClassics';

import { type DialogueDynamics, type LiteraryDevice, type PacingSegment, type Trope, type ShowDontTellSuggestion, type ConsistencyIssue, type SubtextAnalysis, type SoundEffectWithUrl } from '@/lib/actions';

type DialogueEditorProps = {
  storyId: string | null;
  storyText: string;
  initialSegments: DialogueSegment[];
  characters: Character[];
  characterPortraits: CharacterPortrait[];
  dialogueDynamics: DialogueDynamics;
  literaryDevices: LiteraryDevice[];
  pacing: { segments: PacingSegment[] };
  tropes: Trope[];
  showDontTellSuggestions: ShowDontTellSuggestion[];
  consistencyIssues: ConsistencyIssue[];
  subtextAnalyses: SubtextAnalysis[];
  soundEffects: SoundEffectWithUrl[];
  analysisErrors: Record<string, string>;
  onGenerateAudio: (segments: DialogueSegment[]) => void;
  isLoading: boolean;
  onStorySave: (id: string) => void;
};

export const emotionOptions = [
  "Neutral", "Happy", "Sad", "Angry", "Anxious", "Excited", "Intrigued", "Sarcastic", "Whispering", "Shouting", "Fearful", "Amused", "Serious", "Playful"
];

export function DialogueEditor({
  storyId,
  storyText,
  initialSegments,
  characters,
  characterPortraits,
  dialogueDynamics,
  literaryDevices,
  pacing,
  tropes,
  showDontTellSuggestions,
  consistencyIssues,
  subtextAnalyses,
  soundEffects,
  analysisErrors,
  onGenerateAudio,
  isLoading,
  onStorySave,
}: DialogueEditorProps) {
  const [segments, setSegments] = useState<DialogueSegment[]>(initialSegments.map(s => ({ ...s, isGenerating: false })));
  const [storyTitle, setStoryTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [ttsEngine, setTtsEngine] = useState('standard');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDialogueChange = (index: number, value: string) => {
    const newSegments = [...segments];
    newSegments[index].dialogue = value;
    setSegments(newSegments);
  };

  const handleEmotionChange = (index: number, value: string) => {
    const newSegments = [...segments];
    newSegments[index].emotion = value;
    setSegments(newSegments);
  };

  const handleApplySuggestion = (originalText: string, newText: string) => {
    const newSegments = segments.map(segment => {
      if (segment.dialogue.trim() === originalText.trim()) {
        return { ...segment, dialogue: newText };
      }
      return segment;
    });
    setSegments(newSegments);
    toast({
      title: "Suggestion Applied",
      description: "The dialogue has been updated in the editor.",
    });
  };

  const handleSubmit = async () => {
    if (ttsEngine === 'elevenlabs') {
      setSegments(segments.map(s => ({ ...s, isGenerating: true })));
      const audioPromises = segments.map(async (segment) => {
        if (segment.dialogue.trim() === '') {
          return { ...segment, audioDataUri: '', isGenerating: false };
        }
        // This is a simplified approach. In a real app, you'd want to get the voice ID from the character
        const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Default voice
        const audioDataUri = await generateElevenLabsAudio(segment.dialogue, voiceId);
        return { ...segment, audioDataUri, isGenerating: false };
      });

      const newSegments = await Promise.all(audioPromises);
      setSegments(newSegments);
      // We are not calling onGenerateAudio here because we are handling the audio generation in the component
    } else {
      onGenerateAudio(segments);
    }
  };

  const handleSaveStory = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not Logged In', description: 'You must be logged in to save a story.' });
      return;
    }
    if (!storyTitle.trim()) {
      toast({ variant: 'destructive', title: 'Title Required', description: 'Please enter a title for your story.' });
      return;
    }

    setIsSaving(true);
    try {
      const fullStoryText = segments.map(s => s.character === 'Narrator' ? s.dialogue : `${s.character}: ${s.dialogue}`).join('\n');
      const storyData: any = { title: storyTitle, storyText: fullStoryText, userId: user.uid };
      if (storyId) {
        storyData.id = storyId;
      }
      const savedStoryId = await saveStory(storyData);
      onStorySave(savedStoryId);
      toast({ title: 'Story Saved!', description: `"${storyTitle}" has been saved successfully.` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error Saving Story', description: e.message });
    } finally {
      setIsSaving(false);
    }
  };

  const getPortrait = (characterName: string) => {
    return characterPortraits.find(p => p.name === characterName)?.portraitDataUri;
  }

  const interactableCharacters = characters.filter(c => c.name.toLowerCase() !== 'narrator');

  return (
    <Card className="bg-card/70 backdrop-blur-xl border-2 border-primary/50 card-glow-primary overflow-hidden">
      <CardHeader className="border-b-2 border-primary/20 p-4 bg-gradient-to-r from-primary/10 via-card/70 to-card/70">
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-2xl flex items-center gap-3 text-glow-primary">
              <Edit className="w-6 h-6 text-primary" />
              Director's Room
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!user}>
                  <Save className="mr-2 h-4 w-4"/>
                  Save Story
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Your Story</DialogTitle>
                  <DialogDescription>
                    Give your story a title to save it to your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input id="title" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" onClick={handleSaveStory} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
        <div className="flex items-center gap-4">
            <Label>TTS Engine:</Label>
            <Select value={ttsEngine} onValueChange={setTtsEngine}>
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select TTS Engine" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <Tabs defaultValue="dialogue" className="w-full">
        <ScrollArea>
         <TabsList className="w-full justify-start rounded-none bg-primary/10 p-0 border-b-2 border-primary/20">
              <TabsTrigger value="dialogue" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><Edit className="mr-2"/>Dialogue Editor</TabsTrigger>
              <TabsTrigger value="literaryAnalysis" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><FlaskConical className="mr-2"/>Literary Devices</TabsTrigger>
              <TabsTrigger value="dialogueDynamics" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><BarChart3 className="mr-2"/>Dialogue Dynamics</TabsTrigger>
              <TabsTrigger value="pacing" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><AreaChart className="mr-2"/>Pacing</TabsTrigger>
              <TabsTrigger value="tropeInverter" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><Wand2 className="mr-2"/>Trope Inverter</TabsTrigger>
              <TabsTrigger value="actorStudio" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><Users className="mr-2"/>Actor's Studio</TabsTrigger>
              <TabsTrigger value="unreliableNarrator" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><VenetianMask className="mr-2"/>Unreliable Narrator</TabsTrigger>
              <TabsTrigger value="showDontTell" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><Eye className="mr-2"/>Show, Don't Tell</TabsTrigger>
              <TabsTrigger value="consistency" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><ShieldCheck className="mr-2"/>Consistency</TabsTrigger>
              <TabsTrigger value="subtext" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><MessageSquareQuote className="mr-2"/>Subtext</TabsTrigger>
              <TabsTrigger value="perspective" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><Shuffle className="mr-2"/>Perspective</TabsTrigger>
              <TabsTrigger value="skepticalWombat" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><img src="https://storage.googleapis.com/static.invertase.io/wombat-2-1.png" alt="Skeptical Wombat" className="w-6 h-6 mr-2" />Skeptical Wombat</TabsTrigger>
              <TabsTrigger value="characterArchetypes" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><Users className="mr-2"/>Character Archetypes</TabsTrigger>
              <TabsTrigger value="plotStructure" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><BookText className="mr-2"/>Plot Structure</TabsTrigger>
              <TabsTrigger value="pacingVisualizer" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><AreaChart className="mr-2"/>Pacing Visualizer</TabsTrigger>
              <TabsTrigger value="compareToClassics" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none flex-shrink-0"><BookText className="mr-2"/>Compare to Classics</TabsTrigger>
          </TabsList>
        </ScrollArea>
        <ScrollArea className="h-[55vh]">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                        <h3 className="mt-2 text-sm font-medium text-muted-foreground">Analyzing...</h3>
                    </div>
                </div>
            ) : (
                <>
                    <TabsContent value="dialogue" className="p-4 md:p-6 space-y-4 bg-grid bg-[length:30px_30px] bg-card/10">
                        {segments.map((segment, index) => (
                        <div key={index} className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-border/50 items-start">
                            <Avatar className="h-16 w-16 border-2 shrink-0" style={{ borderColor: getCharacterColor(segment.character) }}>
                                <AvatarImage src={getPortrait(segment.character)} alt={`Portrait of ${segment.character}`} />
                                <AvatarFallback className="text-xl font-bold text-white" style={{ backgroundColor: getCharacterColor(segment.character) }}>
                                {segment.character.toLowerCase() === 'narrator'
                                    ? <BookText size={28}/>
                                    : segment.character.includes(' ')
                                    ? `${segment.character.split(' ')[0][0]}${segment.character.split(' ')[1][0]}`
                                    : segment.character.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                            <div className='flex items-center justify-between'>
                                <Label className="font-headline text-lg" style={{ color: getCharacterColor(segment.character) }}>{segment.character}</Label>
                        <div className="flex items-center gap-2">
                            {(segment as any).isGenerating && <Loader2 className="h-5 w-5 animate-spin" />}
                            {(segment as any).audioDataUri && <AudioPlayer src={(segment as any).audioDataUri} />}
                            <Select value={segment.emotion} onValueChange={(value) => handleEmotionChange(index, value)}>
                                <SelectTrigger className="w-40 bg-background/70 h-9">
                                    <SelectValue placeholder="Select emotion" />
                                </SelectTrigger>
                                <SelectContent>
                                    {emotionOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                            </div>
                            <Textarea
                                value={segment.dialogue}
                                onChange={(e) => handleDialogueChange(index, e.target.value)}
                                className="w-full bg-background/70 font-body text-base"
                                rows={3}
                            />
                            </div>
                        </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="literaryAnalysis" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <LiteraryAnalysisTab devices={literaryDevices} error={analysisErrors.literaryDevices} />
                    </TabsContent>
                     <TabsContent value="dialogueDynamics" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <DialogueDynamicsAnalysis analysis={dialogueDynamics} error={analysisErrors.dialogueDynamics} />
                    </TabsContent>
                    <TabsContent value="pacing" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <PacingAnalysis pacing={pacing} error={analysisErrors.pacing} />
                    </TabsContent>
                    <TabsContent value="tropeInverter" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <TropeInverter tropes={tropes} error={analysisErrors.tropes} />
                    </TabsContent>
                    <TabsContent value="actorStudio" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                <ActorStudio characters={characters} storyText={storyText} />
                    </TabsContent>
                    <TabsContent value="unreliableNarrator" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <UnreliableNarrator storyText={storyText} onApplySuggestion={handleApplySuggestion} />
                    </TabsContent>
                    <TabsContent value="showDontTell" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <ShowDontTell suggestions={showDontTellSuggestions} onApplySuggestion={handleApplySuggestion} error={analysisErrors.showDontTell} />
                    </TabsContent>
                    <TabsContent value="consistency" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                         <ConsistencyGuardian issues={consistencyIssues} error={analysisErrors.consistency} />
                    </TabsContent>
                    <TabsContent value="subtext" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                         <SubtextAnalyzer analyses={subtextAnalyses} error={analysisErrors.subtext} />
                    </TabsContent>
                    <TabsContent value="perspective" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <PerspectiveShifter characters={interactableCharacters} storyText={storyText} />
                    </TabsContent>
                    <TabsContent value="skepticalWombat" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <SkepticalWombat storyText={storyText} />
                    </TabsContent>
                    <TabsContent value="characterArchetypes" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <CharacterArchetypes storyText={storyText} />
                    </TabsContent>
                    <TabsContent value="plotStructure" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <PlotStructure storyText={storyText} />
                    </TabsContent>
                    <TabsContent value="pacingVisualizer" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <PacingVisualizer pacing={pacing} />
                    </TabsContent>
                    <TabsContent value="compareToClassics" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                        <CompareToClassics storyText={storyText} />
                    </TabsContent>
                </>
            )}
        </ScrollArea>
      </Tabs>
      <CardFooter className="p-4 border-t-2 border-primary/20">
         <Button 
              onClick={handleSubmit}
              disabled={isLoading} 
              size="lg"
              className="w-full font-headline text-lg py-6 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Audio...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Expressive Narration
                </>
              )}
            </Button>
      </CardFooter>
    </Card>
  );
}
