
'use server';

/**
 * @fileOverview This file contains the primary server actions for the VividVoice application.
 * These actions orchestrate calls to various Genkit AI flows and are designed to be
 * safely called from client components. They act as the "seams" between the UI and the AI.
 */

import {
  parseDialogue as parseDialogueFlow,
} from '@/ai/flows/parse-dialogue';
import {
  type DialogueSegment as ImportedDialogueSegment,
  type Character as ImportedCharacter,
} from '@/ai/schemas';
import {
  generateCharacterPortraits as generateCharacterPortraitsFlow
} from '@/ai/flows/generate-character-portraits';
import { generateMultiVoiceTTS } from '@/ai/flows/generate-multi-voice-tts';
import { applyNarratorBias as applyNarratorBiasFlow } from '@/ai/flows/unreliable-narrator';
// import { generateSoundDesign as generateSoundDesignFlow } from '@/ai/flows/generate-sound-design';
import { generateElevenLabsTTS as generateElevenLabsTTSFlow } from '@/ai/flows/generate-elevenlabs-tts';
import { analyzeEmotionalTone as analyzeEmotionalToneFlow } from '@/ai/flows/analyze-emotional-tone';
import { emotionTagger } from '@/ai/flows/emotionTagger';

import {
  type NarratorBiasRange,
  type TranscriptSegment as ImportedTranscriptSegment,
} from '@/ai/schemas';

// Re-exporting types for easy use in client components, maintaining a single source of truth.
export type DialogueSegment = ImportedDialogueSegment;
export type Character = ImportedCharacter;
/**
 * Parses the dialogue from a story text. This is the first critical step in the story
 * processing pipeline. It now generates rich character profiles upfront.
 * @param storyText The raw story text.
 * @returns A promise resolving to the parsed segments and characters.
 */


/**
 * Parses the dialogue from a story text. This is the first critical step in the story
 * processing pipeline. It now generates rich character profiles upfront.
 * @param storyText The raw story text.
 * @returns A promise resolving to the parsed segments and characters.
 */
export async function getParsedStory(storyText: string): Promise<{ segments: DialogueSegment[], characters: Character[] }> {
    console.log('Starting story parsing and comprehensive character profile generation...');
     if (!storyText.trim()) {
        const errorMsg = 'Validation Error: Story text cannot be empty.';
        console.error({ action: 'getParsedStory', error: errorMsg });
        throw new Error(errorMsg);
    }

    try {
        const parsedResult = await parseDialogueFlow({ storyText });
         if (!parsedResult || !parsedResult.segments || parsedResult.segments.length === 0) {
            const errorMsg = 'Parsing Error: Could not parse any dialogue from the provided text.';
            console.error({ action: 'getParsedStory', error: errorMsg });
            throw new Error('Could not parse dialogue. Please ensure it has standard dialogue formatting.');
        }
        console.log('Story parsing and character profiling successful.');
        return parsedResult;
    } catch (error) {
        console.error('Fatal Error during getParsedStory action:', { error });
        throw new Error('Failed to process the story.');
    }
}

/**
 * Generates character portraits from character descriptions. This is a non-critical,
 * aesthetic enhancement.
 * @param characters An array of character objects with names and descriptions.
 * @returns A promise resolving to an array of character portraits.
 */
export async function getCharacterPortraits(characters: Character[]): Promise<CharacterPortrait[]> {
    console.log('Starting character portrait generation...');
    if (characters.length === 0) {
        return [];
    }
    try {
        const portraits = await generateCharacterPortraitsFlow({ characters });
        console.log('Portrait generation successful.');
        return portraits;
    } catch (error) {
        console.error('AI Portrait Generation Error in getCharacterPortraits action:', { error });
        // We don't throw here, as portrait generation is non-critical.
        // We return an empty array and log the error.
        return [];
    }
}


/**
 * Generates a single, cohesive audio file for an entire scene, along with a detailed transcript.
 * @param segments An array of DialogueSegment objects for the scene.
 * @param characters An array of Character objects which includes AI-chosen voice IDs.
 * @returns A Promise resolving to an object containing the audio data URI and the transcript.
 * @throws An error if the input segments array is empty.
 */
export async function generateMultiVoiceSceneAudio(
  segments: DialogueSegment[],
  characters: Character[]
): Promise<{ audioDataUri: string; transcript: TranscriptSegment[] }> {
  console.log('Starting multi-voice TTS scene generation...');
  if (!segments || segments.length === 0) {
    const errorMsg = 'Validation Error: Segments for audio generation cannot be empty.';
    console.error({ action: 'generateMultiVoiceSceneAudio', error: errorMsg });
    throw new Error(errorMsg);
  }
  
  try {
    const result = await generateMultiVoiceTTS({ segments, characters });
    console.log('Multi-voice scene audio generation finished successfully.');
    return result;

  } catch (error) {
    console.error('Fatal Error during generateMultiVoiceSceneAudio action:', { error });
    throw new Error('There was an issue generating the audio for the scene.');
  }
}



/**
 * Generation: Rewrites the story with a biased narrator.
 */
export async function getBiasedStory(storyText: string, bias: { startBias: string; endBias: string }): Promise<string> {
    console.log('Calling getBiasedStory action...');
    try {
      const result = await applyNarratorBiasFlow({ storyText, bias: bias as any });
      return result.biasedStoryText;
    } catch (e: any) {
        console.error('Error in getBiasedStory action:', { error: e });
        throw new Error('Failed to apply narrator bias.');
    }
}


 * @param text The text to be converted to speech.
 * @param voiceId The ElevenLabs voice ID to use.
 * @returns A promise resolving to the audio data URI.
 */
export async function generateElevenLabsAudio(text: string, voiceId: string): Promise<string> {
  console.log('Calling generateElevenLabsAudio action...');
  try {
    const result = await generateElevenLabsTTSFlow({ text, voiceId });
    return result.audioDataUri;
  } catch (e: any) {
    console.error('Error in generateElevenLabsAudio action:', { error: e });
    throw new Error('Failed to generate audio with ElevenLabs.');
  }
}

/**
 * Processes a story end-to-end and returns the generated audio URL.
 * @param storyText The raw story text.
 */
export async function processStoryAndGenerateAudio(storyText: string): Promise<string> {
  if (!storyText.trim()) {
    throw new Error('Story text cannot be empty.');
  }
  const { segments, characters } = await parseDialogueFlow({ storyText });
  const { segments: emotionSegments } = await emotionTagger({ segments, characters });
  const { audioDataUri } = await generateMultiVoiceTTS({ segments: emotionSegments, characters });
  return audioDataUri;
}
