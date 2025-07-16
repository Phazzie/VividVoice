
'use server';

/**
 * @fileOverview Implements an advanced AI-driven text-to-speech system for generating
 * multi-cast narrative audio. This flow assigns unique voices to characters and
 * generates a single audio file with different speakers.
 *
 * - generateMultiVoiceTTS - A function that generates expressive speech for a given story.
 * - GenerateMultiVoiceTTSInput - The input type for the function.
 * - GenerateMultiVoiceTTSOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import SsmlBuilder from 'ssml-builder';
import { DialogueSegmentSchema } from '@/ai/schemas';

const GenerateMultiVoiceTTSInputSchema = z.object({
  segments: z.array(DialogueSegmentSchema).describe('An array of dialogue segments for a scene.'),
  characters: z.array(z.string()).describe('A list of unique character names in the scene to be assigned voices.'),
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

// A predefined list of available high-quality voices.
const availableVoices = [
  'Alloy', 'Echo', 'Fable', 'Onyx', 'Nova', 'Shimmer', 'Luna', 'Sol'
];

const generateMultiVoiceTTSFlow = ai.defineFlow(
  {
    name: 'generateMultiVoiceTTSFlow',
    inputSchema: GenerateMultiVoiceTTSInputSchema,
    outputSchema: GenerateMultiVoiceTTSOutputSchema,
  },
  async ({ segments, characters }) => {
    // Assign a unique, consistent voice to each character.
    const characterVoiceMap = new Map<string, string>();
    characters.forEach((char, index) => {
      // Exclude Narrator as they will use the default voice.
      if (char.toLowerCase() !== 'narrator') {
        characterVoiceMap.set(char, availableVoices[index % availableVoices.length]);
      }
    });

    // Use ssml-builder to construct the complex speech synthesis prompt.
    const ssml = new SsmlBuilder();
    const speech = ssml.speak();

    segments.forEach(segment => {
      const voice = characterVoiceMap.get(segment.character);
      const prosody = { rate: 'medium', pitch: 'medium' }; // Default prosody

      // Add a slight pause for narrator segments to improve pacing.
      if (segment.character.toLowerCase() === 'narrator') {
        speech.pause('300ms');
      }
      
      const p = speech.p(); // Start a new paragraph for each segment
      
      // Use <voice> tag only if a specific character voice is assigned.
      if (voice) {
        const v = p.voice({ name: voice });
        v.prosody(prosody, `(${segment.emotion}) ${segment.dialogue}`);
      } else {
        // Narrator uses the default voice without a <voice> tag.
        p.prosody(prosody, `(${segment.emotion}) ${segment.dialogue}`);
      }

      if (segment.character.toLowerCase() === 'narrator') {
        speech.pause('500ms');
      }
    });

    const ssmlString = speech.end({ pretty: true });

    // Generate the audio using the constructed SSML string.
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
