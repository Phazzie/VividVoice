"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { processStoryAndGenerateAudio } from '@/lib/actions';
import { Wand2, Loader2 } from 'lucide-react';
import { AudioPlayer } from './vivid-voice/AudioPlayer';

type EditorProps = {
  storyId: string | null;
  storyText: string;
};

export function Editor({
  storyId,
  storyText,
}: EditorProps) {
  const [text, setText] = useState(storyText);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!storyId) return;
    setIsLoading(true);
    try {
      const url = await processStoryAndGenerateAudio(storyId);
      setAudioUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/70 backdrop-blur-xl border-2 border-primary/50 card-glow-primary overflow-hidden">
      <CardHeader className="border-b-2 border-primary/20 p-4 bg-gradient-to-r from-primary/10 via-card/70 to-card/70">
        <CardTitle className="font-headline text-2xl flex items-center gap-3 text-glow-primary">
          <Wand2 className="w-6 h-6 text-primary" />
          VividVoice Editor
        </CardTitle>
      </CardHeader>
      <div className="p-4">
        <Label htmlFor="story-text">Your Story</Label>
        <Textarea
          id="story-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-background/70 font-body text-base"
          rows={15}
        />
      </div>
      <CardFooter className="p-4 border-t-2 border-primary/20">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !storyId}
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
              Bring My Story to Life ✨
            </>
          )}
        </Button>
      </CardFooter>
      {audioUrl && (
        <div className="p-4 border-t-2 border-primary/20">
          <AudioPlayer src={audioUrl} />
        </div>
      )}
    </Card>
  );
}
