
"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, FastForward, Rewind, BookText, Edit, Volume2 } from 'lucide-react';
import { type DialogueSegment, type CharacterPortrait, type Character, getSoundDesign, type SoundEffectWithUrl, type TranscriptSegment } from '@/lib/actions';
import { cn, getCharacterColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Music2 } from 'lucide-react';

type StoryDisplayProps = {
  segments: DialogueSegment[];
  characterPortraits: CharacterPortrait[];
  characters: Character[];
  storyText: string;
  sceneAudioUri: string;
  transcript: TranscriptSegment[];
  onBack: () => void;
};

export function StoryDisplay({ segments, characterPortraits, characters, storyText, sceneAudioUri, transcript, onBack }: StoryDisplayProps) {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const [soundEffects, setSoundEffects] = useState<SoundEffectWithUrl[]>([]);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const soundEffectAudioRef = useRef<HTMLAudioElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  // Fetch sound design cues when the component loads.
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
      });
  }, [storyText, toast]);
  
  // Auto-scroll to the currently highlighted segment.
  useEffect(() => {
    if (currentSegmentIndex >= 0 && currentSegmentIndex < segmentRefs.current.length) {
      segmentRefs.current[currentSegmentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentSegmentIndex]);

  // Manage play/pause state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(e => console.error("Audio play failed", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Manage playback speed.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Manage volume.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const handlePlayPause = () => setIsPlaying(prev => !prev);
  
  const handleSeek = (direction: 'forward' | 'backward') => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = audio.currentTime + (direction === 'forward' ? 10 : -10);
    audio.currentTime = Math.max(0, Math.min(audio.duration, newTime));
  }

  // This is the core of the accurate highlighting.
  // It's called on every time update from the main audio element.
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const currentTime = audio.currentTime;
    
    // Update the progress bar.
    setProgress((currentTime / audio.duration) * 100);

    // Find which segment should be active based on the detailed transcript.
    const newCurrentIndex = transcript.findIndex(t => currentTime >= t.startTime && currentTime < t.endTime);
    
    if (newCurrentIndex !== -1 && newCurrentIndex !== currentSegmentIndex) {
        setCurrentSegmentIndex(newCurrentIndex);
        
        // Check if there's a sound effect for this new segment.
        const sfx = soundEffects.find(s => s.segmentIndex === newCurrentIndex);
        if (sfx) {
            setActiveSound(sfx.soundUrl);
        }
    }
  };
  
  const getPortrait = (characterName: string) => characterPortraits.find(p => p.name === characterName)?.portraitDataUri;

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
          {segments.map((segment, index) => (
            <div
              key={index}
              ref={el => { segmentRefs.current[index] = el; }}
              id={`segment-${index}`}
              className={cn(
                "flex gap-4 p-4 rounded-xl border transition-all duration-300 relative group",
                index === currentSegmentIndex
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
                 <p className="font-serif text-lg text-foreground/90 leading-relaxed">{segment.dialogue}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 md:p-6 border-t-2 border-secondary/20 bg-muted/30 backdrop-blur-sm space-y-4">
            <Progress value={progress} className="w-full h-2" />
            <div className="flex items-center justify-center gap-4">
                 <Button onClick={() => handleSeek('backward')} size="icon" variant="ghost" className="rounded-full w-12 h-12 text-secondary hover:bg-secondary/20">
                    <Rewind className="w-6 h-6 fill-current" />
                </Button>
                 <Button onClick={handlePlayPause} size="icon" className="rounded-full w-16 h-16 bg-gradient-to-br from-secondary to-accent text-primary-foreground shadow-lg shadow-secondary/40 hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </Button>
                 <Button onClick={() => handleSeek('forward')} size="icon" variant="ghost" className="rounded-full w-12 h-12 text-secondary hover:bg-secondary/20">
                    <FastForward className="w-6 h-6 fill-current" />
                </Button>
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="playback-speed" className="flex items-center gap-2 text-muted-foreground font-headline">
                <FastForward className="w-5 h-5 text-secondary" />
              </Label>
              <Slider
                id="playback-speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[playbackSpeed]}
                onValueChange={(value) => setPlaybackSpeed(value[0])}
                className="max-w-xs"
              />
               <span className="font-mono text-sm text-muted-foreground w-12 text-center bg-background/50 rounded-md py-1">{playbackSpeed.toFixed(1)}x</span>
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="volume-control" className="flex items-center gap-2 text-muted-foreground font-headline">
                <Volume2 className="w-5 h-5 text-secondary" />
              </Label>
              <Slider
                id="volume-control"
                min={0}
                max={1}
                step={0.05}
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                className="max-w-xs"
              />
               <span className="font-mono text-sm text-muted-foreground w-12 text-center bg-background/50 rounded-md py-1">{Math.round(volume * 100)}%</span>
            </div>
        </div>
      </CardContent>
      {sceneAudioUri && (
        <audio
          ref={audioRef}
          src={sceneAudioUri}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={() => isPlaying && audioRef.current?.play()}
          onEnded={() => setIsPlaying(false)}
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
