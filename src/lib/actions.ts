'use server';

import {
  parseDialogue,
  type ParseDialogueOutput,
} from '@/ai/flows/parse-dialogue';
import { generateEmotionalTTS } from '@/ai/flows/generate-emotional-tts';
import {
  generateCharacterPortraits,
  type GenerateCharacterPortraitsOutput,
} from '@/ai/flows/generate-character-portraits';
import { z } from 'zod';
import { type DialogueSegment as ImportedDialogueSegment } from '@/ai/schemas';

// Re-exporting for use in client components
export type DialogueSegment = ImportedDialogueSegment;
export type CharacterPortrait = { name: string; portraitDataUri: string };

const StorySegmentWithAudioSchema = z.object({
  character: z.string(),
  dialogue: z.string(),
  emotion: z.string(),
  audioUri: z.string().optional(),
});

export type StorySegmentWithAudio = z.infer<typeof StorySegmentWithAudioSchema>;

type ParseStoryResult = {
  segments: DialogueSegment[];
  portraits: CharacterPortrait[];
};

/**
 * Step 1: Parses the story text into dialogue segments, emotions, and generates character portraits.
 */
export async function parseStory(
  storyText: string
): Promise<ParseStoryResult> {
  console.log('Starting story parsing and character generation...');
  if (!storyText.trim()) {
    console.error('Validation Error: Story text cannot be empty.');
    throw new Error('Story text cannot be empty.');
  }

  try {
    // First, parse the dialogue and get character descriptions.
    const parsedResult = await parseDialogue({ storyText });
    if (
      !parsedResult ||
      !parsedResult.segments ||
      parsedResult.segments.length === 0
    ) {
      console.error(
        'Parsing Error: Could not parse any dialogue from the provided text.'
      );
      throw new Error(
        'Could not parse dialogue. Please ensure it has standard dialogue formatting (e.g., Character: Dialogue).'
      );
    }
    console.log(
      'Story parsing successful, found characters:',
      parsedResult.characters.map((c) => c.name).join(', ')
    );

    // Now, generate portraits for the extracted characters.
    let portraits: CharacterPortrait[] = [];
    if (parsedResult.characters.length > 0) {
      console.log('Generating character portraits...');
      portraits = await generateCharacterPortraits({
        characters: parsedResult.characters,
      });
      console.log('Portrait generation successful.');
    }

    return {
      segments: parsedResult.segments,
      portraits: portraits,
    };
  } catch (error) {
    console.error(
      'Error during story parsing and portrait generation flow:',
      error
    );
    throw new Error(
      'Failed to process the story. The AI model may be temporarily unavailable.'
    );
  }
}

/**
 * Step 2: Generates audio for the provided (and potentially edited) dialogue segments.
 */
export async function generateStoryAudio(
  segments: DialogueSegment[]
): Promise<StorySegmentWithAudio[]> {
  console.log('Starting TTS generation for refined segments...');
  if (!segments || segments.length === 0) {
    console.error('Validation Error: Segments for audio generation cannot be empty.');
    throw new Error('No dialogue segments provided for audio generation.');
  }

  try {
    const { audioDataUri } = await generateEmotionalTTS({ segments });
    console.log('TTS generation successful.');

    // Attach the single audio URI to the first segment for the player to use.
    const segmentsWithAudio: StorySegmentWithAudio[] = segments.map(
      (segment, index) => {
        if (index === 0) {
          return {
            ...segment,
            audioUri: audioDataUri,
          };
        }
        return segment;
      }
    );

    console.log('Story audio processing finished successfully.');
    return segmentsWithAudio;
  } catch (error) {
    console.error('Error during TTS generation flow:', error);
    throw new Error(
      'There was an issue generating audio. The AI model may be temporarily unavailable, please try again.'
    );
  }
}
