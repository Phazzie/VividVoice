/**
 * Example Component demonstrating the new service architecture
 * This shows how to use services in React components
 */

'use client';

import { useState } from 'react';
import {
  useStoryService,
  useAudioService,
  useCharacterService,
  useDataService,
} from '@/services/ServiceProvider';
import type { StoryAnalysis, AudioResult } from '@/services/contracts';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Example component showing service usage
 */
export function ServiceExample() {
  const storyService = useStoryService();
  const audioService = useAudioService();
  const characterService = useCharacterService();
  const dataService = useDataService();

  const [storyText, setStoryText] = useState('');
  const [analysis, setAnalysis] = useState<StoryAnalysis | null>(null);
  const [audio, setAudio] = useState<AudioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Analyze the story using the story service
      const result = await storyService.analyzeStory(storyText);
      setAnalysis(result);

      // 2. Generate character portraits (optional)
      await characterService.generatePortraits(result.characters);

      // 3. Generate audio using the audio service
      const audioResult = await audioService.generateMultiVoiceAudio(
        result.segments,
        result.characters
      );
      setAudio(audioResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (userId: string) => {
    if (!analysis) return;

    try {
      const storyId = await dataService.saveStory({
        userId,
        title: 'My Story',
        storyText,
      });
      console.log('Story saved with ID:', storyId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save story');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Service Architecture Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your story text here..."
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            rows={10}
          />

          <Button onClick={handleAnalyze} disabled={loading || !storyText}>
            {loading ? 'Analyzing...' : 'Analyze Story'}
          </Button>

          {error && <div className="text-red-500">{error}</div>}

          {analysis && (
            <div className="space-y-2">
              <h3 className="font-bold">Analysis Results:</h3>
              <p>Characters: {analysis.characters.length}</p>
              <p>Segments: {analysis.segments.length}</p>
              <p>
                Literary Devices: {analysis.literaryDevices.devices.length}
              </p>
              <p>Tropes: {analysis.tropes.tropes.length}</p>
            </div>
          )}

          {audio && (
            <div>
              <h3 className="font-bold">Audio Generated:</h3>
              <audio controls src={audio.audioDataUri} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Example of using multiple services together */}
      <Card>
        <CardHeader>
          <CardTitle>Service Integration Example</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This component demonstrates how to:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
            <li>Use multiple services in one component</li>
            <li>Handle async operations with services</li>
            <li>Display service results in UI</li>
            <li>Handle errors from services</li>
            <li>Compose multiple service calls</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
