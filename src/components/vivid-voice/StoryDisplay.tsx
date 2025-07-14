
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, FastForward, User, Rewind, BookText, PersonStanding } from 'lucide-react';
import { type StorySegmentWithAudio } from '@/lib/actions';
import { cn, getCharacterColor } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

type StoryDisplayProps = {
  segments: StorySegmentWithAudio[];
};

export function StoryDisplay({ segments }: StoryDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const mainAudioUri = useMemo(() => segments.find(s => s.audioUri)?.audioUri, [segments]);

  const characterColors = useMemo(() => {
    const uniqueCharacters = [...new Set(segments.map(s => s.character))];
    return uniqueCharacters.reduce((acc, char) => {
      acc[char] = getCharacterColor(char);
      return acc;
    }, {} as Record<string, string>);
  }, [segments]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !mainAudioUri) return;

    if (audio.src !== mainAudioUri) {
      audio.src = mainAudioUri;
      audio.load();
    }
    
    const playPromise = isPlaying ? audio.play() : audio.pause();
    if (playPromise !== undefined && !isPlaying) {
      playPromise.then(_ => audio.pause()).catch(e => console.error("Audio handling failed:", e));
    } else if (playPromise !== undefined && isPlaying) {
      playPromise.catch(e => console.error("Audio play failed:", e));
    }

  }, [isPlaying, mainAudioUri]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);
  
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
    setIsPlaying(prev => !prev);
  };
  
  const handleRestart = () => {
    const audio = audioRef.current;
    if (audio) {
        audio.currentTime = 0;
        setCurrentSegmentIndex(0);
        if (!isPlaying) {
          setIsPlaying(true);
        }
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const duration = audio.duration;
    if (duration > 0) {
        setProgress((audio.currentTime / duration) * 100);
    }

    // This is an estimation. For precise sync, timestamps from the model would be needed.
    const segmentDurationApproximation = duration > 0 ? duration / segments.length : 1;
    const estimatedIndex = Math.floor(audio.currentTime / segmentDurationApproximation);
    const newIndex = Math.min(estimatedIndex, segments.length - 1);
    
    if (newIndex !== currentSegmentIndex) {
      setCurrentSegmentIndex(newIndex);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentSegmentIndex(segments.length - 1); // Stay on last segment
    setProgress(100);
  };

  return (
    <Card className="bg-card/70 backdrop-blur-xl border-2 border-secondary/50 card-glow-accent overflow-hidden">
      <CardHeader className="flex-row items-center justify-between border-b-2 border-secondary/20 p-4 bg-gradient-to-r from-secondary/10 via-card/70 to-card/70">
        <CardTitle className="font-headline text-2xl text-gradient bg-gradient-to-r from-secondary to-accent text-glow-accent">Your Vivid Story</CardTitle>
        <div className="flex items-center gap-2">
          <Button onClick={handleRestart} size="icon" variant="ghost" className="rounded-full w-10 h-10 text-secondary hover:bg-secondary/20 hover:text-secondary">
            <Rewind className="w-5 h-5" />
          </Button>
          <Button onClick={handlePlayPause} size="icon" className="rounded-full w-14 h-14 bg-gradient-to-br from-secondary to-accent text-primary-foreground shadow-lg shadow-secondary/40 hover:scale-110 transition-transform">
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current" />}
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
              <Avatar className="h-12 w-12 border-2 shrink-0" style={{ borderColor: characterColors[segment.character] }}>
                 <AvatarFallback className="text-xl font-bold text-white" style={{ backgroundColor: characterColors[segment.character] }}>
                  {segment.character.toLowerCase() === 'narrator' 
                    ? <BookText size={24}/> 
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
      {mainAudioUri && <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleAudioEnded} />}
    </Card>
  );
}
