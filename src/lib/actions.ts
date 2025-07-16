
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
import { analyzePacing as analyzePacingFlow } from '@/ai/flows/analyze-pacing';

import { z } from 'zod';
import {
  type Character,
  type LiteraryDevice as ImportedLiteraryDevice,
  type DialogueDynamics as ImportedDialogueDynamics,
  type Trope as ImportedTrope,
  type ChatMessage,
  type NarratorBias,
  type PacingSegment as ImportedPacingSegment,
} from '@/ai/schemas';

// Re-exporting types for easy use in client components, maintaining a single source of truth.
export type DialogueSegment = ImportedDialogueSegment;
export type CharacterPortrait = { name: string; portraitDataUri: string };
export type LiteraryDevice = ImportedLiteraryDevice;
export type DialogueDynamics = ImportedDialogueDynamics;
export type Trope = ImportedTrope;
export type PacingSegment = ImportedPacingSegment;
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
            const errorMsg = 'Parsing Error: Could not parse any dialogue from the provided text.';
            console.error(errorMsg);
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
 * This is now done on a per-segment basis to allow for line-by-line regeneration.
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
        characterVoiceMap.set(char, availableVoices[index % availableVoices.length]);
    });

    const audioPromises = segments.map(async (segment) => {
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
 * Regenerates audio for a single dialogue segment with a specified voice.
 * @param segment The dialogue segment to regenerate.
 * @param voice The voice to use for the generation.
 * @returns A promise that resolves to the new audio data URI.
 */
export async function regenerateSingleLineAudio(segment: DialogueSegment, voice: string): Promise<string> {
    console.log(`Regenerating audio for: "${segment.dialogue}" with voice ${voice}`);
    try {
        const { audioDataUri } = await generateEmotionalTTS({
            dialogue: segment.dialogue,
            emotion: segment.emotion,
            voice: voice,
        });
        console.log('Single line regeneration successful.');
        return audioDataUri;
    } catch (error) {
        console.error('Fatal Error during single line regeneration flow:', { error });
        throw new Error('There was an issue regenerating the audio for this line.');
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
    try {
      const result = await characterChatFlow({ character, storyText, history, userMessage });
      return result.response;
    } catch (e: any) {
        console.error('Error in getCharacterResponse action:', e);
        throw new Error('Failed to get character response.');
    }
}

/**
 * Generation: Rewrites the story with a biased narrator.
 */
export async function getBiasedStory(storyText: string, bias: NarratorBias): Promise<string> {
    console.log('Calling getBiasedStory action...');
    try {
      const result = await applyNarratorBiasFlow({ storyText, bias });
      return result.biasedStoryText;
    } catch (e: any) {
        console.error('Error in getBiasedStory action:', e);
        throw new Error('Failed to apply narrator bias.');
    }
}


/**
 * Analysis: Analyzes story pacing.
 */
export async function analyzeStoryPacing(storyText: string): Promise<PacingSegment[]> {
    console.log('Calling analyzeStoryPacing action...');
    try {
        const result = await analyzePacingFlow({ storyText });
        return result.segments;
    } catch (e: any) {
        console.error('Error in analyzeStoryPacing action:', e);
        throw new Error('Failed to analyze story pacing.');
    }
}


// ##################################################################################
// ##                          SEAM: NEW FEATURE STUBS                             ##
// ## The following actions are placeholders for planned features. They define     ##
// ## the "seams" of our application and allow the UI to be built out before       ##
// ## the AI logic is fully implemented.                                           ##
// ##################################################################################

/**
 * [PLANNED FEATURE] Suggests "showing" alternatives for "telling" sentences.
 * The AI will first identify sentences that are good candidates for this transformation.
 * @param storyText The full text of the story.
 * @returns A promise resolving to an array of suggestions.
 */
export async function getShowDontTellSuggestions(storyText: string): Promise<any[]> {
  console.log('SEAM CALLED: getShowDontTellSuggestions');
  // AI FLOW to be created: `suggestShowDontTellFlow`
  // This is a placeholder. In the future, this will call a Genkit flow.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  console.warn('`getShowDontTellSuggestions` is not implemented yet.');
  return [];
}

/**
 * [PLANNED FEATURE] Scans the entire story for continuity errors or character inconsistencies.
 * @param storyText The full text of the story.
 * @returns A promise resolving to an array of identified inconsistencies.
 */
export async function findInconsistencies(storyText: string): Promise<any[]> {
  console.log('SEAM CALLED: findInconsistencies');
  // AI FLOW to be created: `findInconsistenciesFlow`
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  console.warn('`findInconsistencies` is not implemented yet.');
  return [];
}

/**
 * [PLANNED FEATURE] Analyzes dialogue for subtext—the unspoken emotion behind the words.
 * @param dialogueSegment A single segment of dialogue to analyze.
 * @returns A promise resolving to a subtext analysis object.
 */
export async function analyzeSubtext(dialogueSegment: DialogueSegment): Promise<any> {
  console.log('SEAM CALLED: analyzeSubtext');
  // AI FLOW to be created: `analyzeSubtextFlow`
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  console.warn('`analyzeSubtext` is not implemented yet.');
  return null;
}

/**
 * [PLANNED FEATURE] Rewrites a summary of the story from a different character's perspective.
 * @param storyText The full text of the story.
 * @param characterName The name of the character whose perspective to adopt.
 * @param role The role to cast them in ('Protagonist' or 'Antagonist').
 * @returns A promise resolving to the rewritten story summary.
 */
export async function shiftPerspective(storyText: string, characterName: string, role: 'Protagonist' | 'Antagonist'): Promise<string> {
  console.log('SEAM CALLED: shiftPerspective');
  // AI FLOW to be created: `shiftPerspectiveFlow`
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  console.warn('`shiftPerspective` is not implemented yet.');
  return `This is a placeholder summary. The 'shiftPerspective' feature for ${characterName} as ${role} is not yet implemented.`;
}

/**
 * [PLANNED FEATURE] Intelligently selects a voice for each character based on their description.
 * @param characters An array of character objects.
 * @returns A promise resolving to a map of character names to voice IDs.
 */
export async function getAICastingChoices(characters: Character[]): Promise<Map<string, string>> {
  console.log('SEAM CALLED: getAICastingChoices');
  // AI FLOW to be created: `aiCastingDirectorFlow`
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  console.warn('`getAICastingChoices` is not implemented yet.');
  // For now, return the same programmatic mapping we currently use.
  const characterVoiceMap = new Map<string, string>();
  characters.forEach((char, index) => {
      characterVoiceMap.set(char.name, availableVoices[index % availableVoices.length]);
  });
  return characterVoiceMap;
}
