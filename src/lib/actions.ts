
'use server';

/**
 * @fileOverview This file contains the primary server actions for the VividVoice application.
 * These actions orchestrate calls to various Genkit AI flows and are designed to be
 * safely called from client components. They act as the "seams" between the UI and the AI.
 */

import {
  parseDialogue,
  type DialogueSegment as ImportedDialogueSegment,
} from '@/ai/flows/parse-dialogue';
import { generateEmotionalTTS } from '@/ai/flows/generate-emotional-tts';
import {
  generateCharacterPortraits as generateCharacterPortraitsFlow
} from '@/ai/flows/generate-character-portraits';
import { analyzeLiteraryDevices as analyzeLiteraryDevicesFlow } from '@/ai/flows/analyze-literary-devices';
import { analyzeDialogueDynamics as analyzeDialogueDynamicsFlow } from '@/ai/flows/analyze-dialogue-dynamics';
import { invertTropes as invertTropesFlow } from '@/ai/flows/trope-inverter';
import { characterChat as characterChatFlow } from '@/ai/flows/character-chat';
import { applyNarratorBias as applyNarratorBiasFlow } from '@/ai/flows/unreliable-narrator';

import { z } from 'zod';
import {
  type Character,
  type LiteraryDevice as ImportedLiteraryDevice,
  type DialogueDynamics as ImportedDialogueDynamics,
  type Trope as ImportedTrope,
  type ChatMessage,
  type NarratorBias,
} from '@/ai/schemas';

// Re-exporting types for easy use in client components, maintaining a single source of truth.
export type DialogueSegment = ImportedDialogueSegment;
export type CharacterPortrait = { name: string; portraitDataUri: string };
export type LiteraryDevice = ImportedLiteraryDevice;
export type DialogueDynamics = ImportedDialogueDynamics;
export type Trope = ImportedTrope;
export type { Character, ChatMessage, NarratorBias };


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
 * Parses the dialogue from a story text.
 * @param storyText The raw story text.
 * @returns A promise resolving to the parsed segments and characters.
 */
export async function getParsedStory(storyText: string): Promise<{ segments: DialogueSegment[], characters: Character[] }> {
    console.log('Starting story parsing...');
     if (!storyText.trim()) {
        const errorMsg = 'Validation Error: Story text cannot be empty.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        const parsedResult = await parseDialogue({ storyText });
         if (!parsedResult || !parsedResult.segments || parsedResult.segments.length === 0) {
            console.error('Parsing Error: Could not parse any dialogue from the provided text.');
            throw new Error('Could not parse dialogue. Please ensure it has standard dialogue formatting.');
        }
        console.log('Story parsing successful.');
        return parsedResult;
    } catch (error) {
        console.error('Fatal Error during story parsing flow:', { error });
        throw new Error('Failed to process the story.');
    }
}

/**
 * Generates character portraits from character descriptions.
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
        console.error('AI Portrait Generation Error:', error);
        // We don't throw here, as portrait generation is non-critical.
        // We return an empty array and log the error.
        return [];
    }
}


/**
 * Generates audio for each provided dialogue segment individually.
 * @param segments An array of DialogueSegment objects.
 * @returns A Promise that resolves to an array of StorySegmentWithAudio.
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
    const audioPromises = segments.map(async (segment) => {
      if ((segment.character.toLowerCase() === 'narrator' && segment.dialogue.trim() === '') || segment.dialogue.trim() === '') {
        return { ...segment, audioUri: undefined };
      }
      
      try {
        const { audioDataUri } = await generateEmotionalTTS({ segments: [segment] });
        return { ...segment, audioUri: audioDataUri };
      } catch (ttsError) {
        console.error(`TTS generation failed for segment: "${segment.dialogue.substring(0,30)}..."`, { error: ttsError });
        return { ...segment, audioUri: undefined };
      }
    });

    const segmentsWithAudio = await Promise.all(audioPromises);
    console.log('Story audio processing finished successfully.');
    return segmentsWithAudio;
  } catch (error) {
    console.error('Fatal Error during TTS generation flow:', { error });
    throw new Error('There was an issue generating the audio.');
  }
}


/**
 * Analysis: Scans the story for literary devices.
 */
export async function analyzeLiteraryDevices(storyText: string): Promise<LiteraryDevice[]> {
    console.log('Calling analyzeLiteraryDevices action...');
    const result = await analyzeLiteraryDevicesFlow({ storyText });
    return result.devices;
}

/**
 * Analysis: Analyzes dialogue dynamics.
 */
export async function analyzeDialogueDynamics(storyText: string): Promise<DialogueDynamics> {
    console.log('Calling analyzeDialogueDynamics action...');
    return await analyzeDialogueDynamicsFlow({ storyText });
}

/**
 * Analysis: Identifies and suggests inversions for literary tropes.
 */
export async function invertTropes(storyText: string): Promise<Trope[]> {
    console.log('Calling invertTropes action...');
    const result = await invertTropesFlow({ storyText });
    return result.tropes;
}

/**
 * Interaction: Chats with a character from the story.
 */
export async function getCharacterResponse(character: Character, storyText: string, history: ChatMessage[], userMessage: string): Promise<string> {
    console.log('Calling getCharacterResponse action...');
    const result = await characterChatFlow({ character, storyText, history, userMessage });
    return result.response;
}

/**
 * Generation: Rewrites the story with a biased narrator.
 */
export async function getBiasedStory(storyText: string, bias: NarratorBias): Promise<string> {
    console.log('Calling getBiasedStory action...');
    const result = await applyNarratorBiasFlow({ storyText, bias });
    return result.biasedStoryText;
}
