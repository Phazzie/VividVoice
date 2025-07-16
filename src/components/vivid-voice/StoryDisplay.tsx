
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, FastForward, Rewind, BookText, Edit, Wand2, RefreshCw, Loader2, X, Music2 } from 'lucide-react';
import { type StorySegmentWithAudio, type CharacterPortrait, regenerateSingleLineAudio, type Character, getSoundDesign, type SoundEffectWithUrl } from '@/lib/actions';
import { cn, getCharacterColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { emotionOptions } from './DialogueEditor';
import { Textarea } from '../ui/textarea';


type StoryDisplayProps = {
  segments: StorySegmentWithAudio[];
  characterPortraits: CharacterPortrait[];
  characters: Character[];
  storyText: string;
  onBack: () => void;
};

export function StoryDisplay({ segments, characterPortraits, characters, storyText, onBack }: StoryDisplayProps) {
  const [storySegments, setStorySegments] = useState<StorySegmentWithAudio[]>(segments);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  
  // State for inline editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempDialogue, setTempDialogue] = useState('');
  const [tempEmotion, setTempEmotion] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // State for sound design
  const [soundEffects, setSoundEffects] = useState<SoundEffectWithUrl[]>([]);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const soundEffectAudioRef = useRef<HTMLAudioElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  const characterVoiceMap = useMemo(() => {
    const map = new Map<string, string>();
    characters.forEach(char => {
      if (char.voiceId) {
        map.set(char.name, char.voiceId);
      }
    });
    // Add a default for the narrator
    map.set('Narrator', 'en-US-Standard-A');
    return map;
  }, [characters]);

  // Fetch sound design on component mount
  useEffect(() => {
    getSoundDesign(storyText)
      .then(effects => {
        if (effects && effects.length > 0) {
          setSoundEffects(effects);
          toast({
            title: "Sound Design Ready",
            description: `AI has identified ${effects.length} sound effects to enhance your story.`,
            action: <Music2 className="text-primary" />,
          });
        }
      })
      .catch(e => {
        console.error("Failed to get sound design:", e);
        // Don't bother the user with a toast for this non-critical feature
      });
  }, [storyText, toast]);
  
  // Effect to play sound effects when the segment changes
  useEffect(() => {
    const effect = soundEffects.find(sfx => sfx.segmentIndex === currentSegmentIndex);
    if (effect && isPlaying) {
      setActiveSound(effect.soundUrl);
    } else {
      setActiveSound(null);
    }
  }, [currentSegmentIndex, soundEffects, isPlaying]);

  useEffect(() => {
    segmentRefs.current[currentSegmentIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [currentSegmentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(e => console.error("Audio play failed", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSegmentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const handlePlayPause = () => setIsPlaying(prev => !prev);

  const advanceToNextSegment = () => {
    if (currentSegmentIndex < storySegments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const goToPreviousSegment = () => {
     if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(prev => prev - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setProgress((audio.currentTime / audio.duration) * 100);
  };
  
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setTempDialogue(storySegments[index].dialogue);
    setTempEmotion(storySegments[index].emotion);
    setIsPlaying(false); // Pause playback when editing
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };
  
  const handleRegenerate = async (index: number) => {
    setIsRegenerating(true);
    try {
        const segmentToRegen = { ...storySegments[index], dialogue: tempDialogue, emotion: tempEmotion };
        const voice = characterVoiceMap.get(segmentToRegen.character) || 'en-US-Standard-A';

        const newAudioUri = await regenerateSingleLineAudio(segmentToRegen, voice);
        
        const newSegments = [...storySegments];
        newSegments[index] = { ...segmentToRegen, audioUri: newAudioUri };
        setStorySegments(newSegments);

        toast({ title: "Regeneration Complete", description: "The audio for the line has been updated." });
        setEditingIndex(null);
    } catch (e: any) {
        toast({ variant: "destructive", title: "Regeneration Failed", description: e.message });
    } finally {
        setIsRegenerating(false);
    }
  };


  const getPortrait = (characterName: string) => characterPortraits.find(p => p.name === characterName)?.portraitDataUri;
  const currentAudioUri = storySegments[currentSegmentIndex]?.audioUri;

  return (
    <Card className="bg-card/70 backdrop-blur-xl border-2 border-secondary/50 card-glow-accent overflow-hidden">
      <CardHeader className="flex-row items-center justify-between border-b-2 border-secondary/20 p-4 bg-gradient-to-r from-secondary/10 via-card/70 to-card/70">
        <div className='flex items-center gap-2'>
          <Button onClick={onBack} size="icon" variant="ghost" className="rounded-full w-10 h-10 text-secondary hover:bg-secondary/20 hover:text-secondary">
            <Edit className="w-5 h-5" />
          </Button>
          <CardTitle className="font-headline text-2xl text-gradient bg-gradient-to-r from-secondary to-accent text-glow-accent">Your Vivid Story</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[50vh] overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-grid bg-[length:30px_30px] bg-card/10">
          {storySegments.map((segment, index) => (
            <div
              key={index}
              ref={el => segmentRefs.current[index] = el}
              id={`segment-${index}`}
              className={cn(
                "flex gap-4 p-4 rounded-xl border transition-all duration-300 relative group",
                index === currentSegmentIndex && isPlaying
                  ? 'bg-secondary/20 border-secondary'
                  : 'bg-muted/50 border-transparent'
              )}
            >
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
                <p className="font-headline text-lg font-bold" style={{ color: getCharacterColor(segment.character), textShadow: `0 0 8px ${getCharacterColor(segment.character)}70` }}>{segment.character}</p>
                 {editingIndex === index ? (
                   <div className="space-y-3">
                     <Select value={tempEmotion} onValueChange={setTempEmotion}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                          {emotionOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Textarea value={tempDialogue} onChange={e => setTempDialogue(e.target.value)} rows={3}/>
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}><X className="w-4 h-4 mr-1"/>Cancel</Button>
                        <Button size="sm" onClick={() => handleRegenerate(index)} disabled={isRegenerating}>
                          {isRegenerating ? <Loader2 className="w-4 h-4 mr-1 animate-spin"/> : <RefreshCw className="w-4 h-4 mr-1" />}
                          Regenerate
                        </Button>
                      </div>
                   </div>
                 ) : (
                  <p className="font-serif text-lg text-foreground/90 leading-relaxed">{segment.dialogue}</p>
                 )}
              </div>
              {editingIndex !== index && (
                <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEditClick(index)}
                >
                    <Wand2 className="w-4 h-4 text-accent" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 md:p-6 border-t-2 border-secondary/20 bg-muted/30 backdrop-blur-sm space-y-4">
            <Progress value={progress} className="w-full h-2" />
            <div className="flex items-center justify-center gap-4">
                 <Button onClick={goToPreviousSegment} size="icon" variant="ghost" className="rounded-full w-12 h-12 text-secondary hover:bg-secondary/20" disabled={currentSegmentIndex === 0 || editingIndex !== null}>
                    <Rewind className="w-6 h-6 fill-current" />
                </Button>
                 <Button onClick={handlePlayPause} size="icon" className="rounded-full w-16 h-16 bg-gradient-to-br from-secondary to-accent text-primary-foreground shadow-lg shadow-secondary/40 hover:scale-110 transition-transform" disabled={editingIndex !== null}>
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </Button>
                 <Button onClick={advanceToNextSegment} size="icon" variant="ghost" className="rounded-full w-12 h-12 text-secondary hover:bg-secondary/20" disabled={currentSegmentIndex === storySegments.length - 1 || editingIndex !== null}>
                    <FastForward className="w-6 h-6 fill-current" />
                </Button>
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="playback-speed" className="flex items-center gap-2 text-muted-foreground font-headline">
                <FastForward className="w-5 h-5 text-secondary" /> Speed
              </Label>
              <Slider
                id="playback-speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[playbackSpeed]}
                onValueChange={(value) => setPlaybackSpeed(value[0])}
                className="max-w-xs"
                disabled={editingIndex !== null}
              />
               <span className="font-mono text-sm text-muted-foreground w-12 text-center bg-background/50 rounded-md py-1">{playbackSpeed.toFixed(1)}x</span>
            </div>
        </div>
      </CardContent>
      {currentAudioUri && (
        <audio
          ref={audioRef}
          src={currentAudioUri}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={() => isPlaying && audioRef.current?.play()}
          onEnded={advanceToNextSegment}
          key={currentSegmentIndex}
        />
      )}
       {activeSound && (
        <audio
          ref={soundEffectAudioRef}
          src={activeSound}
          autoPlay
          onEnded={() => setActiveSound(null)}
          key={activeSound}
        />
      )}
    </Card>
  );
}
