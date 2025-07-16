
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, FastForward, Rewind, BookText, Edit } from 'lucide-react';
import { type StorySegmentWithAudio, type CharacterPortrait } from '@/lib/actions';
import { cn, getCharacterColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

type StoryDisplayProps = {
  segments: StorySegmentWithAudio[];
  characterPortraits: CharacterPortrait[];
  onBack: () => void;
};

export function StoryDisplay({ segments, characterPortraits, onBack }: StoryDisplayProps) {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const characterColors = useMemo(() => {
    const uniqueCharacters = [...new Set(segments.map(s => s.character))];
    return uniqueCharacters.reduce((acc, char) => {
      acc[char] = getCharacterColor(char);
      return acc;
    }, {} as Record<string, string>);
  }, [segments]);

  // Effect to scroll the currently playing segment into view
  useEffect(() => {
    segmentRefs.current[currentSegmentIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [currentSegmentIndex]);

  // Effect to handle playing and pausing the audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(e => console.error("Audio play failed", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSegmentIndex]); // Re-run when segment changes

  // Effect to manage playback speed
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const advanceToNextSegment = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setProgress(0);
      setIsPlaying(true); // Autoplay next segment
    } else {
      setIsPlaying(false); // End of story
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
    if (audio) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const getPortrait = (characterName: string) => {
    return characterPortraits.find(p => p.name === characterName)?.portraitDataUri;
  }

  const currentAudioUri = segments[currentSegmentIndex]?.audioUri;

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
              ref={el => segmentRefs.current[index] = el}
              id={`segment-${index}`}
              className={cn(
                "flex gap-4 p-4 rounded-xl border transition-all duration-300",
                index === currentSegmentIndex && isPlaying
                  ? 'bg-secondary/20 border-secondary'
                  : 'bg-muted/50 border-transparent'
              )}
            >
              <Avatar className="h-16 w-16 border-2 shrink-0" style={{ borderColor: characterColors[segment.character] }}>
                 <AvatarImage src={getPortrait(segment.character)} alt={`Portrait of ${segment.character}`} />
                 <AvatarFallback className="text-xl font-bold text-white" style={{ backgroundColor: characterColors[segment.character] }}>
                  {segment.character.toLowerCase() === 'narrator' 
                    ? <BookText size={28}/> 
                    : segment.character.includes(' ')
                      ? `${segment.character.split(' ')[0][0]}${segment.character.split(' ')[1][0]}`
                      : segment.character.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-headline text-lg font-bold" style={{ color: characterColors[segment.character], textShadow: `0 0 8px ${characterColors[segment.character]}70` }}>{segment.character}</p>
                <p className="font-serif text-lg text-foreground/90 leading-relaxed">{segment.dialogue}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 md:p-6 border-t-2 border-secondary/20 bg-muted/30 backdrop-blur-sm space-y-4">
            <Progress value={progress} className="w-full h-2" />

            <div className="flex items-center justify-center gap-4">
                 <Button onClick={goToPreviousSegment} size="icon" variant="ghost" className="rounded-full w-12 h-12 text-secondary hover:bg-secondary/20" disabled={currentSegmentIndex === 0}>
                    <Rewind className="w-6 h-6 fill-current" />
                </Button>
                 <Button onClick={handlePlayPause} size="icon" className="rounded-full w-16 h-16 bg-gradient-to-br from-secondary to-accent text-primary-foreground shadow-lg shadow-secondary/40 hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </Button>
                 <Button onClick={advanceToNextSegment} size="icon" variant="ghost" className="rounded-full w-12 h-12 text-secondary hover:bg-secondary/20" disabled={currentSegmentIndex === segments.length - 1}>
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
          key={currentSegmentIndex} // Force re-render of audio element
        />
      )}
    </Card>
  );
}
