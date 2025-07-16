
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
import { getShowDontTellSuggestions as getShowDontTellSuggestionsFlow } from '@/ai/flows/show-dont-tell';
import { findInconsistencies as findInconsistenciesFlow } from '@/ai/flows/consistency-guardian';
import { analyzeSubtext as analyzeSubtextFlow } from '@/ai/flows/analyze-subtext';
import { shiftPerspective as shiftPerspectiveFlow } from '@/ai/flows/shift-perspective';
import { generateSoundDesign as generateSoundDesignFlow } from '@/ai/flows/generate-sound-design';

import { z } from 'zod';
import {
  type Character as ImportedCharacter,
  type LiteraryDevice as ImportedLiteraryDevice,
  type DialogueDynamics as ImportedDialogueDynamics,
  type Trope as ImportedTrope,
  type ChatMessage,
  type NarratorBias,
  type PacingSegment as ImportedPacingSegment,
  type ShowDontTellSuggestion as ImportedShowDontTellSuggestion,
  type ConsistencyIssue as ImportedConsistencyIssue,
  type SubtextAnalysis as ImportedSubtextAnalysis,
  type Perspective as ImportedPerspective,
  type SoundEffect as ImportedSoundEffect,
} from '@/ai/schemas';

// Re-exporting types for easy use in client components, maintaining a single source of truth.
export type DialogueSegment = ImportedDialogueSegment;
export type Character = ImportedCharacter;
export type CharacterPortrait = { name: string; portraitDataUri: string };
export type LiteraryDevice = ImportedLiteraryDevice;
export type DialogueDynamics = ImportedDialogueDynamics;
export type Trope = ImportedTrope;
export type PacingSegment = ImportedPacingSegment;
export type ShowDontTellSuggestion = ImportedShowDontTellSuggestion;
export type ConsistencyIssue = ImportedConsistencyIssue;
export type SubtextAnalysis = ImportedSubtextAnalysis;
export type Perspective = ImportedPerspective;
export type SoundEffect = ImportedSoundEffect;
export type { ChatMessage, NarratorBias };

/**
 * Defines the shape of a sound effect after a URL has been found for it.
 */
export type SoundEffectWithUrl = SoundEffect & { soundUrl: string };


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
    console.log('Starting story parsing and AI casting...');
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
        console.log('Story parsing and AI casting successful.');
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
 * Generates audio for a story, using the AI-chosen voice for each character.
 * @param segments An array of DialogueSegment objects.
 * @param characters An array of Character objects which includes the AI-chosen voiceId.
 * @returns A Promise that resolves to an array of StorySegmentWithAudio, each containing its own audio URI.
 * @throws An error if the input segments array is empty.
 */
export async function generateStoryAudio(
  segments: DialogueSegment[],
  characters: Character[]
): Promise<StorySegmentWithAudio[]> {
  console.log('Starting per-segment TTS generation with AI-chosen voices...');
  if (!segments || segments.length === 0) {
    const errorMsg = 'Validation Error: Segments for audio generation cannot be empty.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    const characterVoiceMap = new Map<string, string>();
    characters.forEach(char => {
        if (char.voiceId) {
            characterVoiceMap.set(char.name, char.voiceId);
        }
    });
    // Add a default for the narrator
    characterVoiceMap.set('Narrator', 'en-US-Standard-A');

    const audioPromises = segments.map(async (segment) => {
      // Use the AI-chosen voice, or a default if one isn't found (should not happen in normal flow).
      const voice = characterVoiceMap.get(segment.character) || 'en-US-Standard-A';
      
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


/**
 * Suggests "showing" alternatives for "telling" sentences.
 * @param storyText The full text of the story.
 * @returns A promise resolving to an array of suggestions.
 */
export async function getShowDontTellSuggestions(storyText: string): Promise<ShowDontTellSuggestion[]> {
  console.log('Calling getShowDontTellSuggestions action...');
  try {
    const result = await getShowDontTellSuggestionsFlow({ storyText });
    return result.suggestions;
  } catch(e: any) {
    console.error('Error in getShowDontTellSuggestions action:', e);
    throw new Error('Failed to get "Show, Don\'t Tell" suggestions.');
  }
}

/**
 * Scans the entire story for continuity errors or character inconsistencies.
 * @param storyText The full text of the story.
 * @returns A promise resolving to an array of identified inconsistencies.
 */
export async function findInconsistencies(storyText: string): Promise<ConsistencyIssue[]> {
  console.log('Calling findInconsistencies action...');
   try {
    const result = await findInconsistenciesFlow({ storyText });
    return result.issues;
  } catch(e: any) {
    console.error('Error in findInconsistencies action:', e);
    throw new Error('Failed to find inconsistencies.');
  }
}

/**
 * Analyzes dialogue for subtext—the unspoken emotion behind the words.
 * @param storyText The full text of the story.
 * @returns A promise resolving to an array of subtext analyses.
 */
export async function analyzeSubtext(storyText: string): Promise<SubtextAnalysis[]> {
  console.log('Calling analyzeSubtext action...');
  try {
    const result = await analyzeSubtextFlow({ storyText });
    return result.analyses;
  } catch(e: any) {
    console.error('Error in analyzeSubtext action:', e);
    throw new Error('Failed to analyze subtext.');
  }
}

/**
 * Rewrites a summary of the story from a different character's perspective.
 * @param storyText The full text of the story.
 * @param characterName The name of the character whose perspective to adopt.
 * @param role The role to cast them in ('Protagonist' or 'Antagonist').
 * @returns A promise resolving to the rewritten story summary.
 */
export async function shiftPerspective(storyText: string, characterName: string, role: 'Protagonist' | 'Antagonist'): Promise<Perspective> {
  console.log('Calling shiftPerspective action...');
  try {
    return await shiftPerspectiveFlow({ storyText, characterName, role });
  } catch(e: any) {
    console.error('Error in shiftPerspective action:', e);
    throw new Error('Failed to shift perspective.');
  }
}

/**
 * Scans the story for sound effect cues and provides placeholder URLs.
 * @param storyText The full text of the story.
 * @returns A promise resolving to an array of sound effects with URLs.
 */
export async function getSoundDesign(storyText: string): Promise<SoundEffectWithUrl[]> {
  console.log('Calling getSoundDesign action...');
  try {
    const { soundEffects } = await generateSoundDesignFlow({ storyText });

    if (soundEffects.length === 0) {
      return [];
    }

    // In a real application, you would use the `soundQuery` to search a
    // licensed audio library API and get a real URL.
    // For this demo, we will use a consistent, high-quality placeholder sound.
    const placeholderSoundUrl = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';

    return soundEffects.map(effect => ({
      ...effect,
      soundUrl: placeholderSoundUrl,
    }));
  } catch (e: any) {
    console.error('Error in getSoundDesign action:', e);
    // Return empty array on failure as this is a non-critical enhancement.
    return [];
  }
}
