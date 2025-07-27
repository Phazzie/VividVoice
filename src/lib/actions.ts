
'use server';

/**
 * @fileOverview This file contains the primary server actions for the VividVoice application.
 * These actions orchestrate calls to various Genkit AI flows and are designed to be
 * safely called from client components. They act as the "seams" between the UI and the AI.
 */

import {
  parseDialogue as parseDialogueFlow,
  type DialogueSegment as ImportedDialogueSegment,
  type Character as ImportedCharacter,
} from '@/ai/flows/parse-dialogue';
import {
  generateCharacterPortraits as generateCharacterPortraitsFlow
} from '@/ai/flows/generate-character-portraits';
import { generateMultiVoiceTTS } from '@/ai/flows/generate-multi-voice-tts';
import { analyzeLiteraryDevices as analyzeLiteraryDevicesFlow } from '@/ai/flows/analyze-literary-devices';
import { analyzeDialogueDynamics as analyzeDialogueDynamicsFlow } from '@/ai/flows/analyze-dialogue-dynamics';
import { invertTropes as invertTropesFlow } from '@/ai/flows/trope-inverter';
import { characterChat as characterChatFlow } from '@/ai/flows/character-chat';
import { applyNarratorBias as applyNarratorBiasFlow } from '@/ai/flows/unreliable-narrator';
import { analyzeStoryPacing as analyzeStoryPacingFlow } from '@/ai/flows/analyze-pacing';
import { getShowDontTellSuggestions as getShowDontTellSuggestionsFlow } from '@/ai/flows/show-dont-tell';
import { findInconsistencies as findInconsistenciesFlow } from '@/ai/flows/consistency-guardian';
import { analyzeSubtext as analyzeSubtextFlow } from '@/ai/flows/analyze-subtext';
import { shiftPerspective as shiftPerspectiveFlow } from '@/ai/flows/shift-perspective';
import { generateSoundDesign as generateSoundDesignFlow } from '@/ai/flows/generate-sound-design';
import { generateElevenLabsTTS as generateElevenLabsTTSFlow } from '@/ai/flows/generate-elevenlabs-tts';
import { analyzeEmotionalTone as analyzeEmotionalToneFlow } from '@/ai/flows/analyze-emotional-tone';

import {
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
  type TranscriptSegment as ImportedTranscriptSegment,
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
export type TranscriptSegment = ImportedTranscriptSegment;
export type { ChatMessage, NarratorBias };

/**
 * Defines the shape of a sound effect after a URL has been found for it.
 */
export type SoundEffectWithUrl = SoundEffect & { soundUrl: string };

/**
 * Parses the dialogue from a story text. This is the first critical step in the story
 * processing pipeline. It now generates rich character profiles upfront.
 * @param storyText The raw story text.
 * @returns A promise resolving to the parsed segments and characters.
 */
export async function getFullStoryAnalysis(storyText: string): Promise<{
  segments: DialogueSegment[];
  characters: Character[];
  characterPortraits: CharacterPortrait[];
  dialogueDynamics: DialogueDynamics;
  literaryDevices: { devices: LiteraryDevice[] };
  pacing: { segments: PacingSegment[] };
  tropes: { tropes: Trope[] };
  showDontTellSuggestions: { suggestions: ShowDontTellSuggestion[] };
  consistencyIssues: { issues: ConsistencyIssue[] };
  subtextAnalyses: { analyses: SubtextAnalysis[] };
  soundEffects: SoundEffectWithUrl[] | null;
  errors: Record<string, string>;
}> {
  console.log('Starting full story analysis...');
  if (!storyText.trim()) {
    const errorMsg = 'Validation Error: Story text cannot be empty.';
    console.error({ action: 'getFullStoryAnalysis', error: errorMsg });
    throw new Error(errorMsg);
  }

  try {
    // 1. Get the foundational parsed story
    const parsedStory = await getParsedStory(storyText);
    if (!parsedStory || !parsedStory.segments || parsedStory.segments.length === 0) {
      const errorMsg = 'Parsing Error: Could not parse any dialogue from the provided text.';
      console.error({ action: 'getFullStoryAnalysis', error: errorMsg });
      throw new Error('Could not parse dialogue. Please ensure it has standard dialogue formatting.');
    }

    const { segments, characters } = parsedStory;

    // 2. Analyze emotional tone for each segment
    const segmentsWithEmotions = await Promise.all(
      segments.map(async (segment, index) => {
        if (segment.character === 'Narrator') {
          return segment;
        }
        const context = segments.slice(Math.max(0, index - 2), Math.min(segments.length, index + 3)).map(s => `${s.character}: ${s.dialogue}`).join('\n');
        const { emotion } = await analyzeEmotionalToneFlow({ dialogue: segment.dialogue, context });
        return { ...segment, emotion };
      })
    );

    // 3. Orchestrate all other analyses in parallel
    const results = await Promise.allSettled([
      getCharacterPortraits(characters),
      analyzeDialogueDynamicsFlow({ storyText }),
      analyzeLiteraryDevicesFlow({ storyText }),
      analyzeStoryPacingFlow({ storyText }),
      invertTropesFlow({ storyText }),
      getShowDontTellSuggestionsFlow({ storyText }),
      findInconsistenciesFlow({ storyText }),
      analyzeSubtextFlow({ storyText }),
      getSoundDesign(storyText),
    ]);

    const [
      characterPortraits,
      dialogueDynamics,
      literaryDevices,
      pacing,
      tropes,
      showDontTellSuggestions,
      consistencyIssues,
      subtextAnalyses,
      soundEffects,
    ] = results.map(r => r.status === 'fulfilled' ? r.value : null);

    const errors: Record<string, string> = {};
    if (results[1].status === 'rejected') errors.dialogueDynamics = results[1].reason.message;
    if (results[2].status === 'rejected') errors.literaryDevices = results[2].reason.message;
    if (results[3].status === 'rejected') errors.pacing = results[3].reason.message;
    if (results[4].status === 'rejected') errors.tropes = results[4].reason.message;
    if (results[5].status === 'rejected') errors.showDontTell = results[5].reason.message;
    if (results[6].status === 'rejected') errors.consistency = results[6].reason.message;
    if (results[7].status === 'rejected') errors.subtext = results[7].reason.message;
    if (results[8].status === 'rejected') errors.soundEffects = results[8].reason.message;

    console.log('Full story analysis successful.');

    // 4. Consolidate and return all results
    return {
      segments: segmentsWithEmotions,
      characters,
      characterPortraits: characterPortraits || [],
      dialogueDynamics: dialogueDynamics || { summary: '', powerBalance: [], pacing: { overallWordsPerTurn: 0, characterPacing: [] } },
      literaryDevices: literaryDevices || { devices: [] },
      pacing: pacing || { segments: [] },
      tropes: tropes || { tropes: [] },
      showDontTellSuggestions: showDontTellSuggestions || { suggestions: [] },
      consistencyIssues: consistencyIssues || { issues: [] },
      subtextAnalyses: subtextAnalyses || { analyses: [] },
      soundEffects: soundEffects || [],
      errors,
    };
  } catch (error) {
    console.error('Fatal Error during getFullStoryAnalysis action:', { error });
    throw new Error('Failed to process the story.');
  }
}

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
 * Interaction: Chats with a character from the story using their rich, pre-generated profile.
 */
export async function getCharacterResponse(
  character: Character,
  history: ChatMessage[],
  userMessage: string,
  storyText: string
): Promise<string> {
  console.log('Calling getCharacterResponse action...');
  try {
    const result = await characterChatFlow({ character, history, userMessage, storyText });
    return result.response;
  } catch (e: unknown) {
    console.error('Error in getCharacterResponse action:', { error: e });
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
        console.error('Error in getBiasedStory action:', { error: e });
        throw new Error('Failed to apply narrator bias.');
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
    console.error('Error in shiftPerspective action:', { error: e });
    throw new Error('Failed to shift perspective.');
  }
}


const soundLibrary: Record<string, string> = {
  'door creak': 'https://actions.google.com/sounds/v1/doors/creaking_door_opening.ogg',
  'wind': 'https://actions.google.com/sounds/v1/weather/windy_day.ogg',
  'rain': 'https://actions.google.com/sounds/v1/weather/rain.ogg',
  'thunder': 'https://actions.google.com/sounds/v1/weather/thunder_crack.ogg',
  'footsteps': 'https://actions.google.com/sounds/v1/movement/footsteps_on_wood.ogg',
  'glass break': 'https://actions.google.com/sounds/v1/impacts/glass_breaking.ogg',
  'scream': 'https://actions.google.com/sounds/v1/human_voices/scream.ogg',
  'whisper': 'https://actions.google.com/sounds/v1/human_voices/whisper.ogg',
  'clock tick': 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
  'fire crackle': 'https://actions.google.com/sounds/v1/fire/fire.ogg',
};
const defaultSound = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';


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
    // For this demo, we will map the query to our small, curated library.
    return soundEffects.map((effect: any) => {
      const lowerQuery = effect.soundQuery.toLowerCase();
      // Find the best match in our library
      const matchedKey = Object.keys(soundLibrary).find(key => lowerQuery.includes(key));
      return {
        ...effect,
        soundUrl: matchedKey ? soundLibrary[matchedKey] : defaultSound,
      }
    });
  } catch (e: any) {
    console.error('Error in getSoundDesign action:', { error: e });
    // Return empty array on failure as this is a non-critical enhancement.
    return [];
  }
}

/**
 * Generates audio for a single text segment using ElevenLabs.
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
