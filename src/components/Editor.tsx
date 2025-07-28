"use client";
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AudioPlayer } from "@/components/vivid-voice/AudioPlayer";
import { processStoryAndGenerateAudio } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function Editor() {
  const [storyText, setStoryText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setAudioUrl("");
    try {
      const url = await processStoryAndGenerateAudio(storyText);
      setAudioUrl(url);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-4 p-4">
      <CardHeader>
        <CardTitle>VividVoice Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
          placeholder="Paste your story here..."
          className="min-h-[200px]"
        />
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate VividVoice Audio"}
        </Button>
        {audioUrl && <AudioPlayer src={audioUrl} />}
      </CardContent>
    </Card>
  );
}
