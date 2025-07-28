"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { processStoryAndGenerateAudio, DialogueSegment, Character } from '@/lib/actions';
import { Wand2, Loader2, Edit, Save, BookText } from 'lucide-react';
import { AudioPlayer } from './vivid-voice/AudioPlayer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type EditorProps = {
  storyId: string | null;
  storyText: string;
};

export function Editor({
  storyId,
  storyText,
}: EditorProps) {
  const [text, setText] = useState(storyText);
  const [segments, setSegments] = useState<DialogueSegment[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processedSegments, setProcessedSegments] = useState<number>(0);

  const handleChunkReady = (chunk: { audioDataUri: string; segments: DialogueSegment[] }) => {
    setAudioUrls((prev) => [...prev, chunk.audioDataUri]);
    setSegments((prev) => [...prev, ...chunk.segments]);
    setProcessedSegments((prev) => prev + chunk.segments.length);
  };

  const handleSubmit = async () => {
    if (!storyId) return;
    setIsLoading(true);
    setAudioUrls([]);
    setSegments([]);
    setProcessedSegments(0);
    try {
      await processStoryAndGenerateAudio(storyId, handleChunkReady);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionChange = (index: number, value: string) => {
    const newSegments = [...segments];
    newSegments[index].emotion = value;
    setSegments(newSegments);
  };

  const handleVoiceChange = (characterName: string, voiceId: string) => {
    const newCharacters = characters.map((c) =>
      c.name === characterName ? { ...c, voiceId } : c
    );
    setCharacters(newCharacters);
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
      <div className="p-4">
        {characters.map((character) => (
          <div key={character.name} className="flex items-center gap-4">
            <Label>{character.name}</Label>
            <Select
              value={character.voiceId}
              onValueChange={(value) => handleVoiceChange(character.name, value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US-Standard-A">en-US-Standard-A</SelectItem>
                <SelectItem value="en-US-Standard-B">en-US-Standard-B</SelectItem>
                <SelectItem value="en-US-Standard-C">en-US-Standard-C</SelectItem>
                <SelectItem value="en-US-Standard-D">en-US-Standard-D</SelectItem>
                <SelectItem value="en-US-Standard-E">en-US-Standard-E</SelectItem>
                <SelectItem value="en-US-Standard-F">en-US-Standard-F</SelectItem>
                <SelectItem value="en-US-Standard-G">en-US-Standard-G</SelectItem>
                <SelectItem value="en-US-Standard-H">en-US-Standard-H</SelectItem>
                <SelectItem value="en-US-Standard-I">en-US-Standard-I</SelectItem>
                <SelectItem value="en-US-Standard-J">en-US-Standard-J</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <div className="p-4">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-4">
            <Label>{segment.character}:</Label>
            <p>{segment.dialogue}</p>
            <Select
              value={segment.emotion}
              onValueChange={(value) => handleEmotionChange(index, value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select emotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Happy">Happy</SelectItem>
                <SelectItem value="Sad">Sad</SelectItem>
                <SelectItem value="Angry">Angry</SelectItem>
                <SelectItem value="Anxious">Anxious</SelectItem>
                <SelectItem value="Excited">Excited</SelectItem>
                <SelectItem value="Intrigued">Intrigued</SelectItem>
                <SelectItem value="Sarcastic">Sarcastic</SelectItem>
                <SelectItem value="Whispering">Whispering</SelectItem>
                <SelectItem value="Shouting">Shouting</SelectItem>
                <SelectItem value="Fearful">Fearful</SelectItem>
                <SelectItem value="Amused">Amused</SelectItem>
                <SelectItem value="Serious">Serious</SelectItem>
                <SelectItem value="Playful">Playful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="p-4">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating audio... {processedSegments} segments processed.
        </div>
      )}
      <div className="p-4">
        {audioUrls.map((url, index) => (
          <AudioPlayer key={index} src={url} />
        ))}
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
    </Card>
  );
}
