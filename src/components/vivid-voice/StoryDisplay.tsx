
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, FastForward, Rewind, BookText, Edit, SkipForward, SkipBack } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const characterColors = useMemo(() => {
    const uniqueCharacters = [...new Set(segments.map(s => s.character))];
    return uniqueCharacters.reduce((acc, char) => {
      acc[char] = getCharacterColor(char);
      return acc;
    }, {} as Record<string, string>);
  }, [segments]);

  // Effect to handle audio playback and source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Stop if we've reached the end
    if (currentSegmentIndex >= segments.length) {
      setIsPlaying(false);
      return;
    }
    
    const currentSegment = segments[currentSegmentIndex];
    
    // If there's no audio URI for the current segment, skip to the next one automatically if playing.
    if (!currentSegment?.audioUri) {
      if(isPlaying) {
        setCurrentSegmentIndex(prev => prev + 1);
      }
      return;
    }

    // Set the audio source if it has changed
    if (audio.src !== currentSegment.audioUri) {
        audio.src = currentSegment.audioUri;
        audio.load();
    }
    
    // Play or pause based on isPlaying state
    if (isPlaying) {
        const playPromise = audio.play();
        playPromise?.catch(e => {
            console.error("Audio play failed:", e);
            setIsPlaying(false); // Stop trying to play if it fails
        });
    } else {
        audio.pause();
    }

  }, [currentSegmentIndex, segments, isPlaying]);


  // Effect to manage playback speed
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);
  
  // Effect to scroll the currently playing segment into view
  useEffect(() => {
    const currentSegmentElement = document.getElementById(`segment-${currentSegmentIndex}`);
    if (currentSegmentElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const elementTop = currentSegmentElement.offsetTop;
      const elementHeight = currentSegmentElement.offsetHeight;
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (elementTop < containerTop || (elementTop + elementHeight) > (containerTop + containerHeight)) {
          container.scrollTo({
            top: elementTop - container.offsetTop - (containerHeight / 4),
            behavior: 'smooth',
          });
      }
    }
  }, [currentSegmentIndex]);

  const handlePlayPause = () => {
    // If at the end, restart from the beginning when play is pressed
    if (!isPlaying && currentSegmentIndex >= segments.length - 1) {
      setCurrentSegmentIndex(0);
    }
    setIsPlaying(prev => !prev);
  };
  
  const handleSkip = (direction: 'forward' | 'backward') => {
    const nextIndex = direction === 'forward' ? currentSegmentIndex + 1 : currentSegmentIndex - 1;
    if (nextIndex >= 0 && nextIndex < segments.length) {
      setCurrentSegmentIndex(nextIndex);
    }
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || isNaN(audio.duration)) return;
    const currentProgressInSegment = (audio.currentTime / audio.duration);
    const totalProgress = ((currentSegmentIndex + currentProgressInSegment) / segments.length) * 100;
    setProgress(totalProgress);
  };
  
  const handleAudioEnded = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setCurrentSegmentIndex(prevIndex => prevIndex + 1);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  };

  const getPortrait = (characterName: string) => {
    return characterPortraits.find(p => p.name === characterName)?.portraitDataUri;
  }
  
  const isLastSegment = currentSegmentIndex >= segments.length - 1;
  const isFirstSegment = currentSegmentIndex === 0;

  return (
    <Card className="bg-card/70 backdrop-blur-xl border-2 border-secondary/50 card-glow-accent overflow-hidden">
      <CardHeader className="flex-row items-center justify-between border-b-2 border-secondary/20 p-4 bg-gradient-to-r from-secondary/10 via-card/70 to-card/70">
        <div className='flex items-center gap-2'>
          <Button onClick={onBack} size="icon" variant="ghost" className="rounded-full w-10 h-10 text-secondary hover:bg-secondary/20 hover:text-secondary">
            <Edit className="w-5 h-5" />
          </Button>
          <CardTitle className="font-headline text-2xl text-gradient bg-gradient-to-r from-secondary to-accent text-glow-accent">Your Vivid Story</CardTitle>
        </div>
        <div className="flex items-center gap-2">
           <Button onClick={() => handleSkip('backward')} size="icon" variant="ghost" className="rounded-full w-10 h-10 text-secondary hover:bg-secondary/20 hover:text-secondary" disabled={isFirstSegment && !isPlaying}>
            <SkipBack className="w-5 h-5 fill-current" />
          </Button>
          <Button onClick={handlePlayPause} size="icon" className="rounded-full w-14 h-14 bg-gradient-to-br from-secondary to-accent text-primary-foreground shadow-lg shadow-secondary/40 hover:scale-110 transition-transform">
            {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
          </Button>
          <Button onClick={() => handleSkip('forward')} size="icon" variant="ghost" className="rounded-full w-10 h-10 text-secondary hover:bg-secondary/20 hover:text-secondary" disabled={isLastSegment}>
            <SkipForward className="w-5 h-5 fill-current" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={scrollContainerRef} className="max-h-[50vh] overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-grid bg-[length:30px_30px] bg-card/10">
          {segments.map((segment, index) => (
            <div
              key={index}
              id={`segment-${index}`}
              className={cn(
                "flex gap-4 p-4 rounded-xl transition-all duration-300 ease-in-out transform border",
                index === currentSegmentIndex && isPlaying 
                  ? "bg-secondary/20 scale-[1.03] shadow-lg shadow-secondary/20 border-secondary" 
                  : "bg-muted/50 border-transparent"
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
             <Progress value={progress} className="h-2 [&>div]:bg-secondary" />
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
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleAudioEnded} />
    </Card>
  );
}
