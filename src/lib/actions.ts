'use server';

import {
  parseDialogue,
} from '@/ai/flows/parse-dialogue';
import { generateEmotionalTTS } from '@/ai/flows/generate-emotional-tts';
import {
  generateCharacterPortraits,
} from '@/ai/flows/generate-character-portraits';
import { analyzeLiteraryDevices as analyzeLiteraryDevicesFlow } from '@/ai/flows/analyze-literary-devices';
import { z } from 'zod';
import { type DialogueSegment as ImportedDialogueSegment, type Character, type LiteraryDevice as ImportedLiteraryDevice } from '@/ai/schemas';

// Re-exporting for use in client components
export type DialogueSegment = ImportedDialogueSegment;
export type CharacterPortrait = { name: string; portraitDataUri: string };
export type LiteraryDevice = ImportedLiteraryDevice;

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
  storyText: string;
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
        'Parsing Error: Could not parse any dialogue from the provided text. AI Output:',
        parsedResult
      );
      throw new Error(
        'Could not parse dialogue. Please ensure it has standard dialogue formatting (e.g., Character: Dialogue).'
      );
    }
    console.log(
      'Story parsing successful, found characters:',
      parsedResult.characters.map((c: Character) => c.name).join(', ')
    );

    // Now, generate portraits for the extracted characters.
    let portraits: CharacterPortrait[] = [];
    if (parsedResult.characters.length > 0) {
      console.log('Generating character portraits...');
      try {
        portraits = await generateCharacterPortraits({
          characters: parsedResult.characters,
        });
        console.log('Portrait generation successful.');
      } catch (portraitError) {
        console.error(
          'AI Portrait Generation Error: Failed to generate character portraits.',
          portraitError
        );
        // We can continue without portraits if this step fails, so we don't throw.
        // The UI will handle the missing portraits gracefully.
      }
    }

    return {
      segments: parsedResult.segments,
      portraits: portraits,
      storyText: storyText,
    };
  } catch (error) {
    console.error(
      'Fatal Error during story parsing flow:',
      error
    );
    throw new Error(
      'Failed to process the story. The AI model may have encountered an issue.'
    );
  }
}

/**
 * Step 2: Generates audio for each provided dialogue segment individually.
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
    const audioPromises = segments.map(async (segment) => {
      // Don't generate audio for narrator segments that are just whitespace or empty
      if ((segment.character === 'Narrator' && segment.dialogue.trim() === '') || segment.dialogue.trim() === '') {
        return {
          ...segment,
          audioUri: undefined,
        }
      }
      
      try {
        const { audioDataUri } = await generateEmotionalTTS({ segments: [segment] });
        return {
          ...segment,
          audioUri: audioDataUri,
        };
      } catch (ttsError) {
        console.error(`TTS generation failed for segment: "${segment.dialogue.substring(0,30)}..."`, ttsError);
        // Return segment without audio URI if an individual call fails
        return {
          ...segment,
          audioUri: undefined,
        }
      }
    });

    const segmentsWithAudio = await Promise.all(audioPromises);
    
    console.log('Story audio processing finished successfully.');
    return segmentsWithAudio;
  } catch (error) {
    console.error('Fatal Error during TTS generation flow:', error);
    throw new Error(
      'There was an issue generating the audio. The AI model may be temporarily unavailable, please try again.'
    );
  }
}


/**
 * Analysis Step: Scans the story for literary devices.
 */
export async function analyzeLiteraryDevices(storyText: string): Promise<LiteraryDevice[]> {
    console.log('Starting literary device analysis...');
    if (!storyText.trim()) {
        console.error('Validation Error: Story text for analysis cannot be empty.');
        throw new Error('No story text provided for analysis.');
    }

    try {
        const result = await analyzeLiteraryDevicesFlow({ storyText });
        console.log(`Literary device analysis successful. Found ${result.devices.length} devices.`);
        return result.devices;
    } catch (error) {
        console.error('Fatal Error during literary device analysis flow:', error);
        throw new Error('Failed to analyze literary devices. The AI model may have encountered an issue.');
    }
}
