"use client";

import { Play, Pause, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      // Reset state when src changes
      setIsPlaying(false);
      setIsLoading(true);
      audioElement.pause();
      audioElement.currentTime = 0;

      const handleCanPlayThrough = () => setIsLoading(false);
      const handleEnded = () => setIsPlaying(false);

      audioElement.addEventListener('canplaythrough', handleCanPlayThrough);
      audioElement.addEventListener('ended', handleEnded);

      return () => {
        audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center">
      <audio ref={audioRef} src={src} preload="auto" />
      <button onClick={togglePlay} disabled={isLoading} className="p-2">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
