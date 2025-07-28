'use server';

import { storyParser } from '@/ai/flows/storyParser';
import { castingDirector } from '@/ai/flows/castingDirector';
import { emotionTagger } from '@/ai/flows/emotionTagger';
import { generateMultiVoiceTTS } from '@/ai/flows/generate-multi-voice-tts';
import {
  type DialogueSegment as ImportedDialogueSegment,
  type Character as ImportedCharacter,
} from '@/ai/schemas';
import { getStoryFromDB, updateStoryInDB } from '@/lib/data';
import { cache } from 'react';

// Re-exporting types for easy use in client components, maintaining a single source of truth.
export type DialogueSegment = ImportedDialogueSegment;
export type Character = ImportedCharacter;

const CHUNK_SIZE = 5; // Process 5 dialogue segments at a time

const cachedStoryParser = cache(storyParser);
const cachedCastingDirector = cache(castingDirector);
const cachedEmotionTagger = cache(emotionTagger);

export async function processStoryAndGenerateAudio(
  storyId: string,
  onChunkReady: (chunk: { audioDataUri: string; segments: DialogueSegment[] }) => void,
) {
  const story = await getStoryFromDB(storyId);
  const rawText = story.text;

  const { segments, characters } = await cachedStoryParser({ storyText: rawText });

  const castedCharacters = await cachedCastingDirector({ segments, characters });

  for (let i = 0; i < segments.length; i += CHUNK_SIZE) {
    const chunkSegments = segments.slice(i, i + CHUNK_SIZE);

    const [emotionTaggedSegments] = await Promise.all([
      cachedEmotionTagger({ segments: chunkSegments, characters }),
    ]);

    const { audioDataUri } = await generateMultiVoiceTTS({
      segments: emotionTaggedSegments.segments,
      characters: castedCharacters.characters,
    });

    onChunkReady({ audioDataUri, segments: emotionTaggedSegments.segments });
  }
}
