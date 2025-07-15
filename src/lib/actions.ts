
'use server';

/**
 * @fileOverview This file contains the primary server actions for the VividVoice application.
 * These actions orchestrate calls to various Genkit AI flows and are designed to be
 * safely called from client components.
 */

import {
  parseDialogue,
  type DialogueSegment as ImportedDialogueSegment,
} from '@/ai/flows/parse-dialogue';
import { generateEmotionalTTS } from '@/ai/flows/generate-emotional-tts';
import {
  generateCharacterPortraits,
  type GenerateCharacterPortraitsOutput,
} from '@/ai/flows/generate-character-portraits';
import { analyzeLiteraryDevices as analyzeLiteraryDevicesFlow } from '@/ai/flows/analyze-literary-devices';
import { analyzeDialogueDynamics as analyzeDialogueDynamicsFlow } from '@/ai/flows/analyze-dialogue-dynamics';

import { z } from 'zod';
import {
  type Character,
  type LiteraryDevice as ImportedLiteraryDevice,
  type DialogueDynamics as ImportedDialogueDynamics,
} from '@/ai/schemas';

// Re-exporting types for easy use in client components, maintaining a single source of truth.
export type DialogueSegment = ImportedDialogueSegment;
export type CharacterPortrait = { name: string; portraitDataUri: string };
export type LiteraryDevice = ImportedLiteraryDevice;
export type DialogueDynamics = ImportedDialogueDynamics;

/**
 * Defines the shape of a story segment after audio has been generated,
 * including an optional URI for the audio data.
 */
const StorySegmentWithAudioSchema = z.object({
  character: z.string(),
  dialogue: z.string(),
  emotion: z.string(),
  audioUri: z.string().optional(),
});
export type StorySegmentWithAudio = z.infer<typeof StorySegmentWithAudioSchema>;

/**
 * The consolidated result of the initial story processing step.
 */
type ParseStoryResult = {
  segments: DialogueSegment[];
  portraits: CharacterPortrait[];
  storyText: string;
};

/**
 * Step 1: Parses story text, generates character portraits, and analyzes literary devices.
 * This function is a key part of the application's performance strategy, as it runs
 * multiple independent AI tasks in parallel using Promise.all().
 *
 * @param storyText The raw story text input by the user.
 * @returns A Promise that resolves to a ParseStoryResult object containing the parsed
 *          segments, character portraits, and the original story text.
 * @throws An error if the story text is empty or if the primary dialogue parsing fails.
 */
export async function parseStory(
  storyText: string
): Promise<ParseStoryResult> {
  console.log('Starting parallel story parsing and character generation...');
  if (!storyText.trim()) {
    const errorMsg = 'Validation Error: Story text cannot be empty.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    // This is the core parallelization step. We initiate the dialogue parsing
    // and literary device analysis at the same time. Portrait generation depends
    // on the result of parsing, so it's handled subsequently.
    const [parsedResult] = await Promise.all([
      parseDialogue({ storyText }),
      // NOTE: Additional independent analyses can be added here to run in parallel.
    ]);
    
    // Validate the crucial parsing result.
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

    // Now, generate portraits for the extracted characters. This is a separate call.
    let finalPortraits: CharacterPortrait[] = [];
    if (parsedResult.characters.length > 0) {
      console.log('Generating character portraits...');
      try {
        finalPortraits = await generateCharacterPortraits({
          characters: parsedResult.characters,
        });
        console.log('Portrait generation successful.');
      } catch (portraitError) {
        console.error(
          'AI Portrait Generation Error: Failed to generate character portraits.',
          portraitError
        );
        // We allow the process to continue without portraits if this step fails.
      }
    }

    return {
      segments: parsedResult.segments,
      portraits: finalPortraits,
      storyText: storyText,
    };
  } catch (error) {
    console.error(
      'Fatal Error during story parsing flow:',
      { error }
    );
    throw new Error(
      'Failed to process the story. The AI model may have encountered an issue.'
    );
  }
}

/**
 * Step 2: Generates audio for each provided dialogue segment individually.
 * This function processes an array of segments, calling the TTS model for each one.
 *
 * @param segments An array of DialogueSegment objects, refined by the user in the editor.
 * @returns A Promise that resolves to an array of StorySegmentWithAudio, where each segment
 *          may have an `audioUri`.
 * @throws An error if the input segments array is empty.
 */
export async function generateStoryAudio(
  segments: DialogueSegment[]
): Promise<StorySegmentWithAudio[]> {
  console.log('Starting TTS generation for refined segments...');
  if (!segments || segments.length === 0) {
    const errorMsg = 'Validation Error: Segments for audio generation cannot be empty.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    // Generate audio for each segment concurrently.
    const audioPromises = segments.map(async (segment) => {
      // Don't generate audio for narrator segments that are just whitespace or empty.
      if ((segment.character.toLowerCase() === 'narrator' && segment.dialogue.trim() === '') || segment.dialogue.trim() === '') {
        return {
          ...segment,
          audioUri: undefined,
        }
      }
      
      try {
        // Each segment gets its own TTS call.
        const { audioDataUri } = await generateEmotionalTTS({ segments: [segment] });
        return {
          ...segment,
          audioUri: audioDataUri,
        };
      } catch (ttsError) {
        console.error(`TTS generation failed for segment: "${segment.dialogue.substring(0,30)}..."`, { error: ttsError });
        // Return segment without audio URI if an individual call fails.
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
    console.error('Fatal Error during TTS generation flow:', { error });
    throw new Error(
      'There was an issue generating the audio. The AI model may be temporarily unavailable, please try again.'
    );
  }
}


/**
 * Analysis Step: Scans the story for literary devices by calling its specific AI flow.
 *
 * @param storyText The raw story text to analyze.
 * @returns A Promise resolving to an array of detected LiteraryDevice objects.
 */
export async function analyzeLiteraryDevices(storyText: string): Promise<LiteraryDevice[]> {
    console.log('Starting literary device analysis...');
    if (!storyText.trim()) {
        const errorMsg = 'Validation Error: Story text for analysis cannot be empty.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        const result = await analyzeLiteraryDevicesFlow({ storyText });
        console.log(`Literary device analysis successful. Found ${result.devices.length} devices.`);
        return result.devices;
    } catch (error) {
        console.error('Fatal Error during literary device analysis flow:', { error });
        throw new Error('Failed to analyze literary devices. The AI model may have encountered an issue.');
    }
}

/**
 * Analysis Step: Analyzes dialogue dynamics by calling its specific AI flow.
 *
 * @param storyText The raw story text to analyze.
 * @returns A Promise resolving to a DialogueDynamics object containing the analysis.
 */
export async function analyzeDialogueDynamics(storyText: string): Promise<DialogueDynamics> {
    console.log('Starting dialogue dynamics analysis...');
    if (!storyText.trim()) {
        const errorMsg = 'Validation Error: Story text for analysis cannot be empty.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        const result = await analyzeDialogueDynamicsFlow({ storyText });
        console.log(`Dialogue dynamics analysis successful.`);
        return result;
    } catch (error) {
        console.error('Fatal Error during dialogue dynamics analysis flow:', { error });
        throw new Error('Failed to analyze dialogue dynamics. The AI model may have encountered an issue.');
    }
}
