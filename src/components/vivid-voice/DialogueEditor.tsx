
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { type DialogueSegment, type CharacterPortrait } from '@/lib/actions';
import { Wand2, Loader2, Edit } from 'lucide-react';
import { cn, getCharacterColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookText } from 'lucide-react';
import { LiteraryAnalysisTab } from '@/components/vivid-voice/LiteraryAnalysis';
import { DialogueDynamicsAnalysis } from '@/components/vivid-voice/DialogueDynamicsAnalysis';

type DialogueEditorProps = {
  storyText: string;
  initialSegments: DialogueSegment[];
  characterPortraits: CharacterPortrait[];
  onGenerateAudio: (segments: DialogueSegment[]) => void;
  isLoading: boolean;
};

const emotionOptions = [
  "Neutral", "Happy", "Sad", "Angry", "Anxious", "Excited", "Intrigued", "Sarcastic", "Whispering", "Shouting", "Fearful", "Amused", "Serious", "Playful"
];

export function DialogueEditor({ storyText, initialSegments, characterPortraits, onGenerateAudio, isLoading }: DialogueEditorProps) {
  const [segments, setSegments] = useState<DialogueSegment[]>(initialSegments);

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

  const handleSubmit = () => {
    onGenerateAudio(segments);
  };

  const getPortrait = (characterName: string) => {
    return characterPortraits.find(p => p.name === characterName)?.portraitDataUri;
  }

  return (
    <Card className="bg-card/70 backdrop-blur-xl border-2 border-primary/50 card-glow-primary overflow-hidden">
      <CardHeader className="border-b-2 border-primary/20 p-4 bg-gradient-to-r from-primary/10 via-card/70 to-card/70">
        <CardTitle className="font-headline text-2xl flex items-center gap-3 text-glow-primary">
          <Edit className="w-6 h-6 text-primary" />
          Director's Room
        </CardTitle>
      </CardHeader>
      <Tabs defaultValue="dialogue" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-primary/10 p-0 border-b-2 border-primary/20 grid grid-cols-3">
            <TabsTrigger value="dialogue" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none">Dialogue Editor</TabsTrigger>
            <TabsTrigger value="literaryAnalysis" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none">Literary Analysis</TabsTrigger>
            <TabsTrigger value="dialogueDynamics" className="py-3 text-base rounded-none data-[state=active]:bg-primary/20 data-[state=active]:shadow-none">Dialogue Dynamics</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[55vh]">
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
                    <Textarea
                        value={segment.dialogue}
                        onChange={(e) => handleDialogueChange(index, e.target.value)}
                        className="w-full bg-background/70 font-serif text-base"
                        rows={3}
                    />
                    </div>
                </div>
                ))}
            </TabsContent>
            <TabsContent value="literaryAnalysis" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                <LiteraryAnalysisTab storyText={storyText} />
            </TabsContent>
             <TabsContent value="dialogueDynamics" className="p-4 md:p-6 bg-grid bg-[length:30px_30px] bg-card/10">
                <DialogueDynamicsAnalysis storyText={storyText} />
            </TabsContent>
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
                  Generate Vivid Narration
                </>
              )}
            </Button>
      </CardFooter>
    </Card>
  );
}
