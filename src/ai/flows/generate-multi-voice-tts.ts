
'use server';

/**
 * @fileOverview Implements an advanced AI-driven text-to-speech system for generating
 * multi-cast narrative audio. This flow assigns unique voices to characters and
 * generates a single audio file with different speakers using SSML.
 *
 * - generateMultiVoiceTTS - A function that generates expressive speech for a given story.
 * - GenerateMultiVoiceTTSInput - The input type for the function.
 * - GenerateMultiVoiceTTSOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import SsmlBuilder from 'ssml-builder';
import { DialogueSegmentSchema, CharacterSchema } from '@/ai/schemas';

const GenerateMultiVoiceTTSInputSchema = z.object({
  segments: z.array(DialogueSegmentSchema).describe('An array of dialogue segments for a scene.'),
  characters: z.array(CharacterSchema).describe('A list of unique character objects with voice assignments.'),
});
export type GenerateMultiVoiceTTSInput = z.infer<typeof GenerateMultiVoiceTTSInputSchema>;

const GenerateMultiVoiceTTSOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The audio data URI of the generated speech in WAV format.'),
});
export type GenerateMultiVoiceTTSOutput = z.infer<typeof GenerateMultiVoiceTTSOutputSchema>;

export async function generateMultiVoiceTTS(input: GenerateMultiVoiceTTSInput): Promise<GenerateMultiVoiceTTSOutput> {
  return generateMultiVoiceTTSFlow(input);
}

const generateMultiVoiceTTSFlow = ai.defineFlow(
  {
    name: 'generateMultiVoiceTTSFlow',
    inputSchema: GenerateMultiVoiceTTSInputSchema,
    outputSchema: GenerateMultiVoiceTTSOutputSchema,
  },
  async ({ segments, characters }) => {
    // Create a map of character names to their AI-assigned voice IDs.
    const characterVoiceMap = new Map<string, string>();
     characters.forEach(char => {
        if (char.voiceId) {
            characterVoiceMap.set(char.name, char.voiceId);
        }
    });
    // Ensure the narrator always has a voice.
    if (!characterVoiceMap.has('Narrator')) {
        characterVoiceMap.set('Narrator', 'en-US-Standard-A');
    }

    // Use ssml-builder to construct the complex speech synthesis prompt.
    // The root element must be <speak> for the TTS service.
    let ssml = new SsmlBuilder({ root: true });
    segments.forEach(segment => {
      const voice = characterVoiceMap.get(segment.character);
      
      // If a character speaks multiple lines in a row, add a small pause for natural breath.
      ssml.pause('150ms');

      if (voice) {
        // The <voice> tag changes the speaker for this segment of text.
        const voiceElement = ssml.voice({name: voice});
        // The <prosody> tag instructs the AI on the emotional delivery.
        voiceElement.prosody({
            rate: 'medium', // We can adjust this later if needed
            pitch: 'medium' // We can adjust this later if needed
        }, `(${segment.emotion}) ${segment.dialogue}`);
      } else {
         // This is a fallback for any text not assigned to a voiced character (e.g., narrator).
         ssml.prosody({
            rate: 'medium',
            pitch: 'medium'
        }, `(${segment.emotion}) ${segment.dialogue}`);
      }
    });

    const ssmlString = ssml.toString();
    
    // Generate the audio using the single, comprehensive SSML string.
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: { responseModalities: ['AUDIO'] },
      prompt: ssmlString,
    });

    if (!media) {
      throw new Error('No media returned from TTS generation.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {audioDataUri};
  }
);


/**
 * Converts raw PCM audio data into a Base64-encoded WAV format string.
 * @param pcmData The raw PCM audio data from the TTS model.
 * @returns A Promise that resolves to a Base64-encoded string of the WAV file.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
