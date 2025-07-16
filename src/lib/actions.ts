
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
import {
  generateCharacterPortraits as generateCharacterPortraitsFlow
} from '@/ai/flows/generate-character-portraits';
import { generateEmotionalTTS } from '@/ai/flows/generate-emotional-tts';
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

// A predefined list of available high-quality voices.
const availableVoices = [
  'en-US-Standard-A', 'en-US-Standard-B', 'en-US-Standard-C', 
  'en-US-Standard-D', 'en-US-Standard-E', 'en-US-Standard-F',
  'en-US-Standard-G', 'en-US-Standard-H', 'en-US-Standard-I', 'en-US-Standard-J',
  'en-US-Wavenet-A', 'en-US-Wavenet-B', 'en-US-Wavenet-C', 'en-US-Wavenet-D',
  'en-US-Wavenet-E', 'en-US-Wavenet-F', 'en-US-Wavenet-G', 'en-US-Wavenet-H',
  'en-US-Wavenet-I', 'en-US-Wavenet-J'
];

/**
 * Generates audio for a story, assigning a unique voice to each character.
 * @param segments An array of DialogueSegment objects.
 * @returns A Promise that resolves to an array of StorySegmentWithAudio, each containing its own audio URI.
 * @throws An error if the input segments array is empty.
 */
export async function generateStoryAudio(
  segments: DialogueSegment[]
): Promise<StorySegmentWithAudio[]> {
  console.log('Starting per-segment TTS generation with unique voices...');
  if (!segments || segments.length === 0) {
    const errorMsg = 'Validation Error: Segments for audio generation cannot be empty.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    const uniqueCharacters = [...new Set(segments.map(s => s.character))];
    const characterVoiceMap = new Map<string, string>();
    uniqueCharacters.forEach((char, index) => {
        // We assign a consistent voice from our available list.
        characterVoiceMap.set(char, availableVoices[index % availableVoices.length]);
    });

    const audioPromises = segments.map(async (segment) => {
      // Narrator segments are handled differently, often with a more neutral voice.
      // For now, we'll assign one from the map, but this could be customized.
      const voice = characterVoiceMap.get(segment.character) || availableVoices[0];
      
      const { audioDataUri } = await generateEmotionalTTS({ 
          dialogue: segment.dialogue, 
          emotion: segment.emotion, 
          voice 
      });

      return {
        ...segment,
        audioUri: audioDataUri,
      };
    });

    const storyWithAudio = await Promise.all(audioPromises);
    
    console.log('Per-segment audio processing finished successfully.');
    return storyWithAudio;

  } catch (error) {
    console.error('Fatal Error during per-segment TTS generation flow:', { error });
    throw new Error('There was an issue generating the audio.');
  }
}


/**
 * Analysis: Scans the story for literary devices.
 */
export async function analyzeLiteraryDevices(storyText: string): Promise<LiteraryDevice[]> {
    console.log('Calling analyzeLiteraryDevices action...');
    try {
        const result = await analyzeLiteraryDevicesFlow({ storyText });
        return result.devices;
    } catch (e: any) {
        console.error('Error in analyzeLiteraryDevices action:', e);
        throw new Error('Failed to analyze literary devices.');
    }
}

/**
 * Analysis: Analyzes dialogue dynamics.
 */
export async function analyzeDialogueDynamics(storyText: string): Promise<DialogueDynamics> {
    console.log('Calling analyzeDialogueDynamics action...');
    try {
       return await analyzeDialogueDynamicsFlow({ storyText });
    } catch (e: any) {
        console.error('Error in analyzeDialogueDynamics action:', e);
        throw new Error('Failed to analyze dialogue dynamics.');
    }
}

/**
 * Analysis: Identifies and suggests inversions for literary tropes.
 */
export async function invertTropes(storyText: string): Promise<Trope[]> {
    console.log('Calling invertTropes action...');
    try {
        const result = await invertTropesFlow({ storyText });
        return result.tropes;
    } catch (e: any) {
        console.error('Error in invertTropes action:', e);
        throw new Error('Failed to analyze tropes.');
    }
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
