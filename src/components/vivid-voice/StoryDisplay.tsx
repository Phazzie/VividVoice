
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, FastForward, User, Rewind } from 'lucide-react';
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
  
  // Effect for handling play/pause and source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !mainAudioUri) return;

    if (audio.src !== mainAudioUri) {
      audio.src = mainAudioUri;
      audio.load();
    }
    
    if (isPlaying) {
      audio.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, mainAudioUri]);

  // Effect for setting playback speed
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);
  
  // Effect for scrolling to the current segment
  useEffect(() => {
    const currentSegmentElement = document.getElementById(`segment-${currentSegmentIndex}`);
    if (currentSegmentElement && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: currentSegmentElement.offsetTop - scrollContainerRef.current.offsetTop - 20,
        behavior: 'smooth',
      });
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

    // A simple approximation to advance segments. 
    // This could be improved with precise timestamps from the TTS service.
    const segmentDurationApproximation = duration / segments.length;
    const estimatedIndex = Math.floor(audio.currentTime / segmentDurationApproximation);
    setCurrentSegmentIndex(Math.min(estimatedIndex, segments.length - 1));
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentSegmentIndex(0);
    setProgress(0);
    if(audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-lg shadow-primary/10 overflow-hidden">
      <CardHeader className="flex-row items-center justify-between border-b-2 border-primary/10">
        <CardTitle className="font-headline text-2xl">Your Vivid Story</CardTitle>
        <div className="flex items-center gap-2">
          <Button onClick={handleRestart} size="icon" variant="ghost" className="rounded-full w-10 h-10 text-primary">
            <Rewind className="w-5 h-5" />
          </Button>
          <Button onClick={handlePlayPause} size="icon" className="rounded-full w-12 h-12 bg-primary/90 hover:bg-primary text-primary-foreground">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={scrollContainerRef} className="max-h-[50vh] overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
          {segments.map((segment, index) => (
            <div
              key={index}
              id={`segment-${index}`}
              className={cn(
                "flex gap-4 p-4 rounded-lg transition-all duration-300",
                index === currentSegmentIndex && isPlaying ? "bg-primary/20 scale-[1.02] shadow-lg" : "bg-muted/50"
              )}
            >
              <Avatar className="h-12 w-12 border-2" style={{ borderColor: characterColors[segment.character] }}>
                <AvatarFallback className="text-xl font-bold text-white" style={{ backgroundColor: characterColors[segment.character] }}>
                  {segment.character.toLowerCase() === 'narrator' ? <User /> : segment.character.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-headline text-lg font-bold" style={{ color: characterColors[segment.character] }}>{segment.character}</p>
                <p className="font-serif text-lg text-foreground/90 leading-relaxed">{segment.dialogue}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 md:p-6 border-t-2 border-primary/10 bg-muted/30 space-y-4">
             <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-4">
              <Label htmlFor="playback-speed" className="flex items-center gap-2 text-muted-foreground font-headline">
                <FastForward className="w-5 h-5" /> Speed:
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
               <span className="font-mono text-sm text-muted-foreground w-12 text-center">{playbackSpeed.toFixed(1)}x</span>
            </div>
        </div>
      </CardContent>
      {mainAudioUri && <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleAudioEnded} />}
    </Card>
  );
}
